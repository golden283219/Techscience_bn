import { DataTypes } from "sequelize";
import { genSaltSync, hashSync } from "bcrypt";
import sequelize from "../../middlewares/dbInstance";

// define models
const Account = sequelize.define("account", {
	name: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
	userId: {
		type: DataTypes.INTEGER,
	},
	image: {
		type: DataTypes.STRING,
		defaultValue: "school-logo.png",
	},
}, {
	tableName: "nAccounts",
});

const User = sequelize.define("user", {
	firstname: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	lastname: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
	username: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
		set (value) {
			this.setDataValue("password", hashSync(value, genSaltSync(10)));
		},
	},
	resetToken: DataTypes.STRING,
	approved: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	},
	lockedOut: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	},
	fullname: {
		type: DataTypes.VIRTUAL,
		get () {
			return `${this.firstname} ${this.lastname}`;
		},
		set () {
			throw new Error("Cant set this value manually!");
		},
	},
}, {
	tableName: "nUsers",
});

const Membership = sequelize.define("membership", {
	name: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
}, {
	tableName: "nMemberships",
	timestamps: false,
});

const Role = sequelize.define("role", {
	name: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
}, {
	tableName: "nRoles",
	timestamps: false,
});

const Subject = sequelize.define("subject", {
	name: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
}, {
	tableName: "nSubjects",
	timestamps: false,
});

const Course = sequelize.define("course", {
	name: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
}, {
	tableName: "nCourses",
});

const Level = sequelize.define("level", {
	name: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
}, {
	tableName: "nLevels",
	timestamps: false,
});

const Exam = sequelize.define("exam", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	type: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	genre: {
		type: DataTypes.STRING,
		allowNull: false,
	},
}, {
	tableName: "nExams",
});

const Question = sequelize.define("question", {
	name: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	free: {
		type: DataTypes.BOOLEAN,
	},
	type: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	image: {
		type: DataTypes.STRING,
	},
}, {
	tableName: "nQuestions",
});

const Choice = sequelize.define("choice", {
	name: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	comment: {
		type: DataTypes.STRING,
	},
	correct: {
		type: DataTypes.BOOLEAN,
	},
}, {
	tableName: "nChoices",
});

const Result = sequelize.define("result", {
	totalQuestion: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
	attempedQuestion: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
	requestedAt: {
		type: DataTypes.DATE,
	},
	assignedAt: {
		type: DataTypes.DATE,
	},
	tookAt: {
		type: DataTypes.DATE,
	},
	grade: {
		type: DataTypes.INTEGER,
	},
}, {
	tableName: "nResults",
	timestamps: false,
});

const Answer = sequelize.define("answer", {
	answer: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	grade: DataTypes.INTEGER,
	comment: DataTypes.STRING,
}, {
	tableName: "nAnswers",
	timestamps: false,
});

const Book = sequelize.define("book", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	matter: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
}, {
	tableName: "nBooks",
});

/* speech part */

const Speech = sequelize.define("speech", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	}
}, {
	tableName: "MasterTextForSpeech",
	timestamps: false,
});

const Content = sequelize.define("content", {
	speechId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	text: {
		type: DataTypes.STRING,
		allowNull: false,
	},
}, {
	tableName: "SpeechContent",
	timestamps: false,
});

const Missing = sequelize.define("missing", {
	quesText: {
		type: DataTypes.STRING,
		allowNull: false
	},
	ans: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	tableName: "TblMissingLetter",
	timestamps: false
});

const Arithmatic = sequelize.define("arithmatic", {
	category: {
		type: DataTypes.STRING,
		allowNull: false
	},
	quesText: {
		type: DataTypes.STRING,
		allowNull: false
	},
	ans: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	tableName: "Tbl_ArithmaticOperation",
	timestamps: false
});

/* end */

// define relations
Account.hasMany(User);
User.belongsTo(Account);

Membership.hasMany(User);
User.belongsTo(Membership);

Role.hasMany(User);
User.belongsTo(Role, {
	foreignKey: {
		defaultValue: 3,
		allowNull: false,
	},
});

Subject.hasMany(Course);
Course.belongsTo(Subject);

Subject.hasMany(Exam);
Course.hasMany(Exam);
Level.hasMany(Exam);
Account.hasMany(Exam);
Exam.belongsTo(Subject);
Exam.belongsTo(Course);
Exam.belongsTo(Level);
Exam.belongsTo(Account);

Exam.hasMany(Question);
Question.belongsTo(Exam);

Question.hasMany(Choice);
Choice.belongsTo(Question);

Exam.hasMany(Result);
User.hasMany(Result);
Result.belongsTo(Exam);
Result.belongsTo(User);

Result.hasMany(Answer);
Question.hasMany(Answer);
Answer.belongsTo(Result);
Answer.belongsTo(Question);

User.hasMany(Book);
Book.belongsTo(User);

Speech.hasMany(Content);
Content.belongsTo(Speech);

export {
	Account,
	User,
	Membership,
	Role,
	Subject,
	Course,
	Level,
	Exam,
	Question,
	Choice,
	Result,
	Answer,
	Book,
	Speech,
	Content,
	Missing,
	Arithmatic
};