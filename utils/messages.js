module.exports = {
  NO_VOICE_CHANNEL: "You must be in a voice channel to use this command. :sob:",
  NO_PERMISSIONS:
    "The bot does not have the necessary permissions to rename users :scream: \nModify the permissions in server roles or manage the hierarchy :face_with_monocle:.",
  START_RENAMING: ":sunglasses: Starting user renaming...  :rocket: ",
  START_RESETTING: ":sunglasses: Starting nickname reset...  :rocket: ",
  INVALID_MENTION: (mention) =>
    `The mention ${mention} is invalid. Use the correct mention format. :sob:`,
  INVALID_MENTIONS: (mentions) =>
    `The mentions ${mentions} are invalid. Use the correct mention format. :sob:`,
  NO_USERS_TO_RENAME:
    "There are no other users in your voice channel to rename. :melting_face:",
  NO_USERS_TO_RESET:
    "There are no other users in your voice channel to reset nicknames. :melting_face:",
  RENAMED_USERS: (count) => `Renamed ${count} users. :punch:`,
  RESET_NICKNAMES: (count) => `Nicknames of ${count} users have been reset.`,
  RENAME_FAILED: (failedUsers) => {
    const failedUserNames = Object.keys(failedUsers).slice(0, 3);
    return `Not all users have been renamed successfully. :rage: \nThe bot might not have permission to change the nicknames of certain users (e.g., users with the Administrator role). Please check the role hierarchy.\nFailed to rename user(s): ${failedUserNames.join(
      ", "
    )}${
      Object.keys(failedUsers).length > 3 ? ", ..." : ""
    } :face_with_monocle:`;
  },
  RESET_FAILED: (failedUsers) => {
    const failedUserNames = Object.keys(failedUsers).slice(0, 3);
    return `Not all nicknames have been reset successfully. :rage:: \nThe bot might not have permission to change the nicknames of certain users (e.g., users with the Administrator role). Please check the role hierarchy.\nFailed to reset nicknames for user(s): ${failedUserNames.join(
      ", "
    )}${
      Object.keys(failedUsers).length > 3 ? ", ..." : ""
    } :face_with_monocle:`;
  },
  USERS_DISCONNECTED: (count) =>
    `${count} user(s) disconnected from the voice channel during the renaming process.`,
  LOG_MESSAGES: (logMessages) => `Logs:\n${logMessages.join("\n")}`,
  SUCCESSFUL_RENAME: `Users renaming successful! :trophy: \nIf you do not see the changes, please refresh the page or app.`,
  ERROR_MESSAGE: "An error occurred while executing the command. :sob:",
  IMAGE_ERROR: "Non sono riuscito ad accedere all'immagine locale.",

  createEphemeralMessage: (content) => ({
    content,
    ephemeral: true,
  }),

  createMessage: (content) => ({
    content,
    ephemeral: false,
  }),
};
