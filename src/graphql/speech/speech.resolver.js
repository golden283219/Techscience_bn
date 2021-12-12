import { readFileSync } from "fs";
import { _speeches, _speechById, _createSpeech, _deleteSpeech, _editSpeech } from "../../model/actions/speech.action";

export const typeDefs = readFileSync(`${__dirname}/speech.graphql`, "utf8");

export const resolvers = {

	Query: {

		speeches: (parent, { paginateReq }, context, info) => {
			return _speeches(paginateReq).then(({ speeches, totalCount }) => {
				return { speeches, totalCount };
			});
		},

		speechById: (parent, { id }, context, info) => {
			return _speechById(id).then(speech => {
				return speech;
			});
		},
	},

	Mutation: {

		createSpeech: (parent, { createSpeechReq }, context, info) => {
			return _createSpeech(createSpeechReq).then(({ scs, msg }) => {
				return { scs, msg };
			});
		},

		editSpeech: (parent, { editSpeechReq }, context, info) => {
			return _editSpeech(editSpeechReq).then(({ scs, msg }) => {
				return { scs, msg };
			});
		},

		deleteSpeech: (parent, { id }, context, info) => {
			return _deleteSpeech(id).then(({ scs, msg }) => {
				return { scs, msg };
			});
		},
	},
};