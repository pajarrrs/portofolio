const { initDb } = require('./_db');
const { verifyToken } = require('./_auth');

function parseBody(req) {
  if (typeof req.body === 'object' && req.body !== null) return req.body;
  try {
    return JSON.parse(req.body || '{}');
  } catch (e) {
    return {};
  }
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  let db;
  try {
    db = await initDb();
  } catch (err) {
    console.error('Database connection failed:', err);
    return res.status(500).json({ ok: false, error: 'Database connection failed' });
  }

  // --- GET: Fetch all site content (Hero, About, Contact, Services, Experiences, Projects) ---
  if (req.method === 'GET') {
    try {
      const [contentRes, servicesRes, expRes, projRes] = await Promise.all([
        db.execute('SELECT key, data FROM site_content'),
        db.execute('SELECT * FROM services ORDER BY order_index ASC, id ASC'),
        db.execute('SELECT * FROM experiences ORDER BY order_index ASC, id ASC'),
        db.execute('SELECT * FROM projects ORDER BY order_index ASC, id ASC')
      ]);

      const sections = {};
      for (const row of contentRes.rows) {
        try {
          sections[row.key] = JSON.parse(row.data);
        } catch (e) {
          sections[row.key] = row.data;
        }
      }

      return res.status(200).json({
        ok: true,
        content: sections,
        services: servicesRes.rows,
        experiences: expRes.rows,
        projects: projRes.rows
      });
    } catch (err) {
      console.error('Error fetching content:', err);
      return res.status(500).json({ ok: false, error: 'Failed to fetch content' });
    }
  }

  // --- PUT: Update a specific section in site_content ---
  if (req.method === 'PUT') {
    if (!verifyToken(req)) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    const body = parseBody(req);
    const { key, data } = body;

    if (!key || data === undefined) {
      return res.status(400).json({ ok: false, error: 'Missing section key or data' });
    }

    try {
      const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
      await db.execute({
        sql: `INSERT INTO site_content (key, data, updated_at)
              VALUES (?, ?, CURRENT_TIMESTAMP)
              ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP`,
        args: [key, dataStr]
      });

      return res.status(200).json({ ok: true, message: `Section '${key}' updated successfully` });
    } catch (err) {
      console.error('Error updating content:', err);
      return res.status(500).json({ ok: false, error: 'Failed to update section' });
    }
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
};

