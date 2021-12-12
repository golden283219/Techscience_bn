import { allow } from "graphql-shield";
import { isAdmin } from "../../middlewares/shield";

export const permissions = {

  Query: {

    books: allow
  },

  Mutation: {

    publishBook: allow
  }
};
