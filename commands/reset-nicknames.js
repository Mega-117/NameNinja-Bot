const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  checkVoiceChannelAndPermissions,
} = require("../utils/channel-permissions");
const { getExcludeIds } = require("../utils/exclusions");
const { updateCacheAndGetMembers } = require("../utils/members");
const { appendLogMessages } = require("../utils/log-messages");
const { resetNicknames } = require("../utils/nickname");
const { handleErrors } = require("../utils/error-handling");
const messages = require("../utils/messages");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reset-nicknames")
    .setDescription("Resets the nicknames of users in the voice channel.")
    .addStringOption((option) =>
      option
        .setName("exclude")
        .setDescription("Users to exclude (use mentions, e.g., @user1@user-2)")
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      const { voiceChannel, error: voiceError } =
        await checkVoiceChannelAndPermissions(interaction, messages);
      if (voiceError) return;

      const commandUserId = interaction.user.id;
      const excludeOption = interaction.options.getString("exclude");
      const { excludeIds, error: excludeError } = await getExcludeIds(
        interaction,
        excludeOption,
        messages
      );
      if (excludeError) return;

      await interaction.reply(
        messages.createEphemeralMessage(messages.START_RESETTING)
      );

      const { members } = await updateCacheAndGetMembers(
        voiceChannel,
        commandUserId,
        excludeIds
      );
      if (members.length === 0) {
        await interaction.editReply(
          messages.createEphemeralMessage(messages.NO_USERS_TO_RESET)
        );
        return;
      }

      const { resetCount, failedUsers, logMessages, userDisconnectedCount } =
        await resetNicknames(members, interaction);

      let resultMessage = messages.RESET_NICKNAMES(resetCount);
      if (Object.keys(failedUsers).length > 0) {
        resultMessage = messages.RESET_FAILED(failedUsers);
      }

      // resultMessage = appendLogMessages(
      //   resultMessage,
      //   userDisconnectedCount,
      //   logMessages,
      //   messages
      // );

      await interaction.editReply(
        messages.createEphemeralMessage(resultMessage)
      );
    } catch (error) {
      await handleErrors(interaction, "reset-nicknames", error);
    }
  },
};
