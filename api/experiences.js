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
    return res.status(500).json({ ok: false, error: 'Database connection failed' });
  }

  if (req.method === 'GET') {
    try {
      const result = await db.execute('SELECT * FROM experiences ORDER BY order_index ASC, id ASC');
      return res.status(200).json({ ok: true, experiences: result.rows });
    } catch (err) {
      return res.status(500).json({ ok: false, error: 'Failed to fetch experiences' });
    }
  }

  if (!verifyToken(req)) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  const body = parseBody(req);

  // POST: Create Experience
  if (req.method === 'POST') {
    const { company, company_period, role_title, role_period, stack, bullets, order_index } = body;
    if (!company || !role_title) {
      return res.status(400).json({ ok: false, error: 'Company and role title are required' });
    }

    const bulletsStr = typeof bullets === 'string' ? bullets : JSON.stringify(bullets || []);

    try {
      const result = await db.execute({
        sql: `INSERT INTO experiences (company, company_period, role_title, role_period, stack, bullets, order_index)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          company.trim(),
          (company_period || '').trim(),
          role_title.trim(),
          (role_period || '').trim(),
          (stack || '').trim(),
          bulletsStr,
          Number(order_index) || 0
        ]
      });
      return res.status(201).json({ ok: true, id: Number(result.lastInsertRowid) });
    } catch (err) {
      return res.status(500).json({ ok: false, error: 'Failed to create experience' });
    }
  }

  // PUT: Update Experience
  if (req.method === 'PUT') {
    const { id, company, company_period, role_title, role_period, stack, bullets, order_index } = body;
    if (!id) return res.status(400).json({ ok: false, error: 'Experience ID is required' });

    const bulletsStr = typeof bullets === 'string' ? bullets : JSON.stringify(bullets || []);

    try {
      await db.execute({
        sql: `UPDATE experiences
              SET company = ?, company_period = ?, role_title = ?, role_period = ?, stack = ?, bullets = ?, order_index = ?
              WHERE id = ?`,
        args: [
          (company || '').trim(),
          (company_period || '').trim(),
          (role_title || '').trim(),
          (role_period || '').trim(),
          (stack || '').trim(),
          bulletsStr,
          Number(order_index) || 0,
          id
        ]
      });
      return res.status(200).json({ ok: true, message: 'Experience updated' });
    } catch (err) {
      return res.status(500).json({ ok: false, error: 'Failed to update experience' });
    }
  }

  // DELETE: Delete Experience
  if (req.method === 'DELETE') {
    const id = body.id || (req.query && req.query.id);
    if (!id) return res.status(400).json({ ok: false, error: 'Experience ID is required' });

    try {
      await db.execute({ sql: 'DELETE FROM experiences WHERE id = ?', args: [id] });
      return res.status(200).json({ ok: true, message: 'Experience deleted' });
    } catch (err) {
      return res.status(500).json({ ok: false, error: 'Failed to delete experience' });
    }
  }

  res.setHeader('Allow', 'GET, POST, PUT, DELETE');
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
};

