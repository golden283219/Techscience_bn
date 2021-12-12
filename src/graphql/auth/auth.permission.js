import { allow } from 'graphql-shield';

export const permissions = {

  Mutation: {

    signin: allow,

    signup: allow

  }
};
