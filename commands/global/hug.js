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

	response: (interaction) => {
		const nekoClient = require("nekos.life");
		const neko = new nekoClient();

		neko.sfw.hug().then((hug) => {
			require("node-fetch")(
				`https://discord.com/api/v8/webhooks/${
					require("../../config.json").app_id
				}/${interaction.token}/messages/@original`,
				{
					method: "patch",
					body: JSON.stringify({
						content: "",
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
					}),
					headers: {
						Authorization: "Bot " + process.env.BOT_TOKEN,
						"Content-Type": "application/json",
					},
				}
			);
		});

		return {
			type: 5,
		};
	},
};
