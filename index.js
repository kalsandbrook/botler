require("dotenv").config();
const Discord = require("discord.js");
const admin = require("firebase-admin");

const client = new Discord.Client();
client.commands = new Discord.Collection();

module.exports = {
	client,
};

// Initialize Firebase

admin.initializeApp({
	credential: admin.credential.cert(
		JSON.parse(process.env.FIREBASE_CREDENTIALS)
	),
});
const db = admin.firestore();

// Register Commands & Services

require("./commands").register(client);
require("./services").register(client, db);

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
