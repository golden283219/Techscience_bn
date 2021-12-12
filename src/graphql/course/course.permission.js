import { allow } from 'graphql-shield';

export const permissions = {

  Query: {

    courses:  allow,

    courseById: allow,
  },

  Mutation: {

    createCourse: allow,

    editCourse: allow,

    deleteCourse: allow
  }
};
