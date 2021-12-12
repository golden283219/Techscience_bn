import { readFileSync } from "fs";
import { _arithmatics, _arithmaticById, _createArithmatic, _deleteArithmatic, _editArithmatic } from "../../model/actions/arithmatic.action";

export const typeDefs = readFileSync(`${__dirname}/arithmatic.graphql`, "utf8");

export const resolvers = {

	Query: {

		arithmatics: (parent, { paginateReq }, context, info) => {
			return _arithmatics(paginateReq).then(({ arithmatics, totalCount }) => {
				return { arithmatics, totalCount };
			});
		},

		arithmaticById: (parent, { id }, context, info) => {
			return _arithmaticById(id).then(arithmatic => {
				return arithmatic;
			});
		},
	},

	Mutation: {

		createArithmatic: (parent, { createArithmaticReq }, context, info) => {
			return _createArithmatic(createArithmaticReq).then(({ scs, msg }) => {
				return { scs, msg };
			});
		},

		editArithmatic: (parent, { editArithmaticReq }, context, info) => {
			return _editArithmatic(editArithmaticReq).then(({ scs, msg }) => {
				return { scs, msg };
			});
		},

		deleteArithmatic: (parent, { id }, context, info) => {
			return _deleteArithmatic(id).then(({ scs, msg }) => {
				return { scs, msg };
			});
		},
	},
};