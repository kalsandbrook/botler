module.exports = {
	command: {
		name: "kill",
		description: "Kills someone. (Doesn't actually, don't worry.)",
		options: [
			{
				type: 6,
				name: "member",
				description: "Server member to kill.",
				required: true,
			},
		],
	},

	response: (interaction) => {
		return {
			type: 4,
			data: {
				embeds: [
					{
						title: "/kill",
						description: `Say goodbye, <@${interaction.data.options[0].value}>`,
						color: require("discord.js").Constants.Colors.RED,
						image: {
							url:
								"https://cdn.discordapp.com/emojis/758739709781868584.png?v=1",
						},
					},
				],
			},
		};
	},
};
