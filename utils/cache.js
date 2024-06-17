async function updateCache(voiceChannel) {
  try {
    await Promise.all(voiceChannel.members.map((member) => member.fetch()));
  } catch (error) {
    throw new Error("Cache update failed");
  }
}

module.exports = { updateCache };
