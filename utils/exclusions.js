async function getExcludeIds(interaction, excludeOption, messages) {
  const excludeIds = [];

  if (excludeOption) {
    const excludeMentions = excludeOption.match(/<@!?(\d+)>/g);
    if (excludeMentions) {
      for (const mention of excludeMentions) {
        const matches = mention.match(/^<@!?(\d+)>$/);
        if (matches && matches[1]) {
          excludeIds.push(matches[1]);
        } else {
          await interaction.editReply(
            messages.createEphemeralMessage(messages.INVALID_MENTION(mention))
          );
          return { error: true };
        }
      }
    } else {
      await interaction.editReply(
        messages.createEphemeralMessage(
          messages.INVALID_MENTIONS(excludeOption)
        )
      );
      return { error: true };
    }
  }

  return { excludeIds };
}

module.exports = { getExcludeIds };
