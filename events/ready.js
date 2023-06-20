import { commands } from "../commands/commands.js";
import { client } from "../utils/client.js";
import { REST, Routes } from 'discord.js';
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