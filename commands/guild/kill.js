module.exports = {
	command: {
		name: "kill",
		description: "Kill someone. Kill them all, even.",
		options: [
			{
				type: 6,
				name: "member",
				description: "Server member to kill.",
				required: true,
			},
		],
	},

	guild_only: true,

	response: (interaction) => {
		return {
			type: 4,
			data: {
				content: "",
				embeds: [
					{
						description: `Say goodbye, <@${interaction.data.options[0].value}>`,
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
