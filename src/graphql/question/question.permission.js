import { allow } from 'graphql-shield';

export const permissions = {

  Query: {

    questions:  allow,
  },

  Mutation: {

    createQuestion: allow,

    createQuestions: allow,

    editQuestion: allow,

    deleteQuestion: allow
  }
};
