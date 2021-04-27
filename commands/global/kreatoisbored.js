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
					(interaction.member?.user.id || interaction.user.id) ==
					"647480386577760256"
						? "Oh hey <@647480386577760256>, still bored?"
						: "<@647480386577760256>'s bored, go entertain him.",
			},
		};
	},
};
