module.exports = {
	register: (client) => {
		require("./interactionCreate").register(client);
	},
};
