module.exports = {
	command: {
		name: "kick",
		description: "Kicks a member of the current server.",
		options: [
			{
				type: 6,
				name: "member",
				description: "Server member to kick.",
				required: true,
			},
			{
				type: 3,
				name: "reason",
				description: "Reason for kicking.",
			},
		],
	},

	guild_only: true,
	permission: 0x2,

	response: (interaction, client) => {
		client.guilds.fetch(interaction.guild_id).then((guild) => {
			guild.members
				.fetch(
					interaction.data.options.find((option) => option.name == "member")
						.value
				)
				.then((member) => {
					const reason = interaction.data.options.find(
						(option) => option.name == "reason"
					)?.value;

					member.kick(reason || undefined).then((member) => {
						require("../../util").editInteractionResponse(interaction.token, {
							content: `Kicked ${member.user.username}#${
								member.user.discriminator
							}${reason ? ` for "${reason}"` : ""}.`,
						});
					});
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
