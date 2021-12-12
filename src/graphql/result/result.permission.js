import { allow } from 'graphql-shield';

export const permissions = {

  Query: {

    results:  allow,

    answers: allow
  },

  Mutation: {

    saveResult: allow,

    gradeResult: allow,

    acceptResult: allow,

    deleteResult  : allow
  }
};
