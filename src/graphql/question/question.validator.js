import { UserInputError } from "apollo-server-express";



export const validators = {
  
  Mutation : {

    createQuestion: (resolve, obj, { createQuestionReq }, ctx) => {
      const { type } = createQuestionReq

      if(!['objective', 'subjective'].includes(type))
        throw new UserInputError('You must provide exact exam type!')

      return resolve(obj, { createQuestionReq }, ctx)
    },

    editQuestion: (resolve, obj, { editQuestionReq }, ctx) => {
      const { type } = editQuestionReq

      if(!['objective', 'subjective'].includes(type))
        throw new UserInputError('You must provide exact exam type!')

      return resolve(obj, { editQuestionReq }, ctx)
    },
  }
}