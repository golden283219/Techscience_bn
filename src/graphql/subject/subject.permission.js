import { allow } from 'graphql-shield';

export const permissions = {

  Query: {

    subjects:  allow,

    subjectById: allow,
  },

  Mutation: {

    createSubject: allow,

    editSubject: allow,

    deleteSubject: allow
  }
};
