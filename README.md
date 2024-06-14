### NameNinja-Bot Setup Instructions for Local Deployment

**Introduction:**
This Discord bot was developed to automate the management of users' nicknames in voice channels. It uses Discord's slash commands to perform specific actions such as renaming, shuffling, resetting nicknames, and updating the cache. This guide will help you set up and run the bot locally.

**Features:**

- Renames users in the voice channel following a numerical order.
- Retains the content within round brackets `()` in the users' nicknames.
- Can exclude specific users from renaming.
- Can reset users' nicknames.
- Updates the cache of voice channel members to ensure data is always up-to-date.

### Step-by-Step Setup Guide

#### Step 1: Prerequisites

Ensure you have the following installed on your local machine:

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Git (for cloning the repository), or alternatively, download the ZIP file from [Here](https://github.com/Mega-117/NameNinja-Bot/archive/refs/heads/main.zip)

#### Step 2: Create a Discord Application

1. **Create a New Application:**
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications).
     (you need a Discord Developer accoutnt)
   - Click on "New Application" and give it a name.
2. **Create a Bot:**

   - Navigate to the "Bot" tab on the left sidebar.
   - Click "Add Bot" and confirm.
   - Note down the **TOKEN** from the Bot section.

3. **Bot Permissions:**

   - Scroll down to the "Privileged Gateway Intents" section and enable "Presence Intent" and "Server Members Intent".
   - Under the "OAuth2" tab, go to "URL Generator".
   - Select the "bot" and "applications.commands" scopes.
   - In the "Bot Permissions" section, select the following permissions:
     - Manage Nicknames
     - Read Messages/View Channels
     - Send Messages
     - Manage Messages
     - Connect
     - Speak
   - After selecting the permissions, scroll down to generate the invite link for the bot.

4. **Generate OAuth2 URL:**
   - Copy the generated URL and open it in your browser.
   - Select a server to invite the bot to and authorize it.

#### Step 3: Clone the Repository

Open your terminal and clone the repository:

```bash
git clone https://github.com/your-username/NameNinja-Bot.git
cd NameNinja-Bot
```

Alternatively, you can download the ZIP file of the project from [Here](https://github.com/Mega-117/NameNinja-Bot/archive/refs/heads/main.zip).

#### Step 4: Configure Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_client_id
```

You can find the **TOKEN** and **CLIENT_ID** (Application ID) in the Discord Developer Portal under the bot application. The **TOKEN** is found in the "Bot" section, and the **CLIENT_ID** is listed at the top of the "General Information" section.

#### Step 5: Install Dependencies

Navigate to the project directory in your terminal and install the necessary dependencies:

```bash
npm install
```

#### Step 6: Register Slash Commands

Run the following command to register the slash commands:

```bash
node registra-comandi.js
```

#### Step 7: Start the Bot

Run the following command to start the bot:

```bash
node index.js
```

You should see a message in the terminal indicating that the bot is ready.

## Available Commands

This bot renames users in a voice channel sequentially or in a shuffled order. It maintains the content within any type of brackets in the nickname. Note: that the renaming commands only work if you are in a voice chat with other users. The user who initiates the command is not subject to renaming.

### /daje

- **Description:** Provides an enthusiastic response to encourage users.
- **Usage:**
  - Example: `/daje`

### /help

- **Description:** Provides information about the available commands.
- **Usage:**
  - Example: `/help`

### /shuffle-rename-guests

- **Description:** Shuffles and renames guest users in the voice channel.
- **Usage:**
  - Example: `/shuffle-rename-guests`
  - **Options:**
    - `exclude`: Concatenated mentions of users to exclude (e.g., `@user1@user2`).
    - `notify`: Indicates whether to notify all users in the channel that the renaming was successful (possible values: `yes`, `no`).

### /rename-guests

- **Description:** Renames guest users in the voice channel in a sequential order.
- **Usage:**
  - Example: `/rename-guests`
  - **Options:**
    - `exclude`: Concatenated mentions of users to exclude (e.g., `@user1@user2`).
    - `notify`: Indicates whether to notify all users in the channel that the renaming was successful (possible values: `yes`, `no`).

### /reset-nickname

- **Description:** Resets the nicknames of users in the voice channel to their original names.
- **Usage:**
  - Example: `/reset-nickname`
  - **Options:**
    - `exclude`: Concatenated mentions of users to exclude (e.g., `@user1@user2`).

### /update-cache

- **Description:** Updates the cache of members in the voice channel to ensure the latest data is used.
- **Usage:**
  - Example: `/update-cache`

## Handling the Content of Brackets

The bot retains the content of any type of brackets `()`, `[]`, `{}`, and `<>` in the nickname. For example, if a user has the nickname "User (123)", after renaming, the nickname might be "1 (123)".

## Troubleshooting

If you encounter any issues, ensure:

- The bot has the correct permissions in your Discord server.
- The environment variables in the `.env` file are correctly set.
- All dependencies are installed using `npm install`.

This setup should help you get the NameNinja-Bot running locally on your machine. If you need further assistance, refer to the Discord.js documentation or the Discord Developer Portal for more information.
