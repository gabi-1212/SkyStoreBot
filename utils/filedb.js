import fs from 'fs-extra';
const DB_PATH = './data/filedb.json';

async function ensureDb() {
  await fs.ensureFile(DB_PATH);
  try {
    await fs.readJson(DB_PATH);
  } catch {
    await fs.writeJson(DB_PATH, {});
  }
}

export async function addFile(userId, identifier, originalName) {
  await ensureDb();
  const db = await fs.readJson(DB_PATH);
  if (!db[userId]) db[userId] = [];
  db[userId].push({ identifier, originalName });
  await fs.writeJson(DB_PATH, db, { spaces: 2 });
}

export async function getFiles(userId) {
  await ensureDb();
  const db = await fs.readJson(DB_PATH);
  return db[userId] || [];
}

export async function findFile(identifier) {
  await ensureDb();
  const db = await fs.readJson(DB_PATH);
  for (const [userId, files] of Object.entries(db)) {
    for (const f of files) {
      if (f.identifier === identifier) {
        return { userId, originalName: f.originalName };
      }
    }
  }
  return null;
}

export async function deleteFile(userId, identifier) {
  await ensureDb();
  const db = await fs.readJson(DB_PATH);
  if (!db[userId]) return false;
  const idx = db[userId].findIndex(f => f.identifier === identifier);
  if (idx === -1) return false;
  db[userId].splice(idx, 1);
  await fs.writeJson(DB_PATH, db, { spaces: 2 });
  return true;
}
