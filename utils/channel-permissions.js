const { PermissionsBitField } = require("discord.js");

async function checkVoiceChannelAndPermissions(interaction, messages) {
  const voiceChannel = interaction.member.voice.channel;
  if (!voiceChannel) {
    await interaction.reply(
      messages.createEphemeralMessage(messages.NO_VOICE_CHANNEL)
    );
    return { error: true };
  }

  const botMember = interaction.guild.members.cache.get(
    interaction.client.user.id
  );
  if (
    !botMember
      .permissionsIn(voiceChannel)
      .has(PermissionsBitField.Flags.ManageNicknames)
  ) {
    await interaction.reply(
      messages.createEphemeralMessage(messages.NO_PERMISSIONS)
    );
    return { error: true };
  }

  return { voiceChannel };
}

module.exports = { checkVoiceChannelAndPermissions };
