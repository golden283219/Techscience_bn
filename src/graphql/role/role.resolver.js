import { readFileSync } from "fs";
import { 
  _roles,
  _roleById,
  _createRole,
  _editRole,
  _deleteRole
} from "../../model/actions/role.action";

export const typeDefs = readFileSync(`${__dirname}/role.graphql`, 'utf8')

export const resolvers = {

  Query: {

    roles: (parent, { paginateReq }, context, info) => {
      return _roles(paginateReq).then(roles => {
        return roles
      })
    },

    roleById: (parent, { id }, context, info) => {
      return _roleById(id).then(role => {
        return role
      })
    }
  },

  Mutation: {

    createRole: (parent, { createRoleReq }, context, info) => {
      return _createRole(createRoleReq).then(({ scs, msg, role }) => {
        return { scs, msg, role }
      })
    },

    editRole: (parent, { editRoleReq }, context, info) => {
      return _editRole(editRoleReq).then(({ scs, msg, role }) => {
        return { scs, msg, role }
      })
    },

    deleteRole: (parent, { id }, context, info) => {
      return _deleteRole(id).then(({ scs, msg, role }) => {
        return { scs, msg, role }
      })
    }
  }
}