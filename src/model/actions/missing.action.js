import { Missing } from "../orms";


export const _missingLetters = ({ skip, limit, order, sort, filter }) => new Promise((resolve, reject) => {
	Missing.findAndCountAll({
		where: global.parseJson(filter),
		order: [
			[order, sort],
		],
		offset: skip,
		limit,
	}).then(({ count, rows }) => {
		return resolve({ totalCount: count, missingLetters: rows });
	});
});

export const _missingById = id => new Promise((resolve, reject) => {
	Missing.findByPk(id).then(missing => resolve(missing));
});

export const _createMissing = ({ quesText, ans }) => new Promise((resolve, reject) => {
	Missing.findOne({ where: { quesText, ans } }).then(missing => {
		if (!!missing) {
			return resolve({ scs: false, msg: "That missing letter already exists!" });
		}

		Missing.create({ quesText, ans }).then(missing => {
			return resolve({ scs: true, msg: "Missing Letter Created!", missing: missing.dataValues });
		});
	});
});

export const _editMissing = ({ id, quesText, ans }) => new Promise((resolve, reject) => {
	Missing.findByPk(id).then(missing => {
		if (!missing) {
			return resolve({ scs: false, msg: "What are you going to edit?" });
		}

		Missing.findOne({ where: { quesText, ans } }).then(exist => {
			if (!!exist) {
				return resolve({ scs: false, msg: "That Missing letter already exists" });
			}

			missing.quesText = quesText;
			missing.ans = ans;
			missing.save();
			return resolve({ scs: true, msg: "Missing letter Updated!", missing: missing.dataValues });
		});
	});
});

export const _deleteMissing = id => new Promise((resolve, reject) => {
	Missing.findByPk(id).then(missing => {
		if (!missing) {
			return resolve({ scs: false, msg: "What are you going to delete?" });
		}

		missing.destroy();
		return resolve({ scs: true, msg: "Missing Deleted!", missing: missing.dataValues });
	});
});

