import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs-extra';
import path from 'path';
import { makeEmbed } from '../utils/embed.js';
import { findFile } from '../utils/filedb.js';

export const data = new SlashCommandBuilder()
  .setName('retrieve')
  .setDescription('Retrieve a previously uploaded file by its identifier')
  .addStringOption(opt => 
    opt.setName('id')
       .setDescription('File identifier')
       .setRequired(true)
  );

export async function execute(interaction) {
  const { guildId } = interaction;
  const id = interaction.options.getString('id');
  const found = await findFile(id);
  if (!found) {
    const embed = await makeEmbed(guildId)
    embed
      .setTitle('File Not Found')
      .setDescription(`No file with ID \`${id}\` found.`);
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  const ext = path.extname(found.originalName);
  const filepath = `./uploads/${id}${ext}`;
  if (!await fs.pathExists(filepath)) {
    const embed = await makeEmbed(guildId)
    embed
      .setTitle('Error')
      .setDescription('File is missing on disk.');
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  await interaction.reply({ files: [ { attachment: filepath, name: found.originalName } ] });
}
