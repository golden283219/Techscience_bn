import { allow } from 'graphql-shield';

export const permissions = {

  Query: {

    roles:  allow,

    roleById: allow,
  },

  Mutation: {

    createRole: allow,

    editRole: allow,

    deleteRole: allow
  }
};
