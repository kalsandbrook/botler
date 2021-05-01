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

	response: (interaction, client, neko, db) => {
		const input = interaction.data.options[0].value;
		let output = eval(input);

		if (typeof output != "string") output = require("util").inspect(output);

		let messageContent = `Input:\n\`\`\`js\n${input}\n\`\`\`\nOutput:\n\`\`\`js\n${output}\n\`\`\``;

		if (messageContent.length > 2000) {
			console.log("[OUTPUT]: ", output);
			messageContent = `Input:\n\`\`\`js\n${input}\n\`\`\`\nOutput:\n2000 character limit exceeded, check console.`;
		}

		require("../../util/editInteractionResponse")(interaction.token, {
			content: messageContent,
		});

		return {
			type: 5,
			data: {
				flags: 64,
			},
		};
	},
};
