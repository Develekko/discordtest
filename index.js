// Require the necessary discord.js classes
require('dotenv').config()
const { Client, SlashCommandBuilder, GatewayIntentBits, REST, Routes } = require('discord.js');
const express = require('express');

const app = express();

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
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${server.address().port}`);
});
 
// Export the server so that it can be used by other modules
module.exports = server;
function myFunction() {
  console.log("Hello, world!");
}

// Export the function as the default export
module.exports = myFunction;
// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);