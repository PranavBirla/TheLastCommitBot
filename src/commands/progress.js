const {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("progress")
        .setDescription("Submit today's progress"),

    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId("progressModal")
            .setTitle("Today's Progress");

        const workInput = new TextInputBuilder()
            .setCustomId("workDone")
            .setLabel("What did you build today?")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const hoursInput = new TextInputBuilder()
            .setCustomId("hoursWorked")
            .setLabel("Hours Worked")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const githubInput = new TextInputBuilder()
            .setCustomId("githubLink")
            .setLabel("GitHub Link (Optional)")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const tomorrowInput = new TextInputBuilder()
            .setCustomId("tomorrowGoal")
            .setLabel("Tomorrow's Goal")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(workInput),
            new ActionRowBuilder().addComponents(hoursInput),
            new ActionRowBuilder().addComponents(githubInput),
            new ActionRowBuilder().addComponents(tomorrowInput)
        );

        await interaction.showModal(modal);

    }

};