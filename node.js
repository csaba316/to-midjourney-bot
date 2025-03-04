const { Client, Intents } = require("discord.js");
const fetch = require("node-fetch");

const TOKEN = "YOUR_DISCORD_BOT_TOKEN";
const MIDJOURNEY_CHANNEL_ID = "YOUR_MIDJOURNEY_CHANNEL_ID"; 

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!generate")) {
        let prompt = message.content.replace("!generate", "").trim();
        if (!prompt) return message.reply("Please provide a prompt!");

        try {
            const response = await fetch(`https://discord.com/api/v9/interactions`, {
                method: "POST",
                headers: {
                    "Authorization": `Bot ${TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: 2,  // Type 2 = Application Command
                    application_id: "936929561302675456",  // MidJourney Bot ID
                    guild_id: message.guild.id,
                    channel_id: MIDJOURNEY_CHANNEL_ID,
                    session_id: "random-session-id",
                    data: {
                        id: "938956540159881230",  // /imagine Command ID
                        name: "imagine",
                        type: 1,
                        options: [{ name: "prompt", type: 3, value: prompt }]
                    }
                }),
            });

            if (response.ok) {
                message.reply("✅ Prompt sent to MidJourney!");
            } else {
                message.reply("❌ Failed to send prompt!");
            }
        } catch (error) {
            console.error(error);
            message.reply("❌ Error processing your request!");
        }
    }
});

client.login(TOKEN);
