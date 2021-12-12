import { Op } from "sequelize";
import moment from 'moment'
import {
  Exam,
  Result,
  Question,
  Choice,
  Account,
  Subject,
  Course,
  User,
  Level
} from '../orms'



export const _exams = ({ skip, limit, order, sort, accountId, filter }) => new Promise(resolve => {
  let orderBy = [order, sort]

  switch (order) {
    case 'subject.name':
      orderBy = [Subject, 'name', sort]
      break;

    case 'course.name':
      orderBy = [Course, 'name', sort]
      break;

    case 'level.name':
      orderBy = [Level, 'name', sort]
      break;

    default:
      break;
  }

  Exam.findAndCountAll({
    where: { ...global.parseJson(filter), accountId },
    order: [[...orderBy]],
    offset: skip,
    limit,
    include: [
      {
        model: Question,
        include: Choice
      },
      {
        model: Result,
        include: User
      },
      Account,
      Subject,
      Course,
      Level
    ],
    nest: true
  }).then(({ count, rows }) => {
    let exams = rows
    exams = exams.map(exam => {
      exam.students = []
      exam.results.map(result => {
        exam.students.push(result.user)
      })
      return exam
    })
    return resolve({ exams, totalCount: rows.length })
  })
})

export const _examById = id => new Promise((resolve, reject) => {
  Exam.findByPk(id, {
    include: [
      {
        model: Question,
        include: Choice
      },
      {
        model: Result,
        include: User
      }
    ],
    nest: true
  }).then(exam => {
    exam.students = []
    exam.results.map(result => {
      exam.students.push(result.user)
    })
    return resolve(exam)
  })
})

export const _createExam = ({ accountId, subjectId, courseId, name, type, levelId, genre, students }) => new Promise((resolve, reject) => {
  Exam.findOne({ where: { name } }).then(exam => {
    if (!!exam)
      return resolve({ scs: false, msg: 'That Exam already exists!' })

    Account.findByPk(accountId).then(account => {
      if (!account) return resolve({ scs: false, msg: 'We dont have such account!' })

      Subject.findByPk(subjectId).then(subject => {
        if (!subject) return resolve({ scs: false, msg: 'We dont have such subject!' })

        Course.findByPk(courseId).then(course => {
          if (!course) return resolve({ scs: false, msg: 'We dont have such course!' })

          if (!students || genre === 'class') {
            Exam.create({ accountId, subjectId, courseId, name, type, levelId, genre })
            return resolve({ scs: true, msg: 'Exam Created!' })
          }

          User.findAll({
            where: {
              id: {
                [Op.in]: students
              }
            }
          }).then(users => {
            if (!users) return resolve({ scs: false, msg: 'We dont have such students!' })
            if (users.length !== students.length) return resolve({ scs: false, msg: 'We dont have such students!' })

            Exam.create({ accountId, subjectId, courseId, name, type, levelId, genre }).then(exam => {
              students.map(student => {
                Result.create({ examId: exam.getDataValue('id'), userId: student, assignedAt: moment().format('YYYY-MM-DD h:mm:ss') })
              })

              return resolve({ scs: true, msg: 'Exam Created!' })
            })
          })
        })
      })
    })
  })
})

