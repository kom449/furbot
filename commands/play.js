const { SlashCommandBuilder } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a YouTube song in a voice channel')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('YouTube URL of the song')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const url = interaction.options.getString('url');
        const voiceChannel = interaction.member.voice.channel;
        const user = interaction.user;

        if (!voiceChannel) {
            return interaction.reply('❌ You need to join a voice channel first!');
        }

        const guildId = interaction.guild.id;

        if (!client.queue.has(guildId)) {
            client.queue.set(guildId, {
                voiceChannel,
                connection: null,
                player: createAudioPlayer(),
                songs: [],
            });
        }

        const queue = client.queue.get(guildId);
        queue.songs.push({ url, requestedBy: user.tag });

        if (!queue.connection) {
            queue.connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            queue.connection.subscribe(queue.player);

            queue.player.on(AudioPlayerStatus.Idle, () => {
                queue.songs.shift();
                if (queue.songs.length > 0) {
                    playSong(queue);
                } else {
                    queue.connection.destroy();
                    client.queue.delete(guildId);
                }
            });
        }

        if (queue.songs.length === 1) {
            playSong(queue);
        }

        await interaction.reply(`🎶 Added to queue: ${url} (Requested by **${user.tag}**)`);
    },
};

async function playSong(queue) {
    if (!queue.songs.length) return;

    const song = queue.songs[0];
    const stream = await play.stream(song.url);
    const resource = createAudioResource(stream.stream, { inputType: stream.type });

    queue.player.play(resource);
}
