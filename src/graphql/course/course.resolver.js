import { readFileSync } from "fs";
import { 
  _courses,
  _courseById, 
  _createCourse, 
  _deleteCourse, 
  _editCourse 
} from "../../model/actions/course.action";

export const typeDefs = readFileSync(`${__dirname}/course.graphql`, 'utf8')

export const resolvers = {

  Query: {

    courses: (parent, { paginateReq }, context, info) => {
      return _courses(paginateReq).then(({ courses, totalCount }) => {
        return { courses, totalCount }
      })
    },

    courseById: (parent, { id }, context, info) => {
      return _courseById(id).then(course => {
        return course
      })
    }
  },

  Mutation: {

    createCourse: (parent, { createCourseReq }, context, info) => {
      return _createCourse(createCourseReq).then(({ scs, msg, course }) => {
        return { scs, msg, course }
      })
    },

    editCourse: (parent, { editCourseReq }, context, info) => {
      return _editCourse(editCourseReq).then(({ scs, msg, course }) => {
        return { scs, msg, course }
      })
    },

    deleteCourse: (parent, { id }, context, info) => {
      return _deleteCourse(id).then(({ scs, msg, course }) => {
        return { scs, msg, course }
      })
    }
  }
}