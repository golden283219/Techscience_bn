import { typeDefs as rootTypeDefs } from "./root/root.resolver";
import { typeDefs as authTypeDefs } from "./auth/auth.resolver";
import { typeDefs as accountTypeDefs } from "./account/account.resolver";
import { typeDefs as membershipTypeDefs } from "./membership/membership.resolver";
import { typeDefs as roleTypeDefs } from "./role/role.resolver";
import { typeDefs as subjectTypeDefs } from "./subject/subject.resolver";
import { typeDefs as courseTypeDefs } from "./course/course.resolver";
import { typeDefs as userTypeDefs } from "./user/user.resolver";
import { typeDefs as levelTypeDefs } from "./level/level.resolver";
import { typeDefs as examTypeDefs } from "./exam/exam.resolver";
import { typeDefs as questionTypeDefs } from "./question/question.resolver";
import { typeDefs as choiceTypeDefs } from "./choice/choice.resolver";
import { typeDefs as resultTypeDefs } from "./result/result.resolver";
import { typeDefs as speechTypeDefs } from "./speech/speech.resolver";
import { typeDefs as contentTypeDefs } from "./content/content.resolver";
import { typeDefs as missingTypeDefs } from "./missing/missing.resolver";
import { typeDefs as arithmaticTypeDefs } from "./arithmatic/arithmatic.resolver";

export const typeDefs = [ 
  rootTypeDefs, 
  authTypeDefs,
  accountTypeDefs,
  membershipTypeDefs,
  roleTypeDefs,
  subjectTypeDefs,
  courseTypeDefs,
  userTypeDefs,
  levelTypeDefs,
  examTypeDefs,
  questionTypeDefs,
  choiceTypeDefs,
  resultTypeDefs,
  speechTypeDefs,
  contentTypeDefs,
  missingTypeDefs,
  arithmaticTypeDefs
]