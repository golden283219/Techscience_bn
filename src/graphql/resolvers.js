import { resolvers as rootResolvers } from "./root/root.resolver";
import { resolvers as authResolvers } from "./auth/auth.resolver";
import { resolvers as accountResolvers } from "./account/account.resolver";
import { resolvers as membershipResolvers } from "./membership/membership.resolver";
import { resolvers as roleResolvers } from "./role/role.resolver";
import { resolvers as subjectResolvers } from "./subject/subject.resolver";
import { resolvers as courseResolvers } from "./course/course.resolver";
import { resolvers as userResolvers } from "./user/user.resolver";
import { resolvers as levelResolvers } from "./level/level.resolver";
import { resolvers as examResolvers } from "./exam/exam.resolver";
import { resolvers as questionResolvers } from "./question/question.resolver";
import { resolvers as choiceResolvers } from "./choice/choice.resolver";
import { resolvers as resultResolvers } from "./result/result.resolver";
import { resolvers as speechResolvers } from "./speech/speech.resolver";
import { resolvers as contentResolvers } from "./content/content.resolver";
import { resolvers as missingResolvers } from "./missing/missing.resolver";
import { resolvers as arithmaticResolvers } from "./arithmatic/arithmatic.resolver";

export const resolvers = [ 
  rootResolvers, 
  authResolvers,
  accountResolvers,
  membershipResolvers,
  roleResolvers,
  subjectResolvers,
  courseResolvers,
  userResolvers,
  levelResolvers,
  examResolvers,
  questionResolvers,
  choiceResolvers,
  resultResolvers,
  speechResolvers,
  contentResolvers,
  missingResolvers,
  arithmaticResolvers
]