module.exports = {
	command: {
		name: "goose",
		description: "Am goose, honk honk!",
	},

	response: (interaction, _client, neko) => {
		neko.sfw.goose().then((goose) => {
			require("../../util").editInteractionResponse(interaction.token, {
				embeds: [
					{
						title: "/goose",
						color: require("discord.js").Constants.Colors.PURPLE,
						footer: {
							text: "Provided by Nekos.life",
							icon_url: "https://avatars.githubusercontent.com/u/34457007",
						},
						image: {
							url: goose.url,
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
