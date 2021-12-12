import { allow } from 'graphql-shield';

export const permissions = {

  Query: {

    users:  allow,

    userById: allow,
  },

  Mutation: {

    createUser: allow,

    editUser: allow,

    deleteUser: allow
  }
};
