const {
	InteractionResponseType,
	InteractionResponseFlags,
} = require("discord-interactions");
const { Constants } = require("discord.js");

const choices = [];
for (const color in Constants.Colors) {
	if (
		color != "DEFAULT" &&
		color != "WHITE" &&
		color != "GOLD" &&
		color != "DARK_GOLD"
	) {
		const colorWords = color.toLowerCase().split("_");
		for (let i = 0; i < colorWords.length; i++) {
			colorWords[i] = colorWords[i][0].toUpperCase() + colorWords[i].substr(1);
		}

		choices.push({
			name: colorWords.join(" "),
			value: color,
		});
	}
}

module.exports = {
	command: {
		name: "embed",
		description: "Creates an embed with the given parameters.",
		options: [
			{
				type: 3,
				name: "title",
				description: "Embed title.",
			},
			{
				type: 3,
				name: "description",
				description: "Embed description.",
			},
			{
				type: 3,
				name: "url",
				description: "Embed URL.",
			},
			{
				type: 3,
				name: "color",
				description: "Embed color.",
				choices: choices,
			},
			{
				type: 3,
				name: "footer",
				description: "Embed footer text.",
			},
			{
				type: 3,
				name: "footer_icon",
				description: "Embed footer icon URL.",
			},
			{
				type: 3,
				name: "image",
				description: "Embed image URL.",
			},
			{
				type: 3,
				name: "thumbnail",
				description: "Embed thumbnail URL.",
			},
		],
	},

	permission: 0x20000,

	response: (interaction, client) => {
		const getOption = (option) => {
			return (
				interaction.data.options?.find((o) => o.name == option)?.value || null
			);
		};

		if (!getOption("title") && !getOption("description"))
			return {
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content:
						"Please provide at least one of the `title` or `description` parameters.",
					flags: InteractionResponseFlags.EPHEMERAL,
				},
			};

		const invalidLink = (parameter) => {
			return {
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: `Parameter \`${parameter}\` must start with either \`https\` or \`http\`.`,
					flags: InteractionResponseFlags.EPHEMERAL,
				},
			};
		};

		if (
			getOption("footer_icon") &&
			!getOption("footer_icon").includes("https") &&
			!getOption("footer_icon").includes("http")
		)
			return invalidLink("footer_icon");
		if (
			getOption("image") &&
			!getOption("image").includes("https") &&
			!getOption("image").includes("http")
		)
			return invalidLink("image");
		if (
			getOption("thumbnail") &&
			!getOption("thumbnail").includes("https") &&
			!getOption("thumbnail").includes("http")
		)
			return invalidLink("thumbnail");
		if (
			getOption("url") &&
			!getOption("url").includes("https") &&
			!getOption("url").includes("http")
		)
			return invalidLink("url");

		client.users
			.fetch(interaction?.member.user.id || interaction?.user.id)
			.then((user) => {
				require("../../util").editInteractionResponse(interaction.token, {
					embeds: [
						{
							title: getOption("title"),
							description: getOption("description"),
							url: getOption("url"),
							color: Constants.Colors[getOption("color")],
							footer: getOption("footer")
								? {
										text: getOption("footer"),
										icon_url: getOption("footer_icon"),
								  }
								: null,
							image: getOption("image")
								? {
										url: getOption("image"),
								  }
								: null,
							thumbnail: getOption("thumbnail")
								? {
										url: getOption("thumbnail"),
								  }
								: null,
							author: {
								name: user.username,
								url: `https://discord.com/users/${user.id}`,
								icon_url: user.avatarURL(),
							},
						},
					],
				});
			});

		return {
			type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
		};
	},
};
