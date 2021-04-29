require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");
const { app_id, guild_id } = require("./config.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();

client.once("ready", () => {
	const globalCommandFiles = fs
		.readdirSync("./commands/global")
		.filter((file) => file.endsWith(".js"));

	let globalCommandsRegistered = 0;

	for (const file of globalCommandFiles) {
		const command = require(`./commands/global/${file}`);

		client.api
			.applications(app_id)
			.commands.post({ data: command.command })
			.then(() => {
				client.commands.set(command.command.name, command);

				globalCommandsRegistered += 1;

				if (globalCommandsRegistered >= globalCommandFiles.length)
					client.api
						.applications(app_id)
						.commands.get()
						.then((response) => {
							for (const command of response) {
								if (
									!globalCommandFiles.find(
										(file) => file.slice(0, file.length - 3) == command.name
									)
								)
									client.api.applications(app_id).commands(command.id).delete();
							}
						});
			});
	}
	console.log("[GLOBAL COMMANDS REGISTERED]");

	const guildCommandFiles = fs
		.readdirSync("./commands/guild")
		.filter((file) => file.endsWith(".js"));

	let guildCommandsRegistered = 0;

	for (const file of guildCommandFiles) {
		const command = require(`./commands/guild/${file}`);

		client.api
			.applications(app_id)
			.guilds(guild_id)
			.commands.post({ data: command.command })
			.then((returnedCommand) => {
				if (command.permissions)
					client.api
						.applications(app_id)
						.guilds(guild_id)
						.commands(returnedCommand.id)
						.permissions.put({ data: { permissions: command.permissions } });

				client.commands.set(command.command.name, command);

				guildCommandsRegistered += 1;

				if (guildCommandsRegistered >= guildCommandFiles.length)
					client.api
						.applications(app_id)
						.guilds(guild_id)
						.commands.get()
						.then((response) => {
							for (const command of response) {
								if (
									!guildCommandFiles.find(
										(file) => file.slice(0, file.length - 3) == command.name
									)
								)
									client.api
										.applications(app_id)
										.guilds(guild_id)
										.commands(command.id)
										.delete();
							}
						});
			});
	}
	console.log("[GUILD COMMANDS REGISTERED]");

	client.user.setActivity({
		type: "PLAYING",
		name: `at v${require("./package.json").version}`,
	});
	console.log("[ACTIVITY SET]");

	console.log("[READY]");
});

client.ws.on("INTERACTION_CREATE", async (interaction) => {
	console.log("[INTERACTION]:", interaction);

	try {
		switch (interaction.type) {
			case 2:
				if (!client.commands.has(interaction.data?.name)) break;

				const command = client.commands.get(interaction.data?.name);

				if (command.guild_only)
					if (!interaction.member)
						return client.api
							.interactions(interaction.id, interaction.token)
							.callback.post({
								data: {
									type: 4,
									data: {
										content:
											"You cannot use a guild only command in DM channel.",
										flags: 64,
									},
								},
							});

				if (command.permission)
					if (
						(interaction.member.permissions & command.permission) !=
						command.permission
					)
						return client.api
							.interactions(interaction.id, interaction.token)
							.callback.post({
								data: {
									type: 4,
									data: {
										content: "You do not have permission to use this command.",
										flags: 64,
									},
								},
							});

				if (
					(interaction.member?.user.id || interaction.user?.id) ==
					"795444538453393429"
				)
					return client.api
						.interactions(interaction.id, interaction.token)
						.callback.post({
							data: {
								type: 4,
								data: {
									content: "Hah nope",
								},
							},
						});

				client.api
					.interactions(interaction.id, interaction.token)
					.callback.post({
						data: command.response(interaction, client),
					});
				break;
			case 3:
				if (!client.commands.has(interaction.message?.interaction?.name)) break;

				client.api
					.interactions(interaction.id, interaction.token)
					.callback.post({
						data: client.commands
							.get(interaction.message?.interaction?.name)
							.buttonResponse(interaction, client),
					});
				break;
		}
	} catch (error) {
		console.error("[ERROR]: ", error);

		client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					content: `An error has occured! It reads as follows:\n\`\`\`js\n${error}\n\`\`\``,
				},
			},
		});
	}
});

client.login(process.env.BOT_TOKEN);
