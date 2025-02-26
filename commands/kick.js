const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for kicking')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({ content: '❌ You **do not** have permission to use this command.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!member) return interaction.reply({ content: '❌ User not found.', ephemeral: true });

        if (!member.kickable) {
            return interaction.reply({ content: '❌ I **cannot** kick this user. They might have a higher role than me.', ephemeral: true });
        }

        try {
            await member.kick(reason);
            await interaction.reply(`✅ **${user.tag}** has been kicked. Reason: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '⚠️ I was unable to kick the user.', ephemeral: true });
        }
    },
};
