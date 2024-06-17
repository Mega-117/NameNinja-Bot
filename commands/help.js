const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides information about the available commands."),
  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("NameNinja-Bot Help")
      .setDescription(
        "This bot renames users in a voice channel sequentially or in a shuffled order. It maintains the content within any type of brackets in the nickname.\n\n"
      )
      .addFields(
        {
          name: "`Note:`",
          value:
            "That the renaming commands only work if you are in a voice chat with other users. The user who initiates the command is not subject to renaming.",
        },
        {
          name: "\u200B", // empty field to create space
          value: "\n",
        },
        {
          name: "`/shuffle-rename-guests`",
          value:
            "Shuffles and renames guest users in the voice channel.\n\nUsage: `/shuffle-rename-guests [exclude: @user1@user2] [notify: yes/no]`\n\nExamples:\n- `/shuffle-rename-guests`\n- `/shuffle-rename-guests exclude: @user1@user2`\n- `/shuffle-rename-guests notify: yes`\n\nnotify: Notify users to refresh if names don't update.\n\nNote: The attributes are optional.",
        },
        {
          name: "\u200B",
          value: "\n",
        },
        {
          name: "`/rename-guests`",
          value:
            "Renames guest users in the voice channel in a sequential order.\n\nUsage: `/rename-guests [exclude: @user1@user2] [notify: yes/no]`\n\nExamples:\n- `/rename-guests`\n- `/rename-guests exclude: @user1@user2`\n- `/rename-guests notify: yes`\n\nnotify: Notify users to refresh if names don't update.\n\nNote: The attributes are optional.",
        },
        {
          name: "\u200B",
          value: "\n",
        },
        {
          name: "`/reset-nickname`",
          value:
            "Resets the nicknames of users in the voice channel to their original names.\n\nUsage: `/reset-nickname [exclude: @user1@user2]`\n\nExamples:\n- `/reset-nickname`\n- `/reset-nickname exclude: @user1@user2`\n\nNote: The attributes are optional.",
        } /*,
        {
          name: "\u200B",
          value: "\n",
        },
        {
          name: "`/update-cache`",
          value:
            "Updates the cache of members in the voice channel to ensure the latest data is used.\n\nUsage: `/update-cache`\n\nExample: `/update-cache`",
        }*/
      )
      .setFooter({
        text: "Note: When renaming, the bot retains the content within any type of brackets in the nickname.",
      });

    await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
  },
};
