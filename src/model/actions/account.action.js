import { async } from 'regenerator-runtime'
import { Op } from "sequelize";
import { Account, User } from '../orms'
import { fileUploader, fileRemover } from "../../middlewares/fileHander";



export const _accounts = ({ skip, limit, order, sort, filter }) => new Promise((resolve, reject) => {
  Account.findAndCountAll({
    where: global.parseJson(filter),
    order: [
      [order, sort]
    ],
    offset: skip,
    limit
  }).then(async ({ count, rows }) => {
    for (let i = 0; i < rows.length; i++) {
      let user = await User.findByPk(rows[i].userId)
      rows[i].user = user
    }
    
    return resolve({ accounts: rows, totalCount: count })
  })
})

export const _accountById = id => new Promise((resolve, reject) => {
  Account.findByPk(id).then(account => {
    User.findByPk(account.userId).then(user => {
      account.user = user
      return resolve(account)
    })
  })
})

export const _createAccount = ({ name, userId }) => new Promise((resolve, reject) => {
  Account.findOne({ where: { name } }).then(account => {
    if (!!account)
      return resolve({ scs: false, msg: 'That account already exists!' })

    if (!!userId) {
      return User.findByPk(userId).then(user => {
        if (!user)
          return resolve({ scs: false, msg: 'That user doesnt exists!' })

        Account.create({ name, userId }).then(account => {
          return resolve({ scs: true, msg: 'Account Created!', account: account.dataValues })
        })
      })
    }

    return Account.create({ name }).then(account => {
      return resolve({ scs: true, msg: 'Account Created!', account: account.dataValues })
    })

  })
})

export const _editAccount = ({ id, name, userId }) => new Promise((resolve, reject) => {
  Account.findByPk(id).then(account => {
    if (!account)
      return resolve({ scs: false, msg: 'What are you going to edit?' })

    Account.findOne({ where: { name } }).then(exist => {
      if (!!exist && account.name != name)
        return resolve({ scs: false, msg: 'That account already exists' })

      if (!!userId)
        return User.findByPk(userId).then(user => {
          if (!user)
            return resolve({ scs: false, msg: 'That user doesnt exist' })

          account.name = name
          account.userId = userId
          account.save()
          return resolve({ scs: true, msg: 'Account Updated!', account: account.dataValues })
        })

      account.name = name
      account.userId = userId
      account.save()
      return resolve({ scs: true, msg: 'Account Updated!', account: account.dataValues })
    })
  })
})

export const _editAccountImage = ({ image, user }) => new Promise(resolve => {
  if(user.id !== user.account.userId)
    return resolve({ scs: false, msg: 'Error! You are not account admin.'})

  Account.findByPk(user.account.id).then(async account => {
    if(!account)
      return resolve({ scs: false, msg: 'Error! where are you from?' })
      
    const { url, error } = await fileUploader({ file: image, type: 'account' })

    if (!!error)
      return resolve({ scs: false, msg: error })

    account.image = url
    account.save()
    return resolve({ scs: true, msg: 'Success! School Logo Updated. Please sign in again to see change. ' })
  })
})

export const _deleteAccount = id => new Promise((resolve, reject) => {
  Account.findByPk(id).then(account => {
    if (!account)
      return resolve({ scs: false, msg: 'What are you going to delete?' })

    account.destroy()
    return resolve({ scs: true, msg: 'Success! Account Deleted.', account: account.dataValues })
  })
})