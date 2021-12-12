import { allow, deny } from 'graphql-shield';

export const permissions = {

    Query: {
        "*": allow,
        sayHello: allow
    },

    Mutation: {
        "*": allow,
        sayHello: allow
    }
};