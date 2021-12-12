import { Op } from "sequelize";
import moment from 'moment'
import {
  Result,
  Exam,
  User,
  Question,
  Answer,
  Choice
} from '../orms'


export const _results = ({ skip, limit, order, sort, isStudent, userId, accountId }) => new Promise(resolve => {
  let data = {}
  let orderBy = [order, sort]

  switch (order) {
    case 'exam.name':
      orderBy = [Exam, 'name', sort]
      break;

    case 'user.fullname':
      orderBy = [User, 'firstname', sort]
      break;

    default:
      break;
  }

  const option = {
    where: isStudent ? {
      userId
    } : {
        '$exam.accountId$': accountId
      },
    order: [[...orderBy]],
    offset: skip,
    limit,
    include: [Exam, User],
    nest: true
  }

  Result.findAndCountAll({
    ...option,
    where: {
      ...option.where,
      tookAt: {
        [Op.not]: null
      },
      grade: null
    }
  }).then(({ count, rows }) => {
    data = { ...data, pendings: { totalCount: count, results: rows } }

    Result.findAndCountAll({
      ...option,
      where: {
        ...option.where,
        requestedAt: {
          [Op.not]: null
        },
        assignedAt: null
      }
    }).then(({ count, rows }) => {
      data = { ...data, requesteds: { totalCount: count, results: rows } }

      Result.findAndCountAll({
        ...option,
        where: {
          ...option.where,
          grade: {
            [Op.not]: null
          }
        }
      }).then(async ({ count, rows }) => {
        for (let i = 0; i < rows.length; i++) {
          rows[i].answers = await rows[i].getAnswers()
          for (let j = 0; j < rows[i].answers.length; j++) {
            rows[i].answers[j].question = await rows[i].answers[j].getQuestion()
            if(rows[i].answers[j].question.type === 'objective') {
              rows[i].answers[j].answer = (await Choice.findByPk(Number(rows[i].answers[j].answer))).name
            }
          }
        }
        
        data = { ...data, gradeds: { totalCount: count, results: rows } }

        Result.findAndCountAll({
          ...option,
          where: {
            ...option.where,
            assignedAt: {
              [Op.not]: null
            },
            tookAt: null
          }
        }).then(({ count, rows }) => {
          data = { ...data, assigneds: { totalCount: count, results: rows } }
          return resolve(data)
        })
      })
    })
  })
})

export const _answers = ({ skip, limit, order, sort, filter }) => new Promise(resolve => {
  Answer.findAndCountAll({
    where: global.parseJson(filter),
    order: [
      [order, sort]
    ],
    offset: skip,
    limit,
    include: [
      {
        model: Result,
        include: [Exam, User]
      },
      {
        model: Question,
        include: Choice
      }
    ],
    nest: true
  }).then(async ({ count, rows }) => {
    return resolve({ answers: rows, totalCount: count })
  })
})

export const _saveResult = ({ id, totalQuestion, attempedQuestion, tookAt, answers }) => new Promise(resolve => {
  Result.findByPk(id).then(async result => {
    if (!result)
      return resolve({ scs: false, msg: 'What are u going to save?' })

    result.totalQuestion = totalQuestion
    result.attempedQuestion = attempedQuestion
    result.tookAt = tookAt

    const objGrade = {
      count: 0,
      grade: 0
    }

    for (let i = 0; i < answers.length; i++) {
      const answer = new Answer({
        resultId: id,
        questionId: answers[i].questionId,
        answer: answers[i].answer
      })

      if (answers[i].questionType === 'objective') {
        const choice = await Choice.findByPk(Number(answers[i].answer))
        if (!!choice.correct)
          answer.grade = 5
        else
          answer.grade = 0

        objGrade.count = objGrade.count + 1
        objGrade.grade = objGrade.grade + answer.grade
      }

      answer.save()
    }

    if (objGrade.count === answers.length)
      result.grade = Math.round(objGrade.grade / objGrade.count)

    result.save()
    return resolve({ scs: true, msg: 'Result saved!' })
  })
})

export const _gradeResult = ({ id, grades }) => new Promise(resolve => {
  Result.findByPk(id).then(async result => {
    if (!result)
      return resolve({ scs: false, msg: 'What are you going to grade?' })

    for (let i = 0; i < grades.length; i++) {
      const answer = await Answer.findOne({ where: { id: grades[i].id, resultId: id } })

      if (!answer)
        return resolve({ scs: true, msg: 'What are you going to grade?' })

      answer.grade = grades[i].grade
      answer.comment = grades[i].comment
      await answer.save()
    }

    const grade = await Answer.sum('grade', {
      where: { resultId: id }
    })

    result.grade = Math.round(grade / result.attempedQuestion)
    result.save()

    return resolve({ scs: true, msg: 'Result Graded!' })
  })
})

export const _acceptResult = id => new Promise((resolve, reject) => {
  Result.findByPk(id).then(result => {
    if (!result)
      return resolve({ scs: false, msg: 'What are you going to accept?' })

    result.assignedAt = moment().format('YYYY-MM-DD h:mm:ss')
    result.save()
    return resolve({ scs: true, msg: 'Request Accepted!' })
  })
})

export const _deleteResult = id => new Promise((resolve, reject) => {
  Result.findByPk(id).then(result => {
    if (!result)
      return resolve({ scs: false, msg: 'What are you going to delete?' })

    result.destroy()
    return resolve({ scs: true, msg: 'Request Declined!' })
  })
})