function appendLogMessages(
  resultMessage,
  userDisconnectedCount,
  logMessages,
  messages
) {
  if (userDisconnectedCount > 0) {
    resultMessage += `\n\n${messages.USERS_DISCONNECTED(
      userDisconnectedCount
    )}`;
  }

  if (logMessages.length > 0) {
    resultMessage += `\n\n${messages.LOG_MESSAGES(logMessages)}`;
  }

  return resultMessage;
}

module.exports = { appendLogMessages };
