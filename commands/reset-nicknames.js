const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionsBitField } = require("discord.js");

const TIMEOUT = 3000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reset-nicknames")
    .setDescription("Resets the nicknames of users in the voice channel.")
    .addStringOption((option) =>
      option
        .setName("exclude")
        .setDescription(
          "Users to exclude (concatenated mentions, e.g., @prino421@palo423_86538)."
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      const voiceChannel = interaction.member.voice.channel;
      if (!voiceChannel) {
        return interaction.reply({
          content: "You must be in a voice channel to use this command. :sob:",
          ephemeral: true,
        });
      }

      const botMember = interaction.guild.members.cache.get(
        interaction.client.user.id
      );
      if (
        !botMember
          .permissionsIn(voiceChannel)
          .has(PermissionsBitField.Flags.ManageNicknames)
      ) {
        // console.error(
        //   "The bot does not have the necessary permissions to reset nicknames :scream: \nModify the permissions in server roles or manage the hierarchy :face_with_monocle:."
        // );
        return interaction.reply({
          content:
            "The bot does not have the necessary permissions to reset nicknames :scream: \nModify the permissions in server roles or manage the hierarchy :face_with_monocle:.",
          ephemeral: true,
        });
      }

      await interaction.reply({
        content: ":sunglasses: Starting nickname reset...  :rocket: ",
        ephemeral: true,
      });

      const updateCache = async () => {
        try {
          await Promise.all(
            voiceChannel.members.map((member) => member.fetch())
          );
        } catch (error) {
          // console.error("Error updating cache:", error);
          throw new Error("Cache update failed");
        }
      };

      await updateCache();
      await new Promise((resolve) => setTimeout(resolve, TIMEOUT));

      const commandUserId = interaction.user.id;
      const excludeOption = interaction.options.getString("exclude");
      const excludeIds = [];

      if (excludeOption) {
        const excludeMentions = excludeOption.match(/<@!?(\d+)>/g);
        if (excludeMentions) {
          for (const mention of excludeMentions) {
            const matches = mention.match(/^<@!?(\d+)>$/);
            if (matches && matches[1]) {
              excludeIds.push(matches[1]);
            } else {
              // console.error(`Invalid mention: ${mention}`);
              await interaction.editReply({
                content: `The mention ${mention} is invalid. Use the correct mention format. :sob:`,
                ephemeral: true,
              });
              return;
            }
          }
        } else {
          // console.error(`Invalid mentions: ${excludeOption}`);
          await interaction.editReply({
            content: `The mentions ${excludeOption} are invalid. Use the correct mention format. :sob:`,
            ephemeral: true,
          });
          return;
        }
      }

      const members = Array.from(voiceChannel.members.values()).filter(
        (member) =>
          member.id !== commandUserId && !excludeIds.includes(member.id)
      );

      if (members.length === 0) {
        await interaction.editReply({
          content:
            "There are no other users in your voice channel to reset nicknames. :melting_face:",
          ephemeral: true,
        });
        return;
      }

      const failedUsers = {};
      const logMessages = [];
      let userDisconnectedCount = 0;
      let retryCount = 0;

      async function resetNicknames() {
        for (const member of members) {
          if (!voiceChannel.members.has(member.id)) {
            const disconnectMsg = `User ${member.user.tag} has left the voice channel.`;
            logMessages.push(disconnectMsg);
            userDisconnectedCount++;
            continue;
          }

          try {
            await member.setNickname("");
          } catch (error) {
            // console.error(
            //   `Unable to reset nickname for ${member.user.tag}:`,
            //   error
            // );
            failedUsers[member.user.tag] = "unknown error";
          }
        }
      }

      async function attemptReset() {
        try {
          await resetNicknames();
        } catch (error) {
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            await updateCache();
            await new Promise((resolve) =>
              setTimeout(resolve, RETRY_DELAY * retryCount)
            );
            await attemptReset();
          } else {
            throw error;
          }
        }
      }

      await attemptReset();

      let resultMessage = `Nicknames of ${
        members.length - userDisconnectedCount
      } users have been reset.`;
      if (Object.keys(failedUsers).length > 0) {
        const failedUserNames = Object.keys(failedUsers).slice(0, 3);
        resultMessage = `Not all nicknames have been reset successfully. :rage:: \nThe bot might not have permission to change the nicknames of certain users (e.g., users with the Administrator role). Please check the role hierarchy.\nFailed to reset nicknames for user(s): ${failedUserNames.join(
          ", "
        )}${
          Object.keys(failedUsers).length > 3 ? ", ..." : ""
        } :face_with_monocle:`;
      }

      if (userDisconnectedCount > 0) {
        resultMessage += `\n\n${userDisconnectedCount} user(s) disconnected from the voice channel during the reset process.`;
      }

      if (logMessages.length > 0) {
        resultMessage += `\n\nLogs:\n${logMessages.join("\n")}`;
      }

      await interaction.editReply({ content: resultMessage, ephemeral: true });
    } catch (error) {
      const errorMsg = `An error occurred while executing the "reset-nicknames" command: ${error}`;
      //console.error(errorMsg);
      await interaction.editReply({
        content: `An error occurred while executing the "reset-nicknames" command. :sob:`,
        ephemeral: true,
      });
    }
  },
};
