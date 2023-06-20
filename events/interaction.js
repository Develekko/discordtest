import { YoutubeExtractor } from "@discord-player/extractor";
import { client } from "../utils/client.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import { Player ,QueryType} from "discord-player"
import { EmbedBuilder } from 'discord.js';
import ytdl from "ytdl-core";
  // Add the player on the client
  const player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
  })

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    const command = interaction.commandName;
  
    if (command === 'movie') {
      const movieTitle = interaction.options.getString('title');
      const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`;
  
      const response = await fetch(url);
      const movieData = await response.json();
      if (movieData.Response === 'False') {
        await interaction.reply(`Sorry, I could not find any movies with the title ${movieTitle}`);
      } else {
        const movieEmbeds = movieData.results.slice(0,10).map(movie=>{
            return {
                title: `${movie.title} (${movie.release_date})`,
                description: movie.overview,
                thumbnail: { url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`},
                fields: [
                  { name: 'Rating', value: `${movie.vote_average}/10` },
                  // { name: 'Genre', value: movie.Genre },
                  // { name: 'Director', value: movie.Director },
                  // { name: 'Actors', value: movie.Actors },
                ],
              };
        })
        if (movieEmbeds.length === 0) {
          await interaction.reply(`Sorry, I could not find any movies with that title.`);
        } else {
          await interaction.reply({ embeds: movieEmbeds });
        }
      }
    }

    if(command ==='play'){
           // Make sure the user is inside a voice channel
		// if (!interaction.member.voice.channel) return interaction.reply("You need to be in a Voice Channel to play a song.");

  //  // Create a play queue for the server
  //  const queue = await client.player.createPlaylist(interaction.guild);
  //  // Wait until you are connected to the channel
  //   if (!queue.connection) await queue.connect(interaction.member.voice.channel)
  //   console.log(queue);

    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: "You need to be in a Voice Channel to play a song!", ephemeral: true });
  }
  await interaction.deferReply();
  await player.extractors.register(YoutubeExtractor, {});
    const query = interaction.options.get("song").value;
    const searchResult = await player.search(query, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO
  }).catch(() => {});
    if (!searchResult || !searchResult.tracks.length)  return interaction.followUp({ content: "No results were found!", ephemeral: true });

    const queue = player.nodes.create(interaction.guildId, {
        metadata: {
        channel: interaction.channel,
        client: interaction.guild.members.me,
        requestedBy: interaction.user,
        },
        selfDeaf: true,
        volume: 80,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 300000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 300000,
      });
  try {
      if (!queue.connection) await queue.connect(interaction.member.voice.channel);
  } catch {
       player.nodes.delete(interaction.guildId);
      return  interaction.followUp({ content: "Could not join your voice channel!" });
  }
  await interaction.followUp({ content: `⏱ | Loading your ${searchResult.playlist ? "playlist" : "track"}...` });
  if (searchResult.playlist) {
    searchResult.tracks.forEach((track) => {
    queue.addTrack(track);
    });
  } else {
    queue.addTrack(searchResult.tracks[0]);
  }
    if (!queue.node.isPlaying()) await queue.node.play();
    }
    if(command === 'queue'){
      await interaction.deferReply();
      const queue = player.nodes.get(interaction.guildId);
      if (!queue || !queue.node.isPlaying()) return  interaction.followUp({ content: "❌ | No music is being played!" });
      const currentTrack = queue.currentTrack;
      if(queue.tracks.size === 0)
      {
        queue.addTrack(currentTrack)
      }
      const tracks = queue.tracks.data.slice(0, 10).map((m, i) => {
          return `${i + 1}. **${m.title}** ([link](${m.url}))`;
      });
  
      return void interaction.followUp({
          embeds: [
              {
                  title: "Server Queue",
                  description: `${tracks.join("\n")}${
                      queue.tracks.length > tracks.length
                          ? `\n...${queue.tracks.length - tracks.length === 1 ? `${queue.tracks.length - tracks.length} more track` : `${queue.tracks.length - tracks.length} more tracks`}`
                          : ""
                  }`,
                  color: 0xff0000,
                  fields: [{ name: "Now Playing", value: `🎶 | **${currentTrack.title}** ([link](${currentTrack.url}))` }]
              }
          ]
      });
    }
    if(command === 'skip'){
      await interaction.deferReply();
      const queue = player.nodes.get(interaction.guildId);
    if (!queue || !queue.node.isPlaying()) return void interaction.followUp({ content: "❌ | No music is being played!" });
    const currentTrack = queue.currentTrack;
    const success = queue.node.skip();
    if(queue.tracks.size ===0)
    {
      player.destroy()
      return void interaction.followUp({
        content: success ? `✅ | Skipped **${currentTrack}**! Queue has ended` : "❌ | Something went wrong!"
    });
    }else
    {
      return void interaction.followUp({
        content: success ? `✅ | Skipped **${currentTrack}**!` : "❌ | Something went wrong!"
    });
    }
    }

    if(command === 'stop'){
      await interaction.deferReply();
      const queue = player.nodes.get(interaction.guildId);
      if (!queue || !queue.node.isPlaying()) return interaction.followUp({ content: "❌ | No music is being played!" });
      const progress =queue.node.createProgressBar();
      const perc = queue.node.getTimestamp();
      return void interaction.followUp({
          embeds: [
              {
                  title: "Now Playing",
                  description: `🎶 | **${queue.currentTrack.title}**! (\`${perc.progress}%\`)`,
                  fields: [
                      {
                          name: "\u200b",
                          value: progress
                      }
                  ],
                  color: 0xffffff
              }
          ]
      });
    }
  });