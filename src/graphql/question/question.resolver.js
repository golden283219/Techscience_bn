import { readFileSync } from "fs";
import {
  _questions,
  _createQuestion,
  _createQuestions,
  _editQuestion,
  _deleteQuestion
} from "../../model/actions/question.action";

export const typeDefs = readFileSync(`${__dirname}/question.graphql`, 'utf8')

export const resolvers = {

  Query: {

    questions: (parent, { paginateReq }, ctx, info) => {
      return _questions(paginateReq).then(({ questions, totalCount }) => {
        return { questions, totalCount }
      })
    },
  },

  Mutation: {

    createQuestion: (parent, { createQuestionReq }, ctx, info) => {
      return _createQuestion(createQuestionReq).then(({ scs, msg, question }) => {
        console.log(question);
        return { scs, msg, question }
      })
    },

    createQuestions: (parent, { createQuestionsReq }, ctx, info) => {
      return _createQuestions(createQuestionsReq).then(result => {
        return result
      })
    },

    editQuestion: async (parent, { editQuestionReq }, ctx, info) => {
      return _editQuestion(editQuestionReq).then(({ scs, msg }) => {
        return { scs, msg }
      })
    },

    deleteQuestion: (parent, { id }, ctx, info) => {
      return _deleteQuestion(id).then(({ scs, msg }) => {
        return { scs, msg }
      })
    }
  }
}