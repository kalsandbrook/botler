require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");
const { app_id, guild_id } = require("./config.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));

let commandsRegistered = 0;

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.api
		.applications(app_id)
		.guilds(guild_id)
		.commands.post({ data: command.command })
		.then(() => {
			client.commands.set(command.command.name, command);

			commandsRegistered += 1;

			if (commandsRegistered >= commandFiles.length)
				client.api
					.applications(app_id)
					.guilds(guild_id)
					.commands.get()
					.then(async (response) => {
						for (const command of await response) {
							if (!client.commands.has(command.name))
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
