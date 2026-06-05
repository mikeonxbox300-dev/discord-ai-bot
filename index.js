require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [
          { role: "system", content: "You are a helpful Discord bot." },
          { role: "user", content: message.content }
        ]
      })
    });

    const data = await response.json();

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.log("Grok response error:", data);
      return message.reply("AI didn't respond properly.");
    }

    message.reply(reply);

  } catch (err) {
    console.error("Grok ERROR:", err);
    message.reply("Error talking to AI.");
  }
});

client.login(process.env.DISCORD_TOKEN);
