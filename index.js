// Require the necessary discord.js classes
require('dotenv').config()
const { Client, SlashCommandBuilder, GatewayIntentBits, REST, Routes } = require('discord.js');


const testCommand = new SlashCommandBuilder()
.setName('test')
.setDescription('test playing the song');

const commands = [testCommand]
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.on('ready', () => {
  // Get all ids of the servers
  const guild_ids = client.guilds.cache.map(guild => guild.id);
  const rest = new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN);
  for (const guildId of guild_ids)
  {
      rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), 
          {body: commands})
      .then(() => console.log('Successfully updated commands for guild ' + guildId))
      .catch(console.error);
  }
console.log(`Logged in as ${client.user.tag}!`);
});
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'test') {
    await interaction.reply('Pong!');
  }
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);