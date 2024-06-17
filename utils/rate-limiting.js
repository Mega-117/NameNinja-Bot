const RATE_LIMIT = 1; // Allow one command at a time
let currentCommand = null;

async function executeSingleCommand(interaction, commandFunction) {
  if (currentCommand) {
    await interaction.reply({
      content:
        "A command is already being executed. Please wait for it to finish.",
      ephemeral: true,
    });
    return;
  }

  currentCommand = commandFunction;
  try {
    await commandFunction();
  } finally {
    currentCommand = null;
  }
}

async function rateLimit(interaction, commandFunction) {
  await commandFunction();
}

module.exports = { executeSingleCommand, rateLimit };
