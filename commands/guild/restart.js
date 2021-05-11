const {
	InteractionResponseType,
	InteractionResponseFlags,
} = require("discord-interactions");

module.exports = {
	command: {
		name: "restart",
		description: "Restarts the bot.",
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
		client.destroy();
		client.login(process.env.BOT_TOKEN).then(() => {
			require("../../util").editInteractionResponse(interaction.token, {
				content: "Restarted.",
			});
		});

		return {
			type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				flags: InteractionResponseFlags.EPHEMERAL,
			},
		};
	},
};
