module.exports = {
	command: {
		name: "dice",
		description: "Returns a random number between 1 and 6, much like a die.",
		options: [
			{
				type: 4,
				name: "sides",
				description: "Ever wanted to roll a 1,000 sided die?",
			},
		],
	},

	response: (interaction) => {
		const sides = interaction.data.options?.find(
			(value) => value.name == "sides"
		)?.value;

		const result = Math.floor(Math.random() * (sides || 6));

		return {
			type: 4,
			data: {
				content: `Rolling the ${sides || 6} sided die...\nYou got a${
					result.toString().charAt(0) == "8" ? "n" : ""
				} ${result}!`,
			},
		};
	},
};
