import "dotenv/config";
import pkg from "discord.js";
const { Client, GatewayIntentBits } = pkg;
import fetch from "node-fetch";
import express from "express";
import cors from "cors";

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const MIDJOURNEY_CHANNEL_ID = process.env.MIDJOURNEY_CHANNEL_ID;
const APPLICATION_ID = "936929561302675456";
const COMMAND_ID = "938956540159881230";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!generate")) {
        let prompt = message.content.replace("!generate", "").trim();
        if (!prompt) return message.reply("❌ Please provide a prompt!");

        await sendPromptToMidJourney(prompt);
        message.reply("✅ Prompt sent to MidJourney!");
    }
});

// ✅ Express Server to Accept Requests from Elementor
const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: "No prompt provided" });
    }

    try {
        await sendPromptToMidJourney(prompt);
        res.json({ success: true, message: "Prompt sent to MidJourney!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send prompt" });
    }
});

async function sendPromptToMidJourney(prompt) {
    return fetch(`https://discord.com/api/v9/interactions`, {
        method: "POST",
        headers: {
            "Authorization": `Bot ${TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            type: 2,
            application_id: APPLICATION_ID,
            guild_id: MIDJOURNEY_CHANNEL_ID, 
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
}

// ✅ Start Express server on Railway's port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

client.login(TOKEN);
