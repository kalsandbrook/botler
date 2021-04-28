const { Constants } = require("discord.js");

module.exports = {
	command: {
		name: "info",
		description: "Returns information about the bot.",
	},

	response: (interaction, client) => {
		const {
			app_id,
			developer_id,
			support_server,
		} = require("../../config.json");

		client.users.fetch(developer_id).then((user) => {
			const {
				version,
				description,
				repository: { url },
				dependencies,
			} = require("../../package.json");
			const os = require("os");

			const github = url.slice(4);

			const memory = process.memoryUsage().heapUsed / 1048576; // 1024*1024
			let memoryUsage;
			if (memory >= 1024) memoryUsage = `${(memory / 1024).toFixed(2)}GB`;
			else memoryUsage = `${memory.toFixed(2)}MB`;

			const totalSeconds = (client.uptime / 1000) % 3600;

			require("../../util").editInteractionResponse(interaction.token, {
				embeds: [
					{
						title: `Botler v${version}`,
						description: description,
						url: github,
						color: Constants.Colors.BLUE,
						thumbnail: {
							url:
								"https://raw.githubusercontent.com/v-briese/botler/main/assets/avatar.png",
						},
						author: {
							name: `Made by ${user.username}#${user.discriminator}`,
							url: `https://discord.com/users/${developer_id}`,
							icon_url: user.avatarURL(),
						},
						fields: [
							{
								name: "\u200B\nHost",
								value: "\u200B",
							},
							{
								name: "OS",
								value: `${os.type()} (${os.release()})`,
								inline: true,
							},
							{
								name: "Library",
								value: `discord.js v${dependencies["discord.js"]}`,
								inline: true,
							},
							{
								name: "Memory Usage",
								value: memoryUsage,
								inline: true,
							},
							{
								name: "Uptime",
								value: `${Math.floor(totalSeconds / 86400)}d, ${Math.floor(
									totalSeconds / 3600
								)}h, ${Math.floor(totalSeconds / 60)}m, ${Math.round(
									totalSeconds % 60
								)}s`,
								inline: true,
							},
							{
								name: "Ping",
								value: `${client.ws.ping}ms`,
								inline: true,
							},
							{ name: "\u200B\nStats", value: "\u200B" },
							{
								name: "Servers",
								value: client.guilds.cache.array().length,
								inline: true,
							},
							{
								name: "Channels",
								value: client.channels.cache.array().length,
								inline: true,
							},
							{
								name: "Users",
								value: client.users.cache.array().length,
								inline: true,
							},
							{
								name: "Commands",
								value: client.commands.size,
								inline: true,
							},
							{ name: "\u200B\nLinks", value: "\u200B" },
							{
								name: "Invite",
								value: "Nuh uh, not yet!",
								inline: true,
							},
							{
								name: "Support Server",
								value: `[Join](${support_server})`,
								inline: true,
							},
							{
								name: "Github",
								value: `[Click Here](${github})`,
								inline: true,
							},
							{
								name: "top.gg",
								value: "You'll have to wait a bit.",
								inline: true,
							},
						],
					},
				],
			});
		});

		return {
			type: 5,
		};
	},
};
