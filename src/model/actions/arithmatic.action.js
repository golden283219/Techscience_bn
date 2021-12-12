import { Arithmatic } from "../orms";


export const _arithmatics = ({ skip, limit, order, sort, filter }) => new Promise((resolve, reject) => {
	Arithmatic.findAndCountAll({
		where: global.parseJson(filter),
		order: [
			[order, sort],
		],
		offset: skip,
		limit,
	}).then(({ count, rows }) => {
		return resolve({ totalCount: count, arithmatics: rows });
	});
});

export const _arithmaticById = id => new Promise((resolve, reject) => {
	Arithmatic.findByPk(id).then(arithmatic => resolve(arithmatic));
});

export const _createArithmatic = ({ category, quesText, ans }) => new Promise((resolve, reject) => {
	Arithmatic.findOne({ where: { category, quesText, ans } }).then(arithmatic => {
		if (!!arithmatic) {
			return resolve({ scs: false, msg: "That arithmatic question already exists!" });
		}

		Arithmatic.create({ category, quesText, ans }).then(arithmatic => {
			return resolve({ scs: true, msg: "Arithmatic question Created!", arithmatic: arithmatic.dataValues });
		});
	});
});

export const _editArithmatic = ({ id, category, quesText, ans }) => new Promise((resolve, reject) => {
	Arithmatic.findByPk(id).then(arithmatic => {
		if (!arithmatic) {
			return resolve({ scs: false, msg: "What are you going to edit?" });
		}

		Arithmatic.findOne({ where: { category, quesText, ans } }).then(exist => {
			if (!!exist) {
				return resolve({ scs: false, msg: "That arithmatic question already exists" });
			}
			arithmatic.category = category;
			arithmatic.quesText = quesText;
			arithmatic.ans = ans;
			arithmatic.save();
			return resolve({ scs: true, msg: "Arithmatic question Updated!", arithmatic: arithmatic.dataValues });
		});
	});
});

export const _deleteArithmatic = id => new Promise((resolve, reject) => {
	Arithmatic.findByPk(id).then(arithmatic => {
		if (!arithmatic) {
			return resolve({ scs: false, msg: "What are you going to delete?" });
		}

		arithmatic.destroy();
		return resolve({ scs: true, msg: "Arithmatic question Deleted!", arithmatic: arithmatic.dataValues });
	});
});

