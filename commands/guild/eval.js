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
		const { editInteractionResponse } = require("../../util");

		const input = interaction.data.options[0].value;
		let output;

		try {
			output = eval(input);
		} catch (error) {
			console.log("[ERROR]: ", error);
		}

		if (!output?.then())
			return {
				type: 4,
				data: {
					content: `Input:\n\`\`\`js\n${input}\n\`\`\`\nOutput:\n\`\`\`js\n${output}\n\`\`\``,
					flags: 64,
				},
			};

		output
			.then((output) => {
				editInteractionResponse(interaction.token, {
					content: `Input:\n\`\`\`js\n${input}\n\`\`\`\nOutput:\n\`\`\`js\n${output}\n\`\`\``,
				});
			})
			.catch((error) => {
				editInteractionResponse(interaction.token, {
					content: `Input:\n\`\`\`js\n${input}\n\`\`\`\nError:\n\`\`\`js\n${error}\n\`\`\``,
				});
			});

		return {
			type: 5,
			data: {
				flags: 64,
			},
		};
	},
};
