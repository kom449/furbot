const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song and plays the next one in queue'),
    async execute(interaction, client) {
        const queue = client.queue.get(interaction.guild.id);

        if (!queue || queue.songs.length === 0) {
            return interaction.reply('❌ There is no song currently playing.');
        }

        if (queue.songs.length === 1) {
            queue.player.stop();
            queue.connection.destroy();
            client.queue.delete(interaction.guild.id);
            return interaction.reply('⏭ Skipped the song. No more songs in the queue.');
        }

        queue.songs.shift(); // Remove the current song

        queue.player.stop(); // Trigger the next song to play

        await interaction.reply('⏭ Skipped the song! Playing the next one.');
    },
};
