import { readFileSync } from "fs";
import { 
  _choices,
  _createChoice,
  _editChoice,
  _deleteChoice
} from "../../model/actions/choice.action";

export const typeDefs = readFileSync(`${__dirname}/choice.graphql`, 'utf8')

export const resolvers = {

  Query: {

    choices: (parent, { paginateReq }, context, info) => {
      return _choices(paginateReq).then(({ choices, totalCount }) => {
        return { choices, totalCount }
      })
    },
  },

  Mutation: {

    createChoice: (parent, { createChoiceReq }, context, info) => {
      return _createChoice(createChoiceReq).then(({ scs, msg }) => {
        return { scs, msg }
      })
    },

    editChoice: (parent, { editChoiceReq }, context, info) => {
      return _editChoice(editChoiceReq).then(({ scs, msg }) => {
        return { scs, msg }
      })
    },

    deleteChoice: (parent, { id }, context, info) => {
      return _deleteChoice(id).then(({ scs, msg }) => {
        return { scs, msg }
      })
    }
  }
}