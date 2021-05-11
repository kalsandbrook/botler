const { InteractionResponseType } = require("discord-interactions");

module.exports = {
	command: {
		name: "pat",
		description: "Pats somone.",
		options: [
			{
				type: 6,
				name: "user",
				description: "User you want to pat.",
				required: true,
			},
		],
	},

	response: (interaction, _client, neko) => {
		neko.sfw.pat().then((pat) => {
			require("../../util").editInteractionResponse(interaction.token, {
				embeds: [
					{
						title: "/pat",
						description: `<@!${
							interaction.member?.user.id || interaction.user?.id
						}> pat <@!${interaction.data.options[0].value}>!`,
						color: require("discord.js").Constants.Colors.PURPLE,
						footer: {
							text: "Provided by Nekos.life",
							icon_url: "https://avatars.githubusercontent.com/u/34457007",
						},
						image: {
							url: pat.url,
						},
					},
				],
			});
		});

		return {
			type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
		};
	},
};
