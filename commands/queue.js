const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Shows the current song queue'),
    async execute(interaction, client) {
        const queue = client.queue.get(interaction.guild.id);

        if (!queue || queue.songs.length === 0) {
            return interaction.reply('❌ The queue is empty.');
        }

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('🎵 Music Queue')
            .setDescription('Here are the upcoming songs:')
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        queue.songs.forEach((song, index) => {
            embed.addFields({
                name: `#${index + 1}`,
                value: `[Song Link](${song.url}) - Requested by **${song.requestedBy}**`,
            });
        });

        await interaction.reply({ embeds: [embed] });
    },
};
