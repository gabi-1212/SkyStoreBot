import { SlashCommandBuilder } from 'discord.js';
import { makeEmbed } from '../utils/embed.js';
import { getFiles } from '../utils/filedb.js';

export const data = new SlashCommandBuilder()
  .setName('list')
  .setDescription('List your uploaded files');

export async function execute(interaction) {
  // Fetch the files uploaded by the user
  const files = await getFiles(interaction.user.id);

  // If the user has no files, create an embed to inform them
  if (files.length === 0) {
    const embed = await makeEmbed(interaction.guildId)
    embed
      .setTitle('No Files')
      .setDescription('You have no uploaded files.');
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  // If files exist, create an embed to list the files
  const embed = await makeEmbed(interaction.guildId)
  embed
    .setTitle('Your Files')
    .setDescription(
      files.map(f => `• **${f.identifier}** — ${f.originalName}`).join('\n')
    )
    .setFooter({ text: `Total: ${files.length}` });

  return interaction.reply({ embeds: [embed], ephemeral: true });
}
