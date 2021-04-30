module.exports = {
	command: {
		name: "slap",
		description: "Slaps somone.",
		options: [
			{
				type: 6,
				name: "user",
				description: "User you want to slap.",
				required: true,
			},
		],
	},

	response: (interaction, _client, neko) => {
		neko.sfw.slap().then((slap) => {
			require("../../util/editInteractionResponse")(interaction.token, {
				embeds: [
					{
						title: "/slap",
						description: `<@!${
							interaction.member?.user.id || interaction.user?.id
						}> slapped <@!${interaction.data.options[0].value}>!`,
						color: require("discord.js").Constants.Colors.PURPLE,
						footer: {
							text: "Provided by Nekos.life",
							icon_url: "https://avatars.githubusercontent.com/u/34457007",
						},
						image: {
							url: slap.url,
						},
					},
				],
			});
		});

		return {
			type: 5,
		};
	},
};
