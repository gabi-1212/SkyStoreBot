import { SlashCommandBuilder } from 'discord.js';
import { makeEmbed } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('info')
  .setDescription('Shows info about this bot');

export async function execute(interaction) {
  const embed = await makeEmbed(interaction.guildId);
  embed
    .setTitle('SkyStore 🤖')
    .setDescription('• Upload & retrieve your files anytime\n• Per-server config\n• Cool blue embeds')
    .addFields(
      { name: 'Slash Commands', value: '`/upload`, `/retrieve`, `/list`, `/delete`, `/info`, `/config`' },
    );
  await interaction.reply({ embeds: [embed] });
}
