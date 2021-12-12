import { Choice, Question } from '../orms'



export const _choices = ({ skip, limit, order, sort, filter }) => new Promise((resolve, reject) => {
  Choice.findAndCountAll({
    where: global.parseJson(filter),
    order: [
      [order, sort]
    ],
    offset: skip,
    limit
  }).then(({ count, rows }) => {
    return resolve({ choices: rows, totalCount: count })
  })
})

export const _createChoice = ({ name, questionId, correct, comment }) => new Promise((resolve, reject) => {
  Question.findOne({
    where: {
      id: questionId,
      type: 'objective'
    }
  }).then(question => {
    if (!question)
      return resolve({ scs: false, msg: 'We dont have such question.' })

    // Choice.findOne({ where: { questionId } }).then(choice => {
    //   if (!!choice)
    //     return resolve({ scs: false, msg: 'That Choice already exists!' })

    Choice.create({ name, questionId, correct, comment }).then(choice => {
      return resolve({ scs: true, msg: 'Choice Created!' })
    }).catch(err => {
      return resolve({ scs: true, msg: 'Oops! something went wrong.' })
    })

    // })
  })

})

export const _editChoice = ({ id, questionId, name, correct, comment }) => new Promise((resolve, reject) => {
  Choice.findByPk(id).then(choice => {
    if (!choice)
      return resolve({ scs: false, msg: 'What are you going to edit?' })

    // Choice.findOne({ where: { questionId } }).then(exist => {
    //   if (!!exist && choice.name !== name)
    //     return resolve({ scs: false, msg: 'That Choice already exists' })

    choice.name = name
    choice.correct = correct
    choice.comment = comment
    choice.save()
    return resolve({ scs: true, msg: 'Choice Updated!' })
    // })
  })
})

export const _deleteChoice = id => new Promise((resolve, reject) => {
  Choice.findByPk(id).then(choice => {
    if (!choice)
      return resolve({ scs: false, msg: 'What are you going to delete?' })

    choice.destroy()
    return resolve({ scs: true, msg: 'Choice Deleted!' })
  })
})