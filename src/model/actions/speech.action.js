import { Content, Speech } from "../orms";


export const _speeches = ({ skip, limit, order, sort, filter }) => new Promise((resolve, reject) => {
	Speech.findAndCountAll({
		where: global.parseJson(filter),
		order: [
			[order, sort],
		],
		offset: skip,
		limit,
	}).then(({ count, rows }) => {
		return resolve({ totalCount: count, speeches: rows });
	});
});

export const _speechById = id => new Promise((resolve, reject) => {
	Speech.findByPk(id).then(category => resolve(category));
});

export const _createSpeech = ({ name }) => new Promise((resolve, reject) => {
	Speech.findOne({ where: { name } }).then(speech => {
		if (!!speech) {
			return resolve({ scs: false, msg: "That Speech Category already exists!" });
		}

		Speech.create({ name }).then(speech => {
			return resolve({ scs: true, msg: "Speech Created!", speech: speech.dataValues });
		});
	});
});

export const _editSpeech = ({ id, name }) => new Promise((resolve, reject) => {
	Speech.findByPk(id).then(category => {
		if (!category) {
			return resolve({ scs: false, msg: "What are you going to edit?" });
		}

		Speech.findOne({ where: { name } }).then(exist => {
			if (!!exist) {
				return resolve({ scs: false, msg: "That Speech category already exists" });
			}

			category.name = name;
			category.save();
			return resolve({ scs: true, msg: "Speech Updated!", speech: category.dataValues });
		});
	});
});

export const _deleteSpeech = id => new Promise((resolve, reject) => {
	Content.findAndCountAll({
		order: [
			["id", "desc"],
		],
		offset: 0,
		limit: 0,
	}).then(({ count, rows }) => {
		rows.map(row => {
			if (row.speechId === id) {
				row.destroy();
			}
		});
	});

	Speech.findByPk(id).then(category => {
		if (!category) {
			return resolve({ scs: false, msg: "What are you going to delete?" });
		}

		category.destroy();
		return resolve({ scs: true, msg: "Speech Deleted!", speech: category.dataValues });
	});
});

