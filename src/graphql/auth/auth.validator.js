import { UserInputError } from "apollo-server-express";
import PasswordValidator from "password-validator";
import { isEmail } from "validator";



const passwordSchema = new PasswordValidator()
  .is().min(6)
  .has().uppercase()
  .has().letters()
  .has().digits()
  .has().symbols()
  .has().not().spaces()

export const validators = {

  Mutation: {

    signup: (resolve, obj, { signupReq }, ctx) => {
      const { email, password, confirmPassword } = signupReq

      if (!isEmail(email))
        throw new UserInputError('You must provide exact email address!')

      if (password != confirmPassword)
        throw new UserInputError('Password not match!')

      if (!passwordSchema.validate(password))
        throw new UserInputError('Password is not strong enough!')

      return resolve(obj, { signupReq }, ctx)
    },

    changePassword: (resolve, obj, { changePasswordReq }, ctx) => {
      const { newPassword, confirmPassword } = changePasswordReq

      if (newPassword !== confirmPassword)
        throw new UserInputError('Password not match!')

      if (!passwordSchema.validate(newPassword))
        throw new UserInputError('Password is not strong enough!')

      return resolve(obj, { changePasswordReq }, ctx)
    },

    forgotPassword: (resolve, obj, { forgotPasswordReq }, ctx) => {
      const { email } = forgotPasswordReq

      if(!isEmail(email))
        throw new UserInputError('You must provide exact email address!')

      return resolve(obj, { forgotPasswordReq }, ctx)
    },

    resetPassword: (resolve, obj, { resetPasswordReq }, ctx) => {
      const { newPassword, confirmPassword } = resetPasswordReq

      if (newPassword !== confirmPassword)
        throw new UserInputError('Password not match!')

      if (!passwordSchema.validate(newPassword))
        throw new UserInputError('Password is not strong enough!')

      return resolve(obj, { resetPasswordReq }, ctx)
    }
  }
}