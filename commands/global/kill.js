module.exports = {
	command: {
		name: "kill",
		description: "Kills someone. (Doesn't actually, don't worry.)",
		options: [
			{
				type: 6,
				name: "member",
				description: "Server member to kill.",
				required: true,
			},
		],
	},

	response: (interaction) => {
		const victim = interaction.data.options[0].value;
		const responses = [
			`Say goodbye, <@${victim}>!`,
			`Hasta la vista, <@${victim}>!`,
			`Say hello to my little friend, <@${victim}>!`,
			`My name is ~~Inigo Montoya~~ Botler. You killed my ~~father~~ creator. Prepare to die, <@${victim}>.`,
			`I have come here to chew bubblegum and kick ass. And I'm all out of bubblegum, <@${victim}>.`,
			`I have come here to chew ass and kick bubblegum. And I'm all out of ass, <@${victim}>`,
			`Long live the king, <@${victim}>!`,
			`Get off my plane, <@${victim}>.`,
			`Dodge this, <@${victim}>!`,
			`You shall not pass, <@${victim}>!`,
			`This is sparta, <@${victim}>!`,
			`I'm gonna make this pencil disappear, <@${victim}>!`,
			`You once were a VE-GON, but now you will BE GONE, <@${victim}>!`,
		];

		return {
			type: 4,
			data: {
				embeds: [
					{
						title: "/kill",
						description:
							responses[Math.floor(Math.random() * responses.length - 1)],
						color: require("discord.js").Constants.Colors.RED,
						image: {
							url:
								"https://cdn.discordapp.com/emojis/758739709781868584.png?v=1",
						},
					},
				],
			},
		};
	},
};
