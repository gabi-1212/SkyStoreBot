import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs-extra';
import path from 'path';
import { makeEmbed } from '../utils/embed.js';
import { deleteFile, findFile } from '../utils/filedb.js';

export const data = new SlashCommandBuilder()
  .setName('delete')
  .setDescription('Delete a file you previously uploaded')
  .addStringOption(opt =>
    opt.setName('id')
       .setDescription('File identifier')
       .setRequired(true)
  );

export async function execute(interaction) {
  const id = interaction.options.getString('id');
  const found = await findFile(id);
  if (!found || found.userId !== interaction.user.id) {
    const embed = await makeEmbed(interaction.guildId)
      .setTitle('Delete Failed')
      .setDescription('No file with that ID found or you do not own it.');
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  const ext = path.extname(found.originalName);
  const filepath = `./uploads/${id}${ext}`;
  await fs.remove(filepath);
  await deleteFile(interaction.user.id, id);

  const embed = await makeEmbed(interaction.guildId)
  embed
    .setTitle('File Deleted')
    .setDescription(`Identifier: \`${id}\``);
  return interaction.reply({ embeds: [embed], ephemeral: true });
}
