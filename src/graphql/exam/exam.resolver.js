import { readFileSync } from "fs";
import { 
  _exams,
  _examById,
  _assignExam,
  _requestExam,
  _createExam,
  _editExam,
  _deleteExam
} from "../../model/actions/exam.action";

export const typeDefs = readFileSync(`${__dirname}/exam.graphql`, 'utf8')

export const resolvers = {

  Query: {

    exams: (parent, { paginateReq }, ctx, info) => {
      return _exams({ ...paginateReq, accountId: ctx.user.accountId }).then(({ exams, totalCount }) => {
        return { exams, totalCount }
      })
    }
  },

  Mutation: {

    createExam: (parent, { createExamReq }, ctx, info) => {
      return _createExam({ ...createExamReq, accountId: ctx.user.accountId}).then(({ scs, msg }) => {
        return { scs, msg }
      })
    },

    editExam: (parent, { editExamReq }, ctx, info) => {
      return _editExam({ ...editExamReq, accountId: ctx.user.accountId}).then(({ scs, msg }) => {
        return { scs, msg }
      })
    },

    assignExam: (parent, { assignExamReq }, ctx, info) => {
      return _assignExam({ ...assignExamReq, accountId: ctx.user.accountId }).then(({ scs, msg }) => {
        return { scs, msg }
      })
    },

    requestExam: (parent, { id }, ctx, info) => {
      return _requestExam({ id, user: ctx.user }).then(({ scs, msg }) => {
        return { scs, msg }
      })
    },

    deleteExam: (parent, { id }, ctx, info) => {
      return _deleteExam({ id, accountId: ctx.user.accountId }).then(({ scs, msg }) => {
        return { scs, msg }
      })
    }
  }
}