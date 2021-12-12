import { UserInputError } from "apollo-server-express";
import PasswordValidator from "password-validator";
import { isEmail } from "validator";



const passwordSchema = new PasswordValidator()
  .is().min(6)
  .has().letters()
  .has().digits()
  .has().symbols()
  .has().not().spaces()



export const validators = {

  Mutation: {

    createUser: (resolve, parent, { createUserReq }, context) => {
      const { email, password, confirmPassword } = createUserReq

      if (!isEmail(email))
        throw new UserInputError('You must provide exact email address!')

      if (password != confirmPassword)
        throw new UserInputError('Password not match!')

      if (!passwordSchema.validate(password))
        throw new UserInputError('Password is not strong enough!')

      return resolve(parent, { createUserReq }, context)
    },

    editUser: (resolve, parent, { editUserReq }, context) => {
      const { email } = editUserReq

      if (!isEmail(email))
        throw new UserInputError('You must provide exact email address!')

      return resolve(parent, { editUserReq }, context)
    },
  }
}