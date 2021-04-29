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
		const input = interaction.data.options[0].value;
		let output;

		try {
			output = eval(interaction.data.options[0].value);
		} catch (error) {
			console.log("[ERROR]: ", error);
			output = error;
		}

		return {
			type: 4,
			data: {
				content: `Input:\n\`\`\`js\n${input}\n\`\`\`\nOutput:\n\`\`\`js\n${output}\n\`\`\``,
				flags: 64,
			},
		};
	},
};
