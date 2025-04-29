export const name = 'interactionCreate';
export async function execute(client, interaction) {
  if (!interaction.isChatInputCommand()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;
  try {
    await cmd.execute(interaction);
  } catch (err) {
    console.error(err);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: '❌ There was an error.', ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ There was an error.', ephemeral: true });
    }
  }
}
