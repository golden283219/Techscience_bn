import { readFileSync } from "fs";
import { 
 _publishBook
} from "../../model/actions/book.action";

export const typeDefs = readFileSync(`${__dirname}/book.graphql`, 'utf8')

export const resolvers = {

  Query: {

    books: (parent, { paginateReq }, ctx, info) => {
      // return _accounts(paginateReq).then(({ accounts, totalCount }) => {
      //   return { accounts, totalCount }
      // })
    }
  },

  Mutation: {

    publishBook: (parent, { publishBookReq }, ctx, info) => {
      return _publishBook({
        ...publishBookReq,
        userId: ctx.user.id
      }).then(result => {
        return result
      })
    }
  }
}