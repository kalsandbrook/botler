module.exports = {
	command: {
		name: "uno_reverse",
		description: "For when you need to win an argument.",
		options: [
			{
				type: 5,
				name: "no_u",
				description: "Replaces the reverse card with a no u card.",
			},
		],
	},

	response: (interaction) => {
		return {
			type: 4,
			data: {
				embeds: [
					{
						title: "/uno_reverse",
						color: require("discord.js").Constants.Colors.RED,
						image: {
							url: interaction.data.options?.find((o) => o.name == "no_u")
								?.value
								? "https://raw.githubusercontent.com/v-briese/botler/main/assets/uno_no_u_card.png"
								: "https://raw.githubusercontent.com/v-briese/botler/main/assets/uno_reverse_card.png",
						},
					},
				],
			},
		};
	},
};
