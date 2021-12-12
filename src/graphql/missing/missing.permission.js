import { allow } from 'graphql-shield';

export const permissions = {

	Query: {
		missingLetters:  allow,
		missingById: allow
	},

	Mutation: {

		createMissing: allow,

		editMissing: allow,

		deleteMissing: allow
	}
};
