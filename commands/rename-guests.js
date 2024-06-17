const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  checkVoiceChannelAndPermissions,
} = require("../utils/channel-permissions");
const { getExcludeIds } = require("../utils/exclusions");
const { updateCacheAndGetMembers } = require("../utils/members");
const { appendLogMessages } = require("../utils/log-messages");
const { extractSuffix, renameMembers } = require("../utils/nickname");
const { handleErrors } = require("../utils/error-handling");
const messages = require("../utils/messages");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rename-guests")
    .setDescription("Renames guest users in the voice channel.")
    .addStringOption((option) =>
      option
        .setName("exclude")
        .setDescription("Users to exclude (use mentions, e.g., @user1@user-2)")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("notify")
        .setDescription("Notify users about the renaming (yes/no).")
        .setRequired(false)
        .addChoices({ name: "yes", value: "yes" }, { name: "no", value: "no" })
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
        messages.createEphemeralMessage(messages.START_RENAMING)
      );

      const { members } = await updateCacheAndGetMembers(
        voiceChannel,
        commandUserId,
        excludeIds
      );
      if (members.length === 0) {
        await interaction.editReply(
          messages.createEphemeralMessage(messages.NO_USERS_TO_RENAME)
        );
        return;
      }

      const { renamedCount, failedUsers, logMessages, userDisconnectedCount } =
        await renameMembers(members, interaction, extractSuffix);

      let resultMessage = messages.RENAMED_USERS(renamedCount);
      if (Object.keys(failedUsers).length > 0) {
        resultMessage = messages.RENAME_FAILED(failedUsers);
      }

      // resultMessage = appendLogMessages(
      //   resultMessage,
      //   userDisconnectedCount,
      //   logMessages,
      //   messages
      // );

      const notify = interaction.options.getString("notify") === "yes";
      await interaction.editReply(
        messages.createEphemeralMessage(resultMessage)
      );

      if (notify && Object.keys(failedUsers).length === 0) {
        await interaction.followUp(
          messages.createMessage(messages.SUCCESSFUL_RENAME)
        );
      }
    } catch (error) {
      await handleErrors(interaction, "rename-guests", error);
    }
  },
};
