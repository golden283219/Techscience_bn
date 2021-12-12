import { readFileSync } from "fs";
import { 
  _memberships, 
  _membershipById, 
  _createMembership, 
  _editMembership, 
  _deleteMembership 
} from "../../model/actions/membership.action";

export const typeDefs = readFileSync(`${__dirname}/membership.graphql`, 'utf8')

export const resolvers = {

  Query: {

    memberships: (parent, { paginateReq }, context, info) => {
      return _memberships(paginateReq).then(memberships => {
        return memberships
      })
    },

    membershipById: (parent, { id }, context, info) => {
      return _membershipById(id).then(membership => {
        return membership
      })
    }
  },

  Mutation: {

    createMembership: (parent, { createMembershipReq }, context, info) => {
      return _createMembership(createMembershipReq).then(({ scs, msg, membership }) => {
        return { scs, msg, membership }
      })
    },

    editMembership: (parent, { editMembershipReq }, context, info) => {
      return _editMembership(editMembershipReq).then(({ scs, msg, membership }) => {
        return { scs, msg, membership }
      })
    },

    deleteMembership: (parent, { id }, context, info) => {
      return _deleteMembership(id).then(({ scs, msg, membership }) => {
        return { scs, msg, membership }
      })
    }
  }
}