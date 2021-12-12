import { allow } from "graphql-shield";
import { isAdmin } from "../../middlewares/shield";

export const permissions = {

  Query: {

    accounts:  allow,

    accountById: isAdmin,
  },

  Mutation: {

    createAccount: isAdmin,

    editAccount: isAdmin,

    editAccountImage: allow,

    deleteAccount: isAdmin
  }
};
