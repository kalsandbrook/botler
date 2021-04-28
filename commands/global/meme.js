module.exports = {
	command: {
		name: "meme",
		description: "Fetches a random meme from r/memes.",
	},

	response: (interaction, client) => {
		const fetch = require("node-fetch");

		const fetchMeme = () => {
			fetch("https://www.reddit.com/r/meme/hot/.json?limit=100", {
				headers: { "Content-Type": "application/json" },
			})
				.then((r) => r.json())
				.then((response) => {
					const redditPost =
						response.data.children[
							Math.floor(Math.random() * response.data.children.length - 1)
						].data;

					client.channels.fetch(interaction.channel_id).then((channel) => {
						if (!channel.nsfw && redditPost.over_18) return fetchMeme();

						fetch(
							`https://discord.com/api/v8/webhooks/${
								require("../../config.json").app_id
							}/${interaction.token}/messages/@original`,
							{
								method: "patch",
								body: JSON.stringify({
									embeds: [
										{
											title: redditPost.subreddit_name_prefixed,
											description: `[${redditPost.title}](https://www.reddit.com${redditPost.permalink})`,
											url: `https://www.reddit.com/${redditPost.subreddit_name_prefixed}`,
											timestamp: new Date(
												redditPost.created_utc * 1000
											).toISOString(),
											color: require("discord.js").Constants.Colors.ORANGE,
											footer: {
												text: "Provided by Reddit",
												icon_url:
													"https://raw.githubusercontent.com/v-briese/botler/main/assets/reddit.png",
											},
											image:
												redditPost.post_hint == "image"
													? {
															url: redditPost.url,
													  }
													: undefined,
											video:
												redditPost == "video"
													? {
															url: redditPost.url,
													  }
													: undefined,
											author: {
												name: `Posted by u/${redditPost.author}`,
												url: `https://www.reddit.com/user/${redditPost.author}/`,
											},
										},
									],
								}),
								headers: {
									Authorization: "Bot " + process.env.BOT_TOKEN,
									"Content-Type": "application/json",
								},
							}
						);
					});
				});
		};

		fetchMeme();

		return {
			type: 5,
		};
	},
};
