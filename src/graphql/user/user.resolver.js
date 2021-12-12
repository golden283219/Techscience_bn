import { readFileSync } from "fs";
import {
  _users,
  _userById,
  _createUser,
  _editUser,
  _deleteUser
} from "../../model/actions/user.action";

export const typeDefs = readFileSync(`${__dirname}/user.graphql`, 'utf8')

export const resolvers = {

  Query: {

    users: (parent, { paginateReq }, ctx, info) => {
      return _users({
        ...paginateReq,
        userId: ctx.user.id,
        userAccountId: ctx.user.accountId,
        isTeacher: ctx.user.roleId === 2
      }).then(({ users, totalCount }) => {
        return { users, totalCount }
      })
    },

    userById: (parent, { id }, ctx, info) => {
      return _userById(id).then(user => {
        return user
      })
    }
  },

  Mutation: {

    createUser: (parent, { createUserReq }, ctx, info) => {
      return _createUser({
        ...createUserReq,
        userAccountId: ctx.user.accountId,
        isTeacher: ctx.user.roleId === 2
      }).then(({ scs, msg }) => {
        return { scs, msg }
      })
    },

    editUser: (parent, { editUserReq }, ctx, info) => {
      return _editUser({
        ...editUserReq,
        userId: ctx.user.id,
        userAccountId: ctx.user.accountId,
        isTeacher: ctx.user.roleId === 2
      }).then(({ scs, msg }) => {
        return { scs, msg }
      })
    },

    deleteUser: (parent, { id }, ctx, info) => {
      return _deleteUser({
        id,
        userId: ctx.user.id,
        userAccountId: ctx.user.accountId,
        isTeacher: ctx.user.roleId === 2
      }).then(({ scs, msg, user }) => {
        return { scs, msg, user }
      })
    }
  }
}