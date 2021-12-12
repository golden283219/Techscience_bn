import { readFileSync } from "fs";
import { 
  _levels,
  _levelById,
  _createLevel,
  _editLevel,
  _deleteLevel
} from "../../model/actions/level.action";

export const typeDefs = readFileSync(`${__dirname}/level.graphql`, 'utf8')

export const resolvers = {

  Query: {

    levels: (parent, { paginateReq }, context, info) => {
      return _levels(paginateReq).then(({ levels, totalCount }) => {
        return { levels, totalCount }
      })
    },

    levelById: (parent, { id }, context, info) => {
      return _levelById(id).then(level => {
        return level
      })
    }
  },

  Mutation: {

    createLevel: (parent, { createLevelReq }, context, info) => {
      return _createLevel(createLevelReq).then(({ scs, msg, level }) => {
        return { scs, msg, level }
      })
    },

    editLevel: (parent, { editLevelReq }, context, info) => {
      return _editLevel(editLevelReq).then(({ scs, msg, level }) => {
        return { scs, msg, level }
      })
    },

    deleteLevel: (parent, { id }, context, info) => {
      return _deleteLevel(id).then(({ scs, msg, level }) => {
        return { scs, msg, level }
      })
    }
  }
}