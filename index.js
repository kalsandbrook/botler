require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");
const { app_id, guild_id } = require("./config.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();

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
		.then(() => {
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

client.once("ready", () => {
	client.user.setActivity({
		type: "PLAYING",
		name: `at v${require("./package.json").version}`,
	});

	console.log("Ready!");
});

client.ws.on("INTERACTION_CREATE", async (interaction) => {
	console.log("[INTERACTION]:", interaction);

	try {
		switch (interaction.type) {
			case 2:
				if (!client.commands.has(interaction.data?.name)) break;

				client.api
					.interactions(interaction.id, interaction.token)
					.callback.post({
						data: client.commands
							.get(interaction.data?.name)
							.response(interaction, client),
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
