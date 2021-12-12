import { allow } from 'graphql-shield';

export const permissions = {

  Query: {

    memberships:  allow,

    membershipById: allow,
  },

  Mutation: {

    createMembership: allow,

    editMembership: allow,

    deleteMembership: allow
  }
};
