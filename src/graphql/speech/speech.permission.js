import { allow } from 'graphql-shield';

export const permissions = {

	Query: {
		speeches:  allow,
		speechById: allow
	},

	Mutation: {

		createSpeech: allow,

		editSpeech: allow,

		deleteSpeech: allow
	}
};
