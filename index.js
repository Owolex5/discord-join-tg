const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 3000;

// Required for Render Web Service (free tier expects an HTTP server)
app.get('/', (req, res) => {
  res.send('Discord Join Notifier Bot is alive!');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Bot logic
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!DISCORD_TOKEN || !TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('Missing env vars! Check Render dashboard.');
  process.exit(1);
}

const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const telegramBot = new TelegramBot(TELEGRAM_TOKEN);

discordClient.once('ready', () => {
  console.log(`Bot online as ${discordClient.user.tag}`);
});

discordClient.on('guildMemberAdd', async member => {
  try {
    const server = member.guild.name;
    const user = member.user.tag || member.user.username;
    const msg = `New join: ${user} joined ${server}`;

    await telegramBot.sendMessage(TELEGRAM_CHAT_ID, msg);
    console.log(`Sent: ${msg}`);
  } catch (err) {
    console.error('Send error:', err.message);
  }
});

discordClient.login(DISCORD_TOKEN);
