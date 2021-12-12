import { readFileSync } from "fs";
import { 
  _accounts, 
  _accountById, 
  _createAccount, 
  _deleteAccount, 
  _editAccount,
  _editAccountImage
} from "../../model/actions/account.action";

export const typeDefs = readFileSync(`${__dirname}/account.graphql`, 'utf8')

export const resolvers = {

  Query: {

    accounts: (parent, { paginateReq }, ctx, info) => {
      return _accounts(paginateReq).then(({ accounts, totalCount }) => {
        return { accounts, totalCount }
      })
    },

    accountById: (parent, { id }, ctx, info) => {
      return _accountById(id).then(account => {
        return account
      })
    }
  },

  Mutation: {

    createAccount: (parent, { createAccountReq }, ctx, info) => {
      return _createAccount(createAccountReq).then(({ scs, msg, account }) => {
        return { scs, msg, account }
      })
    },

    editAccount: (parent, { editAccountReq }, ctx, info) => {
      return _editAccount(editAccountReq).then(({ scs, msg, account }) => {
        return { scs, msg, account }
      })
    },

    editAccountImage: (parent, { editAccountImageReq }, ctx, info) => {
      return _editAccountImage({
        ...editAccountImageReq,
        user: ctx.user
      }).then(res => {
        return res
      })
    },

    deleteAccount: (parent, { id }, ctx, info) => {
      return _deleteAccount(id).then(({ scs, msg, account }) => {
        return { scs, msg, account }
      })
    }
  }
}