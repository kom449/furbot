const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutes a user for a specified duration')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to mute')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('Mute duration in minutes')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
            return interaction.reply({ content: '❌ You **do not** have permission to use this command.', ephemeral: true });
        }        
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        const duration = interaction.options.getInteger('duration');

        if (!member) return interaction.reply({ content: '❌ User not found.', ephemeral: true });

        try {
            await member.timeout(duration * 60 * 1000, 'Muted by a moderator');
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('🔇 Mute')
                .setDescription(`✅ **${user.tag}** has been muted for **${duration} minutes**.`);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '⚠️ I was unable to mute the user.', ephemeral: true });
        }
    },
};
