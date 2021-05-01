module.exports = {
	register: (client, db) => {
		require("./interactionCreate").register(client, db);
	},
};
