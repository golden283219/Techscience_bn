import { UserInputError } from "apollo-server-express";



export const validators = {
  
  Mutation : {

    createExam: (resolve, obj, { createExamReq }, ctx) => {
      const { type, genre } = createExamReq

      if(!['certification', 'practice', 'study', 'example'].includes(type))
        throw new UserInputError('You must provide exact exam type!')

      if(genre !== 'home' && genre !== 'class')
        throw new UserInputError('You must provide exact exam genre!')
        
      return resolve(obj, { createExamReq }, ctx)
    },
    
    editExam: (resolve, obj, { editExamReq }, ctx) => {
      const { type, genre } = editExamReq

      if(!['certification', 'practice', 'study', 'example'].includes(type))
        throw new UserInputError('You must provide exact exam type!')

      if(genre !== 'home' && genre !== 'class')
        throw new UserInputError('You must provide exact exam genre!')
        
      return resolve(obj, { editExamReq }, ctx)
    }
  }
}