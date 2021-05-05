module.exports = {
	command: {
		name: "poke",
		description: "Pokes somone.",
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
		neko.sfw.poke().then((poke) => {
			require("../../util").editInteractionResponse(interaction.token, {
				embeds: [
					{
						title: "/poke",
						description: `<@!${
							interaction.member?.user.id || interaction.user?.id
						}> poked <@!${interaction.data.options[0].value}>!`,
						color: require("discord.js").Constants.Colors.PURPLE,
						footer: {
							text: "Provided by Nekos.life",
							icon_url: "https://avatars.githubusercontent.com/u/34457007",
						},
						image: {
							url: poke.url,
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
