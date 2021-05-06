const { client } = require("../index");

module.exports = (token, data) => {
	return client.api
		.webhooks(require("../config.json").app_id, token)
		.messages("@original")
		.patch({ data: data });
};
