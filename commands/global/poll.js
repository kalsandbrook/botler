module.exports = {
	command: {
		name: "poll",
		description: "Creates a poll with an embed and reactions.",
		options: [
			{
				type: 3,
				name: "query",
				description: "The contents of your poll.",
				required: true,
			},
			{
				type: 7,
				name: "channel",
				description: "The channel to send the poll to.",
			},
			{
				type: 3,
				name: "thumbsup",
				description: "What should the :thumbsup: emoji represent?",
			},
			{
				type: 3,
				name: "thumbsdown",
				description: "What should the :thumbsdown: emoji represent?",
			},
		],
	},

	guild_only: true,
	permission: 0x20000,

	response: (interaction, client) => {
		const channelOption = interaction.data.options.find(
			(option) => option.name == "channel"
		)?.value;

		client.users.fetch(interaction.member.user.id).then((user) => {
			client.channels
				.fetch(channelOption || interaction.channel_id)
				.then((channel) => {
					channel
						.send({
							embed: {
								title: "Poll",
								author: {
									name: `${
										interaction.member.nick || interaction.member.user.username
									}#${interaction.member.user.discriminator}`,
									icon_url: user.avatarURL(),
								},
								description: `${
									interaction.data.options.find(
										(option) => option.name == "query"
									).value
								}\n\n\n:+1: - ${
									interaction.data.options.find(
										(option) => option.name == "thumbsup"
									)?.value || "Approve"
								}\n\n:-1: - ${
									interaction.data.options.find(
										(option) => option.name == "thumbsdown"
									)?.value || "Disapprove"
								}`,
								color: require("discord.js").Constants.Colors.YELLOW,
							},
						})
						.then((message) => {
							message.react("👍").then(() => {
								message.react("👎").then(() => {
									require("../../util").editInteractionResponse(
										interaction.token,
										{
											content: `Poll sent${
												channelOption ? ` to <#${channelOption}>` : ""
											}.`,
										}
									);
								});
							});
						});
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
