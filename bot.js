import "dotenv/config";
import { Client, Intents } from "discord.js";
import fetch from "node-fetch";

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const MIDJOURNEY_CHANNEL_ID = process.env.MIDJOURNEY_CHANNEL_ID; // Set this in Railway
const APPLICATION_ID = "936929561302675456"; // MidJourney Bot Application ID
const COMMAND_ID = "938956540159881230"; // MidJourney /imagine command ID

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.MESSAGE_CONTENT,
    ],
});

client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!generate")) {
        let prompt = message.content.replace("!generate", "").trim();
        if (!prompt) return message.reply("❌ Please provide a prompt!");

        try {
            const response = await fetch(`https://discord.com/api/v9/interactions`, {
                method: "POST",
                headers: {
                    "Authorization": `Bot ${TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: 2, // Application Command
                    application_id: APPLICATION_ID,
                    guild_id: message.guild.id,
                    channel_id: MIDJOURNEY_CHANNEL_ID,
                    session_id: "random-session-id",
                    data: {
                        id: COMMAND_ID,
                        name: "imagine",
                        type: 1,
                        options: [{ name: "prompt", type: 3, value: prompt }],
                    },
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

client.login(TOKEN);
