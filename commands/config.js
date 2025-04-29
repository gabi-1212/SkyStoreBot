import { SlashCommandBuilder } from 'discord.js';
import { getConfig, setConfig } from '../utils/config.js';
import { makeEmbed } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('config')
  .setDescription('Configure this bot for your server')
  .addSubcommand(sub =>
    sub.setName('show')
       .setDescription('Show current settings'))
  .addSubcommand(sub =>
    sub.setName('toggle-logging')
       .setDescription('Enable/disable upload logging'))
  .addSubcommand(sub =>
    sub.setName('set-embed-color')
       .setDescription('Set embed color (hex)')
       .addStringOption(opt =>
         opt.setName('hex')
            .setDescription('#RRGGBB format')
            .setRequired(true)
       )
  );

export async function execute(interaction) {
  const { guildId, options } = interaction;
  const sub = options.getSubcommand();
  let cfg = await getConfig(guildId);

  if (sub === 'show') {
    const embed = await makeEmbed(guildId)
    embed
      .setTitle('Current Configuration')
      .addFields(
        { name: 'Logging',     value: cfg.logging ? 'Enabled' : 'Disabled', inline: true },
        { name: 'Embed Color', value: cfg.embedColor,                         inline: true }
      );
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (sub === 'toggle-logging') {
    cfg = await setConfig(guildId, { logging: !cfg.logging });
    const embed = await makeEmbed(guildId)
    embed
      .setTitle('⚙️ Logging Toggled')
      .setDescription(`Upload logging is now **${cfg.logging ? 'Enabled' : 'Disabled'}**`);
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (sub === 'set-embed-color') {
    const hex = options.getString('hex');
    if (!/^#?[0-9A-F]{6}$/i.test(hex)) {
      return interaction.reply({ content: 'Invalid hex format. Use `#RRGGBB`.', ephemeral: true });
    }
    const color = hex.startsWith('#') ? hex : `#${hex}`;
    cfg = await setConfig(guildId, { embedColor: color });
    const embed = await makeEmbed(guildId)
    embed
      .setTitle('🎨 Embed Color Updated')
      .setDescription(`New color: **${cfg.embedColor}**`);
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
}