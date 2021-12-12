import { allow } from 'graphql-shield';

export const permissions = {

  Query: {

    exams:  allow
  },

  Mutation: {

    createExam: allow,

    editExam: allow,

    assignExam: allow,

    requestExam: allow,

    deleteExam: allow
  }
};
