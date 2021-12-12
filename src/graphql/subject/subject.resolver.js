import { readFileSync } from "fs";
import { 
  _subjects,
  _subjectById,
  _createSubject,
  _editSubject,
  _deleteSubject
} from "../../model/actions/subject.action";

export const typeDefs = readFileSync(`${__dirname}/subject.graphql`, 'utf8')

export const resolvers = {

  Query: {

    subjects: (parent, { paginateReq }, context, info) => {
      return _subjects(paginateReq).then(({ subjects, totalCount }) => {
        return { subjects, totalCount }
      })
    },

    subjectById: (parent, { id }, context, info) => {
      return _subjectById(id).then(subject => {
        return subject
      })
    }
  },

  Mutation: {

    createSubject: (parent, { createSubjectReq }, context, info) => {
      return _createSubject(createSubjectReq).then(({ scs, msg, subject }) => {
        return { scs, msg, subject }
      })
    },

    editSubject: (parent, { editSubjectReq }, context, info) => {
      return _editSubject(editSubjectReq).then(({ scs, msg, subject }) => {
        return { scs, msg, subject }
      })
    },

    deleteSubject: (parent, { id }, context, info) => {
      return _deleteSubject(id).then(({ scs, msg, subject }) => {
        return { scs, msg, subject }
      })
    }
  }
}