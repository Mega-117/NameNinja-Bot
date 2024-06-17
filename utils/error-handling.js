async function handleErrors(interaction, commandName, error) {
  console.error(
    `An error occurred while executing the "${commandName}" command:`,
    error
  );
  await interaction.editReply({
    content: `An error occurred while executing the "${commandName}" command. :sob:`,
    ephemeral: true,
  });
}

module.exports = { handleErrors };
