import { ApolloServer, ForbiddenError } from "apollo-server-express";
import depthLimit from 'graphql-depth-limit'
import { createComplexityLimitRule } from "graphql-validation-complexity";
import { makeExecutableSchema } from "graphql-tools"
import { applyMiddleware } from "graphql-middleware";
import { shield } from "graphql-shield";
import { verifyToken } from "../middlewares/tokenHandler";
import { typeDefs } from './typeDefs'
import { resolvers } from './resolvers'
import { validators } from './validators'
import { permissions } from './permissions'

const schema = applyMiddleware(
  makeExecutableSchema({ typeDefs, resolvers }),
  validators,
  shield(permissions, {
    allowExternalErrors: true,
    fallbackError: new ForbiddenError('Not Authorized!')
  })
)

const server = new ApolloServer({
  schema,
  context: ({ req, res }) => {
    const ctx = {}
    ctx.user = verifyToken(req)
    return ctx
  },
  introspection: true,
  validationRules: [
    depthLimit(10),
    createComplexityLimitRule(10000)
  ]
})

export default server
