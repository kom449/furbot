const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the music and clears the queue'),
    async execute(interaction, client) {
        const queue = client.queue.get(interaction.guild.id);
        if (!queue || !queue.player) return interaction.reply('❌ No song is currently playing.');

        queue.songs = [];
        queue.player.stop();
        queue.connection.destroy();
        client.queue.delete(interaction.guild.id);

        await interaction.reply('🛑 Stopped the music and cleared the queue.');
    },
};
