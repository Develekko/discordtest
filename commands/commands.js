// export const commands = [
//   {
//     name: "movie",
//     description: "Replies with moviestrend!",
//   },
//   {
//     name: "play",
//     description: "Play Movie!",
//     options: [
//         {
//           name: 'song',
//           description: 'The name of the song to play',
//           type: 'STRING',
//           required: true
//         },
//         {
//           name: 'loop',
//           description: 'Whether or not to loop the song',
//           type: 'BOOLEAN'
//         }
//       ],
//   },
// ];
import { SlashCommandBuilder } from 'discord.js';

const playCommand = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song')
    .addStringOption(option =>
        option.setName('song')
            .setDescription('The name of the song to play')
            .setRequired(true)
    )
    .addBooleanOption(option =>
        option.setName('loop')
            .setDescription('Whether or not to loop the song')
    );

const stopCommand = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop playing the song');

    const queueCommand = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('queue playing the song');

    const skipCommand = new SlashCommandBuilder()
    .setName('skip')
    .setDescription('skip playing the song');

const commands = [playCommand, stopCommand,queueCommand,skipCommand];

export { commands };