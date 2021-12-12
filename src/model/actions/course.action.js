import { Course, Subject } from '../orms'



export const _courses = ({ skip, limit, order, sort, filter }) => new Promise(resolve => {
  let orderBy = [order, sort]

  switch (order) {
    case 'subject.name':
      orderBy = [Subject, 'name', sort]
      break;

    default:
      break;
  }

  Course.findAndCountAll({
    where: global.parseJson(filter),
    order: [[...orderBy]],
    offset: skip,
    limit,
    include: Subject
  }).then(({ count, rows }) => {
    return resolve({ courses: rows, totalCount: count })
  })
})

export const _courseById = id => new Promise((resolve, reject) => {
  Course.findByPk(id).then(course => resolve(course))
})

export const _createCourse = ({ name, subjectId }) => new Promise((resolve, reject) => {
  Course.findOne({ where: { name } }).then(course => {
    if(!!course)
      return resolve({ scs: false, msg: 'That Course already exists!' })

    Subject.findByPk(subjectId).then(subject => {
      if(!subject)
        return resolve({ scs: false, msg: 'That Subject doesnt exists!' })

      Course.create({ name, subjectId }).then(course => {
        return resolve({ scs: true, msg: 'Course Created!', course: course.dataValues })
      })
    })
  })
})

export const _editCourse = ({ id, name, subjectId }) => new Promise((resolve, reject) => {
  Course.findByPk(id).then(course => {
    if(!course)
      return resolve({ scs: false, msg: 'What are you going to edit?' })

    Course.findOne({ where: { name }}).then(exist => {
      if(!!exist && course.name !== name)
        return resolve({ scs: false, msg: 'That Course already exists' })

      Subject.findByPk(subjectId).then(subject => {
        if(!subject)
          return resolve({ scs: false, msg: 'That Subject doesnt exist' })

        course.name = name
        course.subjectId = subjectId
        course.save()
        return resolve({ scs: true, msg: 'Course Updated!', course: course.dataValues })
      })
    })
  })
})

export const _deleteCourse = id => new Promise((resolve, reject) => {
  Course.findByPk(id).then(course => {
    if(!course)
      return resolve({ scs: false, msg: 'What are you going to delete?' })

    course.destroy()
    return resolve({ scs: true, msg: 'Course Deleted!', course: course.dataValues })
  })
})