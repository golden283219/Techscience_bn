import { UserInputError } from "apollo-server-express";
import { isAlpha } from "validator";



export const validators = {
  
  Mutation: {

    publishBook: (resolve, obj, { publishBookReq }, ctx) => {
      const { file, text } = publishBookReq

      if((!file && !text) || (!!file && !!text))
        throw new UserInputError('Invalid Request!')

      return resolve(obj, { publishBookReq }, ctx)
    }
  }
}