module.exports = {
	command: {
		name: "kreatoisbored",
		description: "Kreato is bored.",
	},

	response: (interaction) => {
		return {
			type: 4,
			data: {
				content:
					interaction.member.user.id == "647480386577760256"
						? "Oh hey Kreato, still bored?"
						: "Kreato's bored, go entertain him.",
			},
		};
	},
};
