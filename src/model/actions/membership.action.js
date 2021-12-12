import { async } from 'regenerator-runtime'
import { Membership } from '../orms'



export const _memberships = ({ skip, limit, order, sort, filter }) => new Promise((resolve, reject) => {
  Membership.findAndCountAll({
    where: global.parseJson(filter),
    order: [
      [order, sort]
    ],
    offset: skip,
    limit
  }).then(({ count, rows }) => {
    return resolve({ totalCount: count, memberships: rows })
  })
})

export const _membershipById = id => new Promise((resolve, reject) => {
  Membership.findByPk(id).then(membership => resolve(membership))
})

export const _createMembership = ({ name }) => new Promise((resolve, reject) => {
  Membership.findOne({ where: { name } }).then(membership => {
    if (!!membership)
      return resolve({ scs: false, msg: 'That membership already exists!' })

    Membership.create({ name }).then(membership => {
      return resolve({ scs: true, msg: 'Membership Created!', membership: membership.dataValues })
    })
  })
})

export const _editMembership = ({ id, name }) => new Promise((resolve, reject) => {
  Membership.findByPk(id).then(membership => {
    if (!membership)
      return resolve({ scs: false, msg: 'What are you going to edit?' })

    Membership.findOne({ where: { name } }).then(exist => {
      if (!!exist)
        return resolve({ scs: false, msg: 'That Membership already exists' })

      membership.name = name
      membership.save()
      return resolve({ scs: true, msg: 'Membership Updated!', membership: membership.dataValues })
    })
  })
})

export const _deleteMembership = id => new Promise((resolve, reject) => {
  Membership.findByPk(id).then(membership => {
    if (!membership)
      return resolve({ scs: false, msg: 'What are you going to delete?' })

    membership.destroy()
    return resolve({ scs: true, msg: 'Membership Deleted!', membership: membership.dataValues })
  })
})