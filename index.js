import * as dotenv from 'dotenv';
dotenv.config();
import { Client, GatewayIntentBits,Partials  } from 'discord.js';
import { REST, Routes } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';

const stopCommand = new SlashCommandBuilder()
    .setName('test')
    .setDescription('Stop playing the song');

const commands = [stopCommand];
export const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.DirectMessageTyping
    ],
    partials:[Partials.Channel]
  });
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
client.on('interactionCreate',(x)=>{
  if(x.commandName ==='test')
  {
    return x.reply('Test')
  }
})
client.login(process.env.DISCORD_TOKEN)