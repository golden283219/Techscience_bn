import { readFileSync } from "fs";
import { sign } from "jsonwebtoken";
import {
  _signin,
  _signup,
  _changePassword,
  _forgotPassword,
  _resetPassword
} from "../../model/actions/user.action";

export const typeDefs = readFileSync(`${__dirname}/auth.graphql`, 'utf8')

export const resolvers = {

  Mutation: {

    signin: (parent, { signinReq }, ctx, info) => {
      return _signin(signinReq)
        .then(({ scs, msg, token }) => {
          return { scs, msg, token }
        })
    },

    signup: (parent, { signupReq }, ctx, info) => {
      return _signup(signupReq)
        .then(({ scs, user, msg }) => {
          if (!scs)
            return { scs, msg }

          const token = sign(user, process.env.APP_KEY, { expiresIn: '12h' })

          return { scs, msg, token }
        })
    },

    changePassword: (parent, { changePasswordReq }, ctx, info) => {
      const { id } = ctx.user
      return _changePassword({ id, ...changePasswordReq }).then(({ scs, msg }) => {
        return { scs, msg }
      })
    },

    forgotPassword: (parent, { forgotPasswordReq }, ctx, info) => {
      return _forgotPassword(forgotPasswordReq).then(({ scs, msg }) => {
        return { scs, msg }
      })
    },

    resetPassword: (parent, { resetPasswordReq }, ctx, info) => {
      return _resetPassword(resetPasswordReq).then(({ scs, msg }) => {
        return { scs, msg }
      })
    }
  }
}