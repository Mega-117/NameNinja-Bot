const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  checkVoiceChannelAndPermissions,
} = require("../utils/channel-permissions");
const { getExcludeIds } = require("../utils/exclusions");
const { updateCacheAndGetMembers } = require("../utils/members");
const { appendLogMessages } = require("../utils/log-messages");
const { extractSuffix, shuffleAndRenameMembers } = require("../utils/nickname");
const { handleErrors } = require("../utils/error-handling");
const messages = require("../utils/messages");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle-rename-guests")
    .setDescription("Shuffles and renames guest users in the voice channel.")
    .addStringOption((option) =>
      option
        .setName("exclude")
        .setDescription("Users to exclude (use mentions, e.g., @user1@user-2)")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("notify")
        .setDescription("Notify success in chat (yes or no).")
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
        await shuffleAndRenameMembers(members, interaction, extractSuffix);

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

      await interaction.editReply(
        messages.createEphemeralMessage(resultMessage)
      );

      const notifyOption = interaction.options.getString("notify") === "yes";
      if (notifyOption && Object.keys(failedUsers).length === 0) {
        await interaction.channel.send(
          messages.createMessage(messages.SUCCESSFUL_RENAME)
        );
      }
    } catch (error) {
      await handleErrors(interaction, "shuffle-rename-guests", error);
    }
  },
};