export const _editExam = ({ id, accountId, subjectId, courseId, name, type, levelId, genre, students }) => new Promise((resolve, reject) => {
  Exam.findByPk(id).then(exam => {
    if (!exam)
      return resolve({ scs: false, msg: 'What are you going to edit?' })

    Exam.findOne({ where: { name } }).then(exist => {
      if (!!exist && exam.name !== name)
        return resolve({ scs: false, msg: 'That name of Exam already exists' })

      Account.findByPk(accountId).then(account => {
        if (!account) return resolve({ scs: false, msg: 'We dont have such account!' })

        Subject.findByPk(subjectId).then(subject => {
          if (!subject) return resolve({ scs: false, msg: 'We dont have such subject!' })

          Course.findByPk(courseId).then(course => {
            if (!course) return resolve({ scs: false, msg: 'We dont have such course!' })

            if (!students || genre === 'class') {
              exam.accountId = accountId
              exam.subjectId = subjectId
              exam.courseId = courseId
              exam.name = name
              exam.type = type
              exam.levelId = levelId
              exam.genre = genre
              exam.save()

              return resolve({ scs: true, msg: 'Exam Created!' })
            }

            User.findAll({
              where: {
                id: {
                  [Op.in]: students
                }
              }
            }).then(users => {
              if (!users) return resolve({ scs: false, msg: 'We dont have such students!' })
              if (users.length !== students.length) return resolve({ scs: false, msg: 'We dont have such students!' })

              exam.accountId = accountId
              exam.subjectId = subjectId
              exam.courseId = courseId
              exam.name = name
              exam.type = type
              exam.levelId = levelId
              exam.genre = genre
              exam.save()

              Result.destroy({
                where: {
                  examId: id,
                  tookAt: null,
                  userId: {
                    [Op.notIn]: students
                  }
                }
              })

              students.map(student => {
                Result.findOne({
                  where: { examId: id, userId: student }
                }).then(result => {
                  if (!result) Result.create({ examId: id, userId: student, assignedAt: moment().format('YYYY-MM-DD h:mm:ss') })
                })
              })

              return resolve({ scs: true, msg: 'Exam Updated!' })
            })
          })
        })
      })
    })
  })
})

export const _assignExam = ({ examId, students, accountId }) => new Promise((resolve, reject) => {
  Exam.findOne({
    where: {
      id: examId,
      accountId
    }
  }).then(exam => {
    if (!exam)
      return resolve({ scs: false, msg: 'What are you going to assign?' })

    User.findAll({
      where: {
        id: {
          [Op.in]: students
        },
        accountId,
        roleId: 3
      }
    }).then(users => {
      if (!users) return resolve({ scs: false, msg: 'We dont have such students!' })
      if (users.length !== students.length) return resolve({ scs: false, msg: 'We dont have such students!' })

      students.map(student => {
        Result.findOne({
          where: { examId, userId: student }
        }).then(result => {
          if (!result) Result.create({ examId, userId: student, assignedAt: moment().format('YYYY-MM-DD h:mm:ss') })
        })
      })

      return resolve({ scs: true, msg: 'Exam Assigned!' })
    })
  })
})

export const _requestExam = ({ id, user }) => new Promise((resolve, reject) => {
  Exam.findOne({
    where: {
      id, accountId: user.accountId
    }
  }).then(exam => {
    if (!exam)
      return resolve({ scs: false, msg: 'What are you going to request?' })

    Result.findOne({
      where: {
        examId: id,
        userId: user.id
      }
    }).then(result => {
      if (!!result)
        return resolve({ scs: false, msg: 'You already have mutual action with this exam.' })

      Result.create({ examId: id, userId: user.id, requestedAt: moment().format('YYYY-MM-DD h:mm:ss') })

      return resolve({ scs: true, msg: 'Request sent!' })
    })
  })
})

export const _editExamQuestion = ({ id, questions }) => {
  Exam.findByPk(id).then(exam => {
    if (!exam)
      return resolve({ scs: false, msg: 'What are you going to edit?' })

    questions.map(questionItem => {
      if (!!questionItem.id) {
        Question.update({ name: questionItem.name }, {
          where: { id: questionItem.id, examId: id }
        })
        return questionItem.choices.map(choiceItem => {
          if (!!choiceItem.id)
            return Choice.update({
              name: choice.name,
              comment: choice.comment,
              correct: choice.correct
            }, {
              where: { id: choiceItem.id, questionId: questionItem.id }
            })

          Choice.create({ questionId: questionItem.id, comment: choiceItem.comment, correct: choiceItem.correct })
        })
      }

      Question.create({ examId: id, name: questionItem.name })
      return questionItem.choices.map(choiceItem => {
        return Choice.create({ questionId: questionItem.id, comment: choiceItem.comment, correct: choiceItem.correct })
      })
    })
  })
}

export const _deleteExam = ({ id, accountId }) => new Promise((resolve, reject) => {
  Exam.findOne({
    where: { id, accountId }
  }).then(exam => {
    if (!exam)
      return resolve({ scs: false, msg: 'What are you going to delete?' })

    exam.destroy()
    return resolve({ scs: true, msg: 'Exam Deleted!', exam: exam.dataValues })
  })
})