import { allow } from 'graphql-shield';

export const permissions = {

  Query: {

    levels:  allow,

    levelById: allow,
  },

  Mutation: {

    createLevel: allow,

    editLevel: allow,

    deleteLevel: allow
  }
};
