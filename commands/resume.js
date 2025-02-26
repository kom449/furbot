const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes the paused song'),
    async execute(interaction, client) {
        const queue = client.queue.get(interaction.guild.id);
        if (!queue || !queue.player) return interaction.reply('❌ No song is currently paused.');

        queue.player.unpause();
        await interaction.reply('▶ Resumed the song.');
    },
};
