require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const keepAlive = require("./keep_alive");
const { rateLimit, executeSingleCommand } = require("./utils/rate-limiting");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await executeSingleCommand(interaction, async () => {
      await rateLimit(interaction, async () => {
        await command.execute(interaction);
      });
    });
  } catch (error) {
    console.error(error);

    let errorMessage = "There was an error while executing this command!";

    if (error instanceof SyntaxError) {
      errorMessage = `Syntax error in the command: ${error.message}`;
    } else if (error.message.includes("INVALID_MENTION")) {
      errorMessage = `Invalid mention format. Please use the correct mention format.`;
    } else if (error.message.includes("INVALID_EXCLUDE")) {
      errorMessage = `Invalid exclude format. Please use the correct format for excluding users.`;
    } else {
      errorMessage = `An unexpected error occurred: incorrectly written attributes`;
    }

    await interaction.reply({
      content: errorMessage,
      ephemeral: true,
    });
  }
});

keepAlive();
client.login(process.env.DISCORD_TOKEN);
