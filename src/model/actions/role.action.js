import { Role, User } from '../orms'



export const _roles = ({ skip, limit, order, sort, filter }) => new Promise((resolve, reject) => {
  Role.findAndCountAll({
    where: global.parseJson(filter),
    order: [
      [order, sort]
    ],
    offset: skip,
    limit
  }).then(({ count, rows }) => {
    console.log(rows)
    return resolve({ totalCount: count, roles: rows })
  })
})

export const _roleById = id => new Promise((resolve, reject) => {
  Role.findByPk(id).then(role => resolve(role))
})

export const _createRole = ({ name }) => new Promise((resolve, reject) => {
  Role.findOne({ where: { name } }).then(role => {
    if (!!role)
      return resolve({ scs: false, msg: 'That Role already exists!' })

    Role.create({ name }).then(role => {
      return resolve({ scs: true, msg: 'Role Created!', role: role.dataValues })
    })
  })
})

export const _editRole = ({ id, name }) => new Promise((resolve, reject) => {
  Role.findByPk(id).then(role => {
    if (!role)
      return resolve({ scs: false, msg: 'What are you going to edit?' })

    Role.findOne({ where: { name } }).then(exist => {
      if (!!exist)
        return resolve({ scs: false, msg: 'That Role already exists' })

      role.name = name
      role.save()
      return resolve({ scs: true, msg: 'Role Updated!', role: role.dataValues })
    })
  })
})

export const _deleteRole = id => new Promise((resolve, reject) => {
  Role.findByPk(id).then(role => {
    if (!role)
      return resolve({ scs: false, msg: 'What are you going to delete?' })

    role.destroy()
    return resolve({ scs: true, msg: 'Role Deleted!', role: role.dataValues })
  })
})