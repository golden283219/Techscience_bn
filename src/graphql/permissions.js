import { permissions as rootPermissions } from "./root/root.permission";
import { permissions as authPermissions } from "./auth/auth.permission";
import { permissions as accountPermissions } from "./account/account.permission";
import { permissions as membershipPermissions } from "./membership/membership.permission";
import { permissions as rolePermissions } from "./role/role.permission";
import { permissions as subjectPermissions } from "./subject/subject.permission";
import { permissions as coursePermissions } from "./course/course.permission";
import { permissions as userPermissions } from "./user/user.permission";
import { permissions as levelPermissions } from "./level/level.permission";
import { permissions as examPermissions } from "./exam/exam.permission";
import { permissions as questionPermissions } from "./question/question.permission";
import { permissions as choicePermissions } from "./choice/choice.permission";
import { permissions as resultPermissions } from "./result/result.permission";
import { permissions as speechPermissions } from "./speech/speech.permission";
import { permissions as contentPermissions } from "./content/content.permission";
import { permissions as missingPermissions } from "./missing/missing.permission";
import { permissions as arithmaticPermissions } from "./arithmatic/arithmatic.permission";

export const permissions = {
  Query: {
    ...rootPermissions.Query,
    ...authPermissions.Query,
    ...accountPermissions.Query,
    ...membershipPermissions.Query,
    ...rolePermissions.Query,
    ...subjectPermissions.Query,
    ...coursePermissions.Query,
    ...userPermissions.Query,
    ...levelPermissions.Query,
    ...examPermissions.Query,
    ...questionPermissions.Query,
    ...choicePermissions.Query,
    ...resultPermissions.Query,
    ...speechPermissions.Query,
    ...contentPermissions.Query,
    ...missingPermissions.Query,
    ...arithmaticPermissions.Query
  },
  Mutation: {
    ...rootPermissions.Mutation,
    ...authPermissions.Mutation,
    ...accountPermissions.Mutation,
    ...membershipPermissions.Mutation,
    ...rolePermissions.Mutation,
    ...subjectPermissions.Mutation,
    ...coursePermissions.Mutation,
    ...userPermissions.Mutation,
    ...levelPermissions.Mutation,
    ...examPermissions.Mutation,
    ...questionPermissions.Mutation,
    ...choicePermissions.Mutation,
    ...resultPermissions.Mutation,
    ...speechPermissions.Mutation,
    ...contentPermissions.Mutation,
    ...missingPermissions.Mutation,
    ...arithmaticPermissions.Mutation
  }
}
