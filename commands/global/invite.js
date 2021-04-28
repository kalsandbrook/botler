module.exports = {
	command: {
		name: "invite",
		description: "Invite Botler to your own server!",
	},

	response: () => {
		return {
			type: 4,
			data: {
				embeds: [
					{
						title: "/invite",
						description: `[Click here](${
							require("../../config.json").bot_invite
						}) to invite Botler to your own server!`,
						color: require("discord.js").Constants.Colors.BLURPLE,
					},
				],
			},
		};
	},
};
