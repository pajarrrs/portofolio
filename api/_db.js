const { createClient } = require('@libsql/client');
const seed = require('./_seedData');

let clientInstance = null;
let initPromise = null;

function getDbClient() {
  if (clientInstance) return clientInstance;

  const url = (process.env.TURSO_DATABASE_URL || '').trim() || 'file:local.db';
  const authToken = (process.env.TURSO_AUTH_TOKEN || '').trim() || undefined;

  clientInstance = createClient({
    url,
    authToken,
  });

  return clientInstance;
}

async function initDb() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const db = getDbClient();

    // 1. Projects Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        chip TEXT DEFAULT '',
        description TEXT DEFAULT '',
        tags TEXT DEFAULT '',
        image TEXT DEFAULT '',
        order_index INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Services Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        tags TEXT DEFAULT '',
        image TEXT DEFAULT '',
        order_index INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Experiences Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS experiences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company TEXT NOT NULL,
        company_period TEXT NOT NULL,
        role_title TEXT NOT NULL,
        role_period TEXT NOT NULL,
        stack TEXT DEFAULT '',
        bullets TEXT DEFAULT '[]',
        order_index INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Site Content Table (Key-Value JSON store for Hero, About, Contact, Meta)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS site_content (
        key TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Contact Messages / Inbox Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed Projects if empty
    const pCount = await db.execute('SELECT COUNT(*) as total FROM projects');
    if (Number(pCount.rows[0].total || 0) === 0) {
      for (const p of seed.projects) {
        await db.execute({
          sql: `INSERT INTO projects (title, category, chip, description, tags, image, order_index)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [p.title, p.category, p.chip, p.description, p.tags, p.image, p.order_index]
        });
      }
    }

    // Seed Services if empty
    const sCount = await db.execute('SELECT COUNT(*) as total FROM services');
    if (Number(sCount.rows[0].total || 0) === 0) {
      for (const s of seed.services) {
        await db.execute({
          sql: `INSERT INTO services (title, description, tags, image, order_index)
                VALUES (?, ?, ?, ?, ?)`,
          args: [s.title, s.description, s.tags, s.image, s.order_index]
        });
      }
    }

    // Seed Experiences if empty
    const eCount = await db.execute('SELECT COUNT(*) as total FROM experiences');
    if (Number(eCount.rows[0].total || 0) === 0) {
      for (const e of seed.experiences) {
        await db.execute({
          sql: `INSERT INTO experiences (company, company_period, role_title, role_period, stack, bullets, order_index)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [e.company, e.company_period, e.role_title, e.role_period, e.stack, e.bullets, e.order_index]
        });
      }
    }

    // Seed Site Content (Hero, About, Contact, Experience Meta) if empty
    const cCount = await db.execute('SELECT COUNT(*) as total FROM site_content');
    if (Number(cCount.rows[0].total || 0) === 0) {
      const initialSections = [
        ['hero', JSON.stringify(seed.hero)],
        ['about', JSON.stringify(seed.about)],
        ['contact', JSON.stringify(seed.contact)],
        ['experience_meta', JSON.stringify(seed.experience_meta)]
      ];
      for (const [key, data] of initialSections) {
        await db.execute({
          sql: `INSERT INTO site_content (key, data) VALUES (?, ?)`,
          args: [key, data]
        });
      }
    }

    return db;
  })();

  return initPromise;
}

module.exports = {
  getDbClient,
  initDb
};
