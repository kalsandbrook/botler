module.exports = {
	command: {
		name: "say",
		description: "Makes botler say something!",
		options: [
			{
				type: 3,
				name: "message",
				description: "What Botler is to say.",
				required: true,
			},
			{
				type: 7,
				name: "channel",
				description: "Channel where Botler is to speak.",
			},
		],
	},

	response: (interaction, client) => {
		const { developer_id } = require("../../config.json");
		if ((interaction.member?.user.id || interaction.user?.id) != developer_id)
			return {
				type: 4,
				data: {
					content: `Only <@${developer_id}> can use this command.`,
					flags: 64,
				},
			};

		const messageOption = interaction.data.options.find(
			(o) => o.name == "message"
		)?.value;
		const channelOption = interaction.data.options.find(
			(o) => o.name == "channel"
		)?.value;

		client.channels
			.fetch(channelOption || interaction.channel_id)
			.then((channel) => {
				channel.send(messageOption).then(() => {
					require("node-fetch")(
						`https://discord.com/api/v8/webhooks/${
							require("../../config.json").app_id
						}/${interaction.token}/messages/@original`,
						{
							method: "patch",
							body: JSON.stringify({
								content: `Sent the message "${messageOption}"${
									channelOption ? `to <#${channelOption}>` : ""
								}.`,
							}),
							headers: {
								Authorization: "Bot " + process.env.BOT_TOKEN,
								"Content-Type": "application/json",
							},
						}
					);
				});
			});

		return {
			type: 5,
			data: {
				flags: 64,
			},
		};
	},
};
