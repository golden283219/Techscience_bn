import { Op } from "sequelize";
import { compareSync } from "bcrypt";
import { resetMailSender } from "../../middlewares/mailHandler";
import { makeToken, verifyResetToken } from "../../middlewares/tokenHandler";
import { 
  User, 
  Membership, 
  Account, 
  Role 
} from '../orms'



export const _signin = ({ username, password }) => new Promise((resolve, reject) => {
  User.findOne({
    where: {
      username
    },
    include: Account,
    nest: true
  }).then(user => {
    if (!user)
      return resolve({ scs: false, msg: 'Invalid Credential!' })

    if (!compareSync(password, user.password))
      return resolve({ scs: false, msg: 'Invalid Credential!' })

    if (!user.approved)
      return resolve({ scs: false, msg: 'You are not approved yet!' })

    if (!!user.lockedOut)
      return resolve({ scs: false, msg: 'You are locked out!' })

    const token = makeToken({
      payload: {
        ...user.dataValues,
        account: { ...user.dataValues.account.dataValues}
      }
    })

    return resolve({ scs: true, msg: `Success! Hi ${user.username}`, token})
  })
})

export const _signup = data => new Promise((resolve, reject) => {
  const { firstname, lastname, email, username, password, membershipId, accountId } = data
  User.findOne({ where: { email } }).then(user => {
    if (!!user)
      return resolve({ scs: false, msg: 'That email already taken!' })

    User.findOne({ where: { username } }).then(user => {
      if (!!user)
        return resolve({ scs: false, msg: 'That username already taken!' })

      User.create({ firstname, lastname, email, username, password, membershipId, accountId, approved: true }).then(user => {
        return resolve({ scs: true, msg: 'Sign up Success!', user: user.dataValues })
      })
    })
  })
})

export const _changePassword = ({ id, password, newPassword }) => new Promise((resolve, reject) => {
  User.findByPk(id)
    .then(user => {
      if (!user)
        return resolve({ scs: false, msg: 'We cant recognize you!' })

      if (!compareSync(password, user.password))
        return resolve({ scs: false, msg: 'Please provide right password' })

      user.password = newPassword
      user.save()
      return resolve({ scs: true, msg: 'Password Changed Successfully!' })
    })
})

export const _forgotPassword = ({ email }) => new Promise(resolve => {
  User.findOne({ where: { email}}).then(user => {
    if(!user)
      return resolve({ scs: true, msg: 'We sent an email to you with reset link.' })

    const resetToken =  makeToken({
      payload: { email: user.email },
      expiresIn: '1h'
    })

    user.resetToken = resetToken
    user.save()
    console.log('resetToken', resetToken)
    resetMailSender({ receiver: user.email, resetToken })

    return resolve({ scs: true, msg: 'We sent an email to you with reset link.' })
  })
})

export const _resetPassword = ({ newPassword, confirmPassword, resetToken }) => new Promise(resolve => {
  const email = verifyResetToken(resetToken)

  if(!email)
    return resolve({ scs: false, msg: 'Error! Invalid Token Provided!' })

  User.findOne({ where: { email}}).then(user => {
    if(!user)
      return resolve({ scs: false, msg: 'Error! Who are you?' })

    if(user.resetToken !== resetToken)
      return resolve({ scs: false, msg: 'Error! Invalid Token Provided.' })

    user.password = newPassword
    user.resetToken = null
    user.save()
    return resolve({ scs: true, msg: 'Success! Password reseted.' })
  })
})

export const _users = ({ skip, limit, order, sort, filter, userId, userAccountId, isTeacher }) => new Promise((resolve, reject) => {
  let where = {
    ...global.parseJson(filter),
    id: {
      [Op.not]: userId
    }
  }
  if (!!isTeacher)
    where = {
      ...where,
      accountId: userAccountId,
      roleId: 3,
    }

  let orderBy = [order, sort]
  switch (order) {
    case 'fullname':
      orderBy = ['firstname', sort]
      break;

    case 'account.name':
      orderBy = [Account, 'name', sort]
      break;

    case 'role.name':
      orderBy = [Role, 'name', sort]
      break;

    default:
      break;
  }

  User.findAndCountAll({
    where,
    order: [[...orderBy]],
    offset: skip,
    limit,
    include: [Membership, Account, Role],
    nest: true
  }).then(({ count, rows }) => {
    return resolve({ users: rows, totalCount: count })
  })
})

export const _userById = id => new Promise((resolve, reject) => {
  User.findByPk(id).then(user => resolve(user))
})

export const _createUser = ({ firstname, lastname, username, email, password, roleId, accountId, membershipId, approved, lockedOut, userAccountId, isTeacher }) => new Promise((resolve, reject) => {
  User.findOne({ where: { email } }).then(user => {
    if (!!user)
      return resolve({ scs: false, msg: 'That email already taken!' })

    User.findOne({ where: { username } }).then(user => {
      if (!!user)
        return resolve({ scs: false, msg: 'That username already taken!' })

      User.create({
        firstname,
        lastname,
        email,
        username,
        password,
        membershipId,
        accountId: !isTeacher ? accountId : userAccountId,
        roleId: !isTeacher ? roleId : 3,
        approved,
        lockedOut
      }).then(user => {
        return resolve({ scs: true, msg: 'User Created!' })
      })
    })
  })
})

export const _editUser = ({ id, firstname, lastname, username, roleId, membershipId, accountId, approved, lockedOut, userId, userAccountId, isTeacher }) => new Promise((resolve, reject) => {
  if (id === userId)
    return resolve({ scs: false, msg: 'You cant edit yourself!' })

  let where = { id }

  if (!!isTeacher) {
    where = {
      ...where,
      accountId: userAccountId,
      roleId: 3
    }

    accountId = userAccountId
    roleId = 3
  }

  User.findOne({ where }).then(user => {
    if (!user)
      return resolve({ scs: false, msg: 'What are you going to edit?' })

    User.findOne({ where: { username } }).then(exist => {
      if (!!exist && user.username !== username)
        return resolve({ scs: false, msg: 'That username already exists!' })

      Membership.findByPk(membershipId).then(membership => {
        if (!membership)
          return resolve({ scs: false, msg: 'We dont have such membership!' })

        Account.findByPk(accountId).then(account => {
          if (!account)
            return resolve({ scs: false, msg: 'We dont have such account!' })

          Role.findByPk(roleId).then(role => {
            if (!roleId)
              return resolve({ scs: false, msg: 'We dont have such role!' })

            User.update({
              firstname,
              lastname,
              username,
              membershipId,
              accountId: !isTeacher ? accountId : userAccountId,
              approved,
              lockedOut,
              roleId: !isTeacher ? roleId : 3
            }, {
              where: { id }
            }).then(user => resolve({ scs: true, msg: 'User updated!' }))
          })
        })
      })
    })
  })
})

export const _deleteUser = ({ id, userId, userAccountId, isTeacher }) => new Promise((resolve, reject) => {
  if (id === userId)
    return resolve({ scs: false, msg: 'You cant delete yourself!' })

  let where = { id }

  if (!!isTeacher)
    where = {
      ...where,
      accountId: userAccountId,
      roleId: 3
    }

  User.findOne({ where }).then(user => {
    if (!user)
      return resolve({ scs: false, msg: 'What are you going to delete?' })

    user.destroy()
    return resolve({ scs: true, msg: 'User Deleted!', user: user.dataValues })
  })
})