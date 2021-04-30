module.exports = {
	command: {
		name: "hug",
		description:
			"Hugs someone! Since you can't *actually* hug anyone during this time...",
		options: [
			{
				type: 6,
				name: "user",
				description: "User you wanna hug :>",
				required: true,
			},
		],
	},

	response: (interaction, _client, neko) => {
		neko.sfw.hug().then((hug) => {
			require("../../util/editInteractionResponse")(interaction.token, {
				embeds: [
					{
						title: "/hug",
						description: `<@!${
							interaction.member?.user.id || interaction.user?.id
						}> hugged <@!${interaction.data.options[0].value}>!`,
						color: require("discord.js").Constants.Colors.PURPLE,
						footer: {
							text: "Provided by Nekos.life",
							icon_url: "https://avatars.githubusercontent.com/u/34457007",
						},
						image: {
							url: hug.url,
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
