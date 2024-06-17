function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractSuffix(nickname) {
  const regex = /([\(\[\{\<][^\)\]\}\>]*[\)\]\}\>])/;
  const match = nickname.match(regex);
  return match ? match[0] : "";
}

async function renameMembers(members, interaction, extractSuffix) {
  const BATCH_SIZE = 10;
  const DELAY_BETWEEN_BATCHES = 1000; // 1 secondo
  let count = 1;
  const failedUsers = {};
  const logMessages = [];
  let userDisconnectedCount = 0;

  for (let i = 0; i < members.length; i += BATCH_SIZE) {
    const batch = members.slice(i, i + BATCH_SIZE);

    for (const member of batch) {
      if (!interaction.guild.members.cache.has(member.id)) {
        userDisconnectedCount++;
        continue;
      }

      const suffix = extractSuffix(member.displayName);
      const newNickname = `${count} ${suffix}`.trim();

      try {
        await member.setNickname(newNickname);
        count++;
      } catch (error) {
        failedUsers[member.user.tag] = error.message;
        logMessages.push(
          `Failed to rename ${member.user.tag}: ${error.message}`
        );
        if (error.status === 429) {
          const retryAfter = error.headers
            ? parseInt(error.headers["retry-after"], 10) * 1000
            : DELAY_BETWEEN_BATCHES;
          await delay(retryAfter);
        }
      }
    }
    await delay(DELAY_BETWEEN_BATCHES);
  }

  return {
    renamedCount: count - 1,
    failedUsers,
    logMessages,
    userDisconnectedCount,
  };
}

async function shuffleAndRenameMembers(members, interaction, extractSuffix) {
  const BATCH_SIZE = 10;
  const DELAY_BETWEEN_BATCHES = 1000; // 1 secondo
  let count = 1;
  const failedUsers = {};
  const logMessages = [];
  let userDisconnectedCount = 0;

  // Shuffle members array
  for (let i = members.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [members[i], members[j]] = [members[j], members[i]];
  }

  for (let i = 0; i < members.length; i += BATCH_SIZE) {
    const batch = members.slice(i, i + BATCH_SIZE);

    for (const member of batch) {
      if (!interaction.guild.members.cache.has(member.id)) {
        userDisconnectedCount++;
        continue;
      }

      const suffix = extractSuffix(member.displayName);
      const newNickname = `${count} ${suffix}`.trim();

      try {
        await member.setNickname(newNickname);
        count++;
      } catch (error) {
        failedUsers[member.user.tag] = error.message;
        logMessages.push(
          `Failed to rename ${member.user.tag}: ${error.message}`
        );
        if (error.status === 429) {
          const retryAfter = error.headers
            ? parseInt(error.headers["retry-after"], 10) * 1000
            : DELAY_BETWEEN_BATCHES;
          await delay(retryAfter);
        }
      }
    }
    await delay(DELAY_BETWEEN_BATCHES);
  }

  return {
    renamedCount: count - 1,
    failedUsers,
    logMessages,
    userDisconnectedCount,
  };
}

async function resetNicknames(members, interaction) {
  const BATCH_SIZE = 10;
  const DELAY_BETWEEN_BATCHES = 1000; // 1 secondo
  const failedUsers = {};
  const logMessages = [];
  let userDisconnectedCount = 0;

  for (let i = 0; i < members.length; i += BATCH_SIZE) {
    const batch = members.slice(i, i + BATCH_SIZE);

    for (const member of batch) {
      if (!interaction.guild.members.cache.has(member.id)) {
        userDisconnectedCount++;
        continue;
      }

      try {
        await member.setNickname("");
      } catch (error) {
        failedUsers[member.user.tag] = error.message;
        logMessages.push(
          `Failed to reset nickname for ${member.user.tag}: ${error.message}`
        );
        if (error.status === 429) {
          const retryAfter = error.headers
            ? parseInt(error.headers["retry-after"], 10) * 1000
            : DELAY_BETWEEN_BATCHES;
          await delay(retryAfter);
        }
      }
    }
    await delay(DELAY_BETWEEN_BATCHES);
  }

  return {
    resetCount: members.length - userDisconnectedCount,
    failedUsers,
    logMessages,
    userDisconnectedCount,
  };
}

module.exports = {
  extractSuffix,
  renameMembers,
  shuffleAndRenameMembers,
  resetNicknames,
};
