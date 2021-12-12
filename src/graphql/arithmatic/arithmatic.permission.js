import { allow } from 'graphql-shield';

export const permissions = {

	Query: {
		arithmatics:  allow,
		arithmaticById: allow
	},

	Mutation: {

		createArithmatic: allow,

		editArithmatic: allow,

		deleteArithmatic: allow
	}
};
