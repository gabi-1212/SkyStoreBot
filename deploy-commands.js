import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';

async function deployCommands() {
  const commands = [];
  
  for (const file of readdirSync(path.resolve('./commands')).filter(f => f.endsWith('.js'))) {
    const { data } = await import(`./commands/${file}`);
    commands.push(data.toJSON());
  }

  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (err) {
    console.error(err);
  }
}

deployCommands();
