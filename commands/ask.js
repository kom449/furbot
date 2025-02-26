const { SlashCommandBuilder } = require('discord.js');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Ask ChatGPT a question')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Your question')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const question = interaction.options.getString('question');

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: question }],
            });

            const reply = response.choices[0].message.content;

            await interaction.editReply(`🧠 **ChatGPT says:**\n${reply}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply('⚠️ An error occurred while getting a response.');
        }
    },
};
