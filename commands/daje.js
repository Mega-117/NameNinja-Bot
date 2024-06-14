const { SlashCommandBuilder } = require("@discordjs/builders");
const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daje")
    .setDescription("Invia l'immagine daje-banana.gif."),
  async execute(interaction) {
    const filePath = path.join(__dirname, "../assets/daje-banana.gif");
    const fallbackUrl =
      "https://gifs.eco.br/wp-content/uploads/2021/09/gifs-de-banana-25.gif";

    try {
      // Check if the file exists
      if (fs.existsSync(filePath)) {
        // If the local file exists, use it
        const attachment = new AttachmentBuilder(filePath);
        await interaction.reply({ files: [attachment] });
      } else {
        // If the local file doesn't exist, use the fallback URL
        const embed = new EmbedBuilder()
          .setTitle("Daje!")
          .setImage(fallbackUrl)
          .setDescription(
            "Non sono riuscito ad accedere all'immagine locale, ecco una immagine di riserva."
          );
        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error("Error accessing the image:", error);
      // In case of any other error, use the fallback URL
      const embed = new EmbedBuilder()
        .setTitle("Daje!")
        .setImage(fallbackUrl)
        .setDescription(
          "Si è verificato un errore, ecco una immagine di riserva."
        );
      await interaction.reply({ embeds: [embed] });
    }
  },
};
