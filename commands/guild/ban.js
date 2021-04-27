module.exports = {
	command: {
		name: "ban",
		description: "Bans a member of the current server.",
		options: [
			{
				type: 6,
				name: "member",
				description: "Server member to ban.",
				required: true,
			},
			{
				type: 4,
				name: "days",
				description: "Number of days of messages to delete.",
				choices: [
					{
						name: "1",
						value: 1,
					},
					{
						name: "2",
						value: 2,
					},
					{
						name: "3",
						value: 3,
					},
					{
						name: "4",
						value: 4,
					},
					{
						name: "5",
						value: 5,
					},
					{
						name: "6",
						value: 6,
					},
					{
						name: "7",
						value: 7,
					},
				],
			},
			{
				type: 3,
				name: "reason",
				description: "Reason for banning.",
			},
		],
	},

	response: (interaction, client) => {
		if ((interaction.member.permissions & 0x4) != 0x4)
			return {
				type: 4,
				data: {
					content: "You do not have permission to use this command.",
					flags: 64,
				},
			};

		client.guilds.fetch(interaction.guild_id).then((guild) => {
			guild.members
				.fetch(
					interaction.data.options.find((option) => option.name == "member")
						.value
				)
				.then((member) => {
					const days = interaction.data.options.find(
						(option) => option.name == "days"
					)?.value;
					const reason = interaction.data.options.find(
						(option) => option.name == "reason"
					)?.value;

					member
						.ban({
							days: days || 0,
							reason: reason || undefined,
						})
						.then((member) => {
							require("node-fetch")(
								`https://discord.com/api/v8/webhooks/${
									require("../../config.json").app_id
								}/${interaction.token}/messages/@original`,
								{
									method: "patch",
									body: JSON.stringify({
										content: `Banned ${member.user.username}#${
											member.user.discriminator
										}${
											days
												? ` and deleted messages sent by the user from up to ${days} day${
														days != 1 ? "s" : ""
												  } ago`
												: ""
										}${reason ? ` for "${reason}"` : ""}.`,
									}),
									headers: {
										Authorization: "Bot " + process.env.BOT_TOKEN,
										"Content-Type": "application/json",
									},
								}
							);
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
