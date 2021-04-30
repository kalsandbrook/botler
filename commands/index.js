module.exports = {
	register: (client) => {
		const fs = require("fs");
		const { app_id, guild_id } = require("../config.json");

		// Register/Update/Delete Global Commands

		const globalCommandFiles = fs
			.readdirSync("./commands/global")
			.filter((file) => file.endsWith(".js"));

		let globalCommandsRegistered = 0;

		for (const file of globalCommandFiles) {
			const command = require(`./global/${file}`);

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
										client.api
											.applications(app_id)
											.commands(command.id)
											.delete();
								}
							});
				});
		}
		console.log("[GLOBAL COMMANDS REGISTERED]");

		// Register/Update/Delete Guild Commands

		const guildCommandFiles = fs
			.readdirSync("./commands/guild")
			.filter((file) => file.endsWith(".js"));

		let guildCommandsRegistered = 0;

		for (const file of guildCommandFiles) {
			const command = require(`./guild/${file}`);

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
	},
};
