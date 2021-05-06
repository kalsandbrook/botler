module.exports = (token, data) => {
	return require("node-fetch")(
		`https://discord.com/api/v8/webhooks/${
			require("../config.json").app_id
		}/${token}/messages/@original`,
		{
			method: "patch",
			body: JSON.stringify(data),
			headers: {
				Authorization: `Bot ${process.env.BOT_TOKEN}`,
				"Content-Type": "application/json",
			},
		}
	);
};
