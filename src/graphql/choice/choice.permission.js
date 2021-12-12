import { allow } from 'graphql-shield';

export const permissions = {

  Query: {

    choices:  allow,
  },

  Mutation: {

    createChoice: allow,

    editChoice: allow,

    deleteChoice: allow
  }
};
