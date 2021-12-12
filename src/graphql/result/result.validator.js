import { UserInputError } from "apollo-server-express";



export const validators = {

  Mutation: {

    saveResult: (resolve, obj, { saveResultReq }, context) => {
      const { totalQuestion, attempedQuestion } = saveResultReq

      if(attempedQuestion > totalQuestion)
        throw new UserInputError('Invalid attempled questions!')

      return resolve(obj, { saveResultReq }, context)
    }
  }
}