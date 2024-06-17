const { SlashCommandBuilder } = require("@discordjs/builders");
const { AttachmentBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const messages = require("../utils/messages");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daje")
    .setDescription("Invia l'immagine daje-banana.gif."),
  async execute(interaction) {
    const filePath = path.join(__dirname, "../assets/daje-banana.gif");

    try {
      if (fs.existsSync(filePath)) {
        const attachment = new AttachmentBuilder(filePath);
        await interaction.reply({ files: [attachment] });
      } else {
        throw new Error("Local file not found.");
      }
    } catch (error) {
      console.error("Error accessing the image:", error);
      await interaction.reply({
        content: messages.IMAGE_ERROR,
        ephemeral: true,
      });
    }
  },
};
