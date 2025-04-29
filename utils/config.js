import fs from 'fs-extra';
const CFG_DIR = './configs';

async function getConfig(guildId) {
  await fs.ensureDir(CFG_DIR);
  const path = `${CFG_DIR}/${guildId}.json`;
  if (!await fs.pathExists(path)) {
    const def = { logging: true, embedColor: '#0099FF' };
    await fs.writeJson(path, def, { spaces: 2 });
    return def;
  }
  return fs.readJson(path);
}

async function setConfig(guildId, newCfg) {
  await fs.ensureDir(CFG_DIR);
  const path = `${CFG_DIR}/${guildId}.json`;
  const cfg = await getConfig(guildId);
  const merged = { ...cfg, ...newCfg };
  await fs.writeJson(path, merged, { spaces: 2 });
  return merged;
}

export { getConfig, setConfig };
