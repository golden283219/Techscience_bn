import { rule } from "graphql-shield";



export const isAuthenticated = rule({ cache: 'contextual' })(
  (parent, args, { user }, info) => !!user
)

export const isAdmin = rule({ cache: 'contextual' })(
 (parent, arg, { user }, info) => !!user && user.roleId == 1)

export const isTeacher = rule({ cache: 'contextual' })(
 (parent, arg, { user }, info) => !!user && (user.roleId == 2 || user.roleId == 1)
)