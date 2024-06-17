const { updateCache } = require("./cache");

async function updateCacheAndGetMembers(
  voiceChannel,
  commandUserId,
  excludeIds
) {
  await updateCache(voiceChannel);
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const members = Array.from(voiceChannel.members.values()).filter(
    (member) => member.id !== commandUserId && !excludeIds.includes(member.id)
  );

  return { members };
}

module.exports = { updateCacheAndGetMembers };
