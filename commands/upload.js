import { SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import fs from 'fs-extra';
import { makeEmbed } from '../utils/embed.js';
import { getConfig } from '../utils/config.js';
import { addFile } from '../utils/filedb.js';

export const data = new SlashCommandBuilder()
  .setName('upload')
  .setDescription('Upload a file to be stored')
  .addAttachmentOption(opt =>
    opt.setName('file')
       .setDescription('The file to upload')
       .setRequired(true)
  );

export async function execute(interaction) {
  const { guildId, options, user, guild, client } = interaction;
  const attachment = options.getAttachment('file');

  // Check file size (limit to 100MB = 104857600 bytes)
  if (attachment.size > 104857600) {
    const embed = await makeEmbed(guildId);
    embed
      .setTitle('❌ File Too Large')
      .setDescription('The file you tried to upload exceeds the 100MB size limit.');
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  await fs.ensureDir('./uploads');

  const id = uuidv4();
  const ext = extname(attachment.name);
  const filename = `${id}${ext}`;
  const filepath = `./uploads/${filename}`;

  const res = await fetch(attachment.url);
  const buffer = await res.buffer();
  await fs.writeFile(filepath, buffer);
  await addFile(user.id, id, attachment.name);

  const embed = await makeEmbed(guildId);
  embed
    .setTitle('File Uploaded')
    .addFields(
      { name: 'Original Name', value: attachment.name, inline: true },
      { name: 'Identifier',     value: id, inline: true }
    );
  await interaction.reply({ embeds: [embed] });

  const cfg = await getConfig(guildId);
  if (cfg.logging) {
    const logGuild = await client.guilds.fetch('1366086198287929414');
    const logCh    = await logGuild.channels.fetch('1366782736609841172');
    const logEmbed = await makeEmbed(guildId);
    logEmbed
      .setTitle('🗄️ New Upload')
      .addFields(
        { name: 'Server',     value: guild.name, inline: true },
        { name: 'User',       value: `${user.tag} (${user.id})`, inline: true },
        { name: 'Filename',   value: attachment.name, inline: true },
        { name: 'Identifier', value: id, inline: true }
      );
    await logCh.send({ embeds: [logEmbed] });
  }
}
