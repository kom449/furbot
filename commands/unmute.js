const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmutes a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to unmute')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
            return interaction.reply({ content: '❌ You **do not** have permission to use this command.', ephemeral: true });
        }
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) return interaction.reply({ content: '❌ User not found.', ephemeral: true });

        try {
            await member.timeout(null);
            await interaction.reply(`✅ **${user.tag}** has been unmuted.`);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '⚠️ I was unable to unmute the user.', ephemeral: true });
        }
    },
};
