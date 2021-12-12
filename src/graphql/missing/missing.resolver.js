import { readFileSync } from "fs";
import { _missingLetters, _missingById, _createMissing, _deleteMissing, _editMissing } from "../../model/actions/missing.action";

export const typeDefs = readFileSync(`${__dirname}/missing.graphql`, "utf8");

export const resolvers = {

	Query: {

		missingLetters: (parent, { paginateReq }, context, info) => {
			return _missingLetters(paginateReq).then(({ missingLetters, totalCount }) => {
				return { missingLetters, totalCount };
			});
		},

		missingById: (parent, { id }, context, info) => {
			return _missingById(id).then(missing => {
				return missing;
			});
		},
	},

	Mutation: {

		createMissing: (parent, { createMissingReq }, context, info) => {
			return _createMissing(createMissingReq).then(({ scs, msg }) => {
				return { scs, msg };
			});
		},

		editMissing: (parent, { editMissingReq }, context, info) => {
			return _editMissing(editMissingReq).then(({ scs, msg }) => {
				return { scs, msg };
			});
		},

		deleteMissing: (parent, { id }, context, info) => {
			return _deleteMissing(id).then(({ scs, msg }) => {
				return { scs, msg };
			});
		},
	},
};