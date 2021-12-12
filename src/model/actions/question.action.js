import { Choice, Exam, Question } from "../orms";
import { fileRemover, fileUploader } from "../../middlewares/fileHander";


export const _questions = ({ skip, limit, order, sort, filter }) => new Promise(resolve => {
	Question.findAndCountAll({
		where: global.parseJson(filter),
		order: [
			[order, sort],
		],
		offset: skip,
		limit,
		include: Choice,
		nest: true,
	}).then(async ({ count, rows }) => {
		return resolve({ questions: rows, totalCount: count });
	});
});

export const _createQuestion = ({ name, examId, type, free, image }) => new Promise(async resolve => {
	// Question.findOne({ where: { examId } }).then(async question => {
	//   if (!!question)
	//     return resolve({ scs: false, msg: 'That Question already exists!' })

	const { url, error } = await fileUploader({ file: image, type: "question" });

	if (!!error) {
		return resolve({ scs: false, msg: error });
	}

	Question.create({ name, examId, free, type, image: url }).then(question => {
		return resolve({ scs: true, msg: "Question Created!", question: question.dataValues });
	});

});

export const _createQuestions = ({ examId, questions }) => new Promise(resolve => {
	Exam.findByPk(examId).then(async exam => {
		if (!exam) return resolve({ scs: false, msg: "Error! We dont have such exam." });

		Promise.all(
			questions.map(question => {
				Question.create({ name: question.name, examId, free: true, type: "objective" }).then(newQuestion => {
					question.choices.map(choice => {
						Choice.create({ name: choice.name, questionId: newQuestion.dataValues.id, correct: choice.correct, comment: choice.comment }).then(newChoice => {
							return resolve({ scs: true, msg: "Choice Created!" });
						}).catch(err => {
							return resolve({ scs: true, msg: "Oops! something went wrong." });
						});
					});
				});
			}),
			)
			.then(() => resolve({ scs: true, msg: "Success! Questions Created." }))
			.catch(() => resolve({ scs: false, msg: "Error! Something Went Wrong." }));
	});
});

export const _editQuestion = ({ id, examId, name, type, free, image }) => new Promise(resolve => {
	Question.findByPk(id).then(async question => {
		if (!question) {
			return resolve({ scs: false, msg: "What are you going to edit?" });
		}

		// Question.findOne({ where: { examId } }).then(async exist => {
		//   if (!!exist && question.name !== name)
		//     return resolve({ scs: false, msg: 'That Question already exists' })

		const { url, error } = await fileUploader({ file: image, oldFile: question.image, type: "question" });

		if (!!error) {
			return resolve({ scs: false, msg: error });
		}

		question.name = name;
		question.type = type;
		question.free = free;
		question.image = url;
		question.save();
		return resolve({ scs: true, msg: "Question Updated!" });
		// })
	});
});

export const _deleteQuestion = id => new Promise(resolve => {
	Question.findByPk(id).then(question => {
		if (!question) {
			return resolve({ scs: false, msg: "What are you going to delete?" });
		}

		fileRemover({ filePath: question.image, type: "question" });
		question.destroy();
		return resolve({ scs: true, msg: 'Question Deleted!' })
	})
})