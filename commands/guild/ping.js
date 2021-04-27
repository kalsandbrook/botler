module.exports = {
	command: {
		name: "ping",
		description: "Gets the bot's ping in miliseconds.",
	},

	response: (_, client) => {
		return {
			type: 4,
			data: {
				content: `${client.ws.ping}ms`,
			},
		};
	},
};
