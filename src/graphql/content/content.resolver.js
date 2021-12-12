import { readFileSync } from "fs";
import { _createContent, _deleteContent, _editContent, _contentById, _contents } from "../../model/actions/content.action";

export const typeDefs = readFileSync(`${__dirname}/content.graphql`, "utf8");

export const resolvers = {

	Query: {

		contents: (parent, { paginateReq }, context, info) => {
			return _contents(paginateReq).then(({ contents, totalCount }) => {
				return { contents, totalCount };
			});
		},

		contentById: (parent, { id }, context, info) => {
			return _contentById(id).then(content => {
				return content;
			});
		},
	},

	Mutation: {

		createContent: (parent, { createContentReq }, context, info) => {
			return _createContent(createContentReq).then(({ scs, msg }) => {
				return { scs, msg };
			});
		},

		editContent: (parent, { editContentReq }, context, info) => {
			return _editContent(editContentReq).then(({ scs, msg }) => {
				return { scs, msg };
			});
		},

		deleteContent: (parent, { id }, context, info) => {
			return _deleteContent(id).then(({ scs, msg }) => {
				return { scs, msg };
			});
		},
	},
};