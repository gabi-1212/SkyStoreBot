import { EmbedBuilder } from 'discord.js';
import { getConfig } from './config.js';

export async function makeEmbed(guildId) {
  const { embedColor } = await getConfig(guildId);
  return new EmbedBuilder()  // Ensuring we're returning an EmbedBuilder instance
    .setColor(embedColor)
    .setTimestamp();
}