import { Subject } from '../orms'



export const _subjects = ({ skip, limit, order, sort, filter }) => new Promise((resolve, reject) => {
  Subject.findAndCountAll({
    where: global.parseJson(filter),
    order: [
      [order, sort]
    ],
    offset: skip,
    limit
  }).then(({ count, rows }) => {
    return resolve({ subjects: rows, totalCount: count })
  })
})

export const _subjectById = id => new Promise((resolve, reject) => {
  Subject.findByPk(id).then(subject => resolve(subject))
})

export const _createSubject = ({ name }) => new Promise((resolve, reject) => {
  Subject.findOne({ where: { name } }).then(subject => {
    if (!!subject)
      return resolve({ scs: false, msg: 'That Subject already exists!' })

    Subject.create({ name }).then(subject => {
      return resolve({ scs: true, msg: 'Subject Created!', subject: subject.dataValues })
    })
  })
})

export const _editSubject = ({ id, name }) => new Promise((resolve, reject) => {
  Subject.findByPk(id).then(subject => {
    if (!subject)
      return resolve({ scs: false, msg: 'What are you going to edit?' })

    Subject.findOne({ where: { name } }).then(exist => {
      if (!!exist)
        return resolve({ scs: false, msg: 'That Subject already exists' })

      subject.name = name
      subject.save()
      return resolve({ scs: true, msg: 'Subject Updated!', subject: subject.dataValues })
    })
  })
})

export const _deleteSubject = id => new Promise((resolve, reject) => {
  Subject.findByPk(id).then(subject => {
    if (!subject)
      return resolve({ scs: false, msg: 'What are you going to delete?' })

    subject.destroy()
    return resolve({ scs: true, msg: 'Subject Deleted!', subject: subject.dataValues })
  })
})