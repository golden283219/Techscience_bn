import { readFileSync } from "fs";
import {
  _results,
  _answers,
  _gradeResult,
  _acceptResult,
  _deleteResult,
  _saveResult
} from "../../model/actions/result.action";

export const typeDefs = readFileSync(`${__dirname}/result.graphql`, 'utf8')

export const resolvers = {

  Query: {

    results: (parent, { paginateReq }, context, info) => {
      const { id, accountId, roleId } = context.user

      return _results({
        ...paginateReq,
        userId: id,
        accountId,
        isStudent: Number(roleId) === 3
      }).then(data => {
        return data
      })
    },

    answers: (parent, { paginateReq }, context, info) => {

      return _answers(paginateReq).then(({ totalCount, answers }) => {
        return { totalCount, answers }
      })
    }
  },

  Mutation: {

    saveResult: (parent, { saveResultReq }, ctx, info) => {
      return _saveResult(saveResultReq).then(({ scs, msg }) => {
        return { scs, msg }
      })
    },

    gradeResult: (parent, { gradeResultReq }, context, info) => {
      return _gradeResult(gradeResultReq).then(({ scs, msg }) => {
        return { scs, msg }
      })
    },

    acceptResult: (parent, { id }, context, info) => {
      return _acceptResult(id).then(({ scs, msg }) => {
        return { scs, msg }
      })
    },

    deleteResult: (parent, { id }, context, info) => {
      return _deleteResult(id).then(({ scs, msg }) => {
        return { scs, msg }
      })
    }
  }
}