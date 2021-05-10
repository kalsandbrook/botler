const { InteractionResponseType } = require("discord-interactions");

module.exports = {
	command: {
		name: "timer",
		description: "Sets a timer and responds when it's done.",
		options: [
			{
				type: 4,
				name: "time",
				description: "Time of the timer.",
				required: true,
			},
			{
				type: 3,
				name: "unit",
				description: "Unit of time to count by.",
				choices: [
					{
						name: "Seconds",
						value: "s",
					},
					{
						name: "Minutes",
						value: "m",
					},
					{
						name: "Hours",
						value: "h",
					},
				],
			},
		],
	},

	response: (interaction) => {
		const options_time = interaction.data.options.find(
			(o) => o.name == "time"
		)?.value;
		const options_unit = interaction.data.options.find(
			(o) => o.name == "unit"
		)?.value;

		//TODO Return an error when specified time is out of range

		setTimeout(() => {
			require("../../util").createFollowupMessage(interaction.token, {
				content: "Times up!",
			});
		}, options_time * (options_unit == "m" ? 60000 : options_unit == "h" ? 3600000 : 1000));

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: `Set! Your timer will go off in ${options_time}${
					options_unit || "s"
				}.`,
			},
		};
	},
};
