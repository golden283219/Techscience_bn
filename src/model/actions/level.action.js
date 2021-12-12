import { Level } from '../orms'



export const _levels = ({ skip, limit, order, sort, filter }) => new Promise((resolve, reject) => {
  Level.findAndCountAll({
    where: global.parseJson(filter),
    order: [
      [order, sort]
    ],
    offset: skip,
    limit
  }).then(({ count, rows }) => {
    return resolve({ levels: rows, totalCount: count })
  })
})

export const _levelById = id => new Promise((resolve, reject) => {
  Level.findByPk(id).then(level => resolve(level))
})

export const _createLevel = ({ name }) => new Promise((resolve, reject) => {
  Level.findOne({ where: { name } }).then(level => {
    if (!!level)
      return resolve({ scs: false, msg: 'That Level already exists!' })

    Level.create({ name }).then(level => {
      return resolve({ scs: true, msg: 'Level Created!', level: level.dataValues })
    })
  })
})

export const _editLevel = ({ id, name }) => new Promise((resolve, reject) => {
  Level.findByPk(id).then(level => {
    if (!level)
      return resolve({ scs: false, msg: 'What are you going to edit?' })

    Level.findOne({ where: { name } }).then(exist => {
      if (!!exist)
        return resolve({ scs: false, msg: 'That Level already exists' })

      level.name = name
      level.save()
      return resolve({ scs: true, msg: 'Level Updated!', level: level.dataValues })
    })
  })
})

export const _deleteLevel = id => new Promise((resolve, reject) => {
  Level.findByPk(id).then(level => {
    if (!level)
      return resolve({ scs: false, msg: 'What are you going to delete?' })

    level.destroy()
    return resolve({ scs: true, msg: 'Level Deleted!', level: level.dataValues })
  })
})