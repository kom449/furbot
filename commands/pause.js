const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song'),
    async execute(interaction, client) {
        const queue = client.queue.get(interaction.guild.id);
        if (!queue || !queue.player) return interaction.reply('❌ No song is currently playing.');

        queue.player.pause();
        await interaction.reply('⏸ Paused the song.');
    },
};
