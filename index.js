require("dotenv").config();
const Discord = require("discord.js");

const client = new Discord.Client();
client.commands = new Discord.Collection();

require("./commands").register(client);
require("./services").register(client);

// Set Activity

client.once("ready", () => {
	client.user.setActivity({
		type: "PLAYING",
		name: `at v${require("./package.json").version}`,
	});
	console.log("[ACTIVITY SET]");

	console.log("[READY]");
});

// Login

client.login(process.env.BOT_TOKEN);
