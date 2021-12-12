import { Content } from "../orms";


export const _contents = ({ skip, limit, order, sort, filter }) => new Promise((resolve, reject) => {
	Content.findAndCountAll({
		where: global.parseJson(filter),
		order: [
			[order, sort],
		],
		offset: skip,
		limit,
	}).then(({ count, rows }) => {
		return resolve({ totalCount: count, contents: rows });
	});
});

export const _contentById = id => new Promise((resolve, reject) => {
	Content.findByPk(id).then(content => resolve(content));
});

export const _createContent = ({ speechId, text }) => new Promise(async resolve => {

	Content.findOne({ where: { speechId } }).then(content => {
		if (!!content) {
			return resolve({ scs: false, msg: "That Speech Text already exists!" });
		}
		Content.create({ speechId, text }).then(content => {
			return resolve({ scs: true, msg: "Content Created!" });
		})
	});
});


export const _editContent = ({ id, text }) => new Promise((resolve, reject) => {
	Content.findByPk(id).then(content => {
		if (!content) {
			return resolve({ scs: false, msg: "What are you going to edit?" });
		}

		Content.findOne({ where: { text } }).then(exist => {
			if (!!exist) {
				return resolve({ scs: false, msg: "That Speech Text already exists" });
			}

			content.text = text;
			content.save();
			return resolve({ scs: true, msg: "Speech Text Updated!", content: content.dataValues });
		});
	});
});

export const _deleteContent = id => new Promise((resolve, reject) => {
	Content.findByPk(id).then(content => {
		if (!content) {
			return resolve({ scs: false, msg: "What are you going to delete?" });
		}

		content.destroy();
		return resolve({ scs: true, msg: "Speech Text Deleted!", content: content.dataValues });
	});
});