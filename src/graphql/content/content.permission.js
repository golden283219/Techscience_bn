import { allow } from 'graphql-shield';

export const permissions = {

	Query: {
		contents:  allow,
		contentById: allow
	},

	Mutation: {

		createContent: allow,

		editContent: allow,

		deleteContent: allow
	}
};
