import 'dotenv/config';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel],
});

client.commands = new Collection();

// Load command files dynamically
async function loadCommands() {
  for (const file of readdirSync(path.resolve('./commands')).filter(f => f.endsWith('.js'))) {
    const { data, execute } = await import(`./commands/${file}`);
    client.commands.set(data.name, { data, execute });
  }
  console.log(`Loaded ${client.commands.size} commands.`);
}

// Handle interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;

  try {
    await cmd.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: '❌ There was an error while executing this command!', ephemeral: true });
  }
});

// Log in to Discord
async function startBot() {
  await loadCommands();
  await client.login(process.env.BOT_TOKEN);
}

startBot();
