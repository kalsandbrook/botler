module.exports = {
	command: {
		name: "eval",
		description: "Will execute whatever input you give it as JavaScript.",
		options: [
			{
				type: 3,
				name: "input",
				description: "Code that will be ran.",
				required: true,
			},
		],
		default_permission: false,
	},

	permissions: [
		{
			id: require("../../config.json").developer_id,
			type: 2,
			permission: true,
		},
	],

	response: (interaction, client) => {
		let result;

		try {
			result = eval(interaction.data.options[0].value);
		} catch (error) {
			console.log("[ERROR]: ", error);
			result = error;
		}

		return {
			type: 4,
			data: {
				content: `Execution complete. The results are as follows:\n\`\`\`js\n${result}\n\`\`\``,
				flags: 64,
			},
		};
	},
};
