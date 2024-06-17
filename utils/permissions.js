const { PermissionsBitField } = require("discord.js");

function hasManageNicknamesPermission(botMember, voiceChannel) {
  return botMember
    .permissionsIn(voiceChannel)
    .has(PermissionsBitField.Flags.ManageNicknames);
}

module.exports = { hasManageNicknamesPermission };
