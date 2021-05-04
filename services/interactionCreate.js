module.exports = {
	register: (client, db) => {
		const NekoClient = require("nekos.life");
		const neko = new NekoClient();

		// Respond to Interactions

		client.ws.on("INTERACTION_CREATE", async (interaction) => {
			console.log("[INTERACTION]:", interaction);

			try {
				switch (interaction.type) {
					case 2:
						if (!client.commands.has(interaction.data?.name)) break;

						const command = client.commands.get(interaction.data?.name);

						if (command.guild_only && !interaction.guild_id)
							return client.api
								.interactions(interaction.id, interaction.token)
								.callback.post({
									data: {
										type: 4,
										data: {
											content:
												"Cannot execute guild only command in DM channel.",
											flags: 64,
										},
									},
								});

						if (
							command.permission &&
							interaction?.member?.permissions &&
							(interaction.member.permissions & command.permission) !=
								command.permission
						)
							return client.api
								.interactions(interaction.id, interaction.token)
								.callback.post({
									data: {
										type: 4,
										data: {
											content:
												"You do not have permission to use this command.",
											flags: 64,
										},
									},
								});

						client.api
							.interactions(interaction.id, interaction.token)
							.callback.post({
								data: command.response(interaction, client, neko, db),
							});
						break;
				}
			} catch (error) {
				console.error("[ERROR]: ", error);

				client.api
					.interactions(interaction.id, interaction.token)
					.callback.post({
						data: {
							type: 4,
							data: {
								content: `An error has occured! It reads as follows:\n\`\`\`js\n${error}\n\`\`\``,
							},
						},
					});
			}
		});
	},
};
