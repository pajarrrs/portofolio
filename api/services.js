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
      const result = await db.execute('SELECT * FROM services ORDER BY order_index ASC, id ASC');
      return res.status(200).json({ ok: true, services: result.rows });
    } catch (err) {
      return res.status(500).json({ ok: false, error: 'Failed to fetch services' });
    }
  }

  if (!verifyToken(req)) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  const body = parseBody(req);

  // POST: Create Service
  if (req.method === 'POST') {
    const { title, description, tags, image, order_index } = body;
    if (!title || !description) {
      return res.status(400).json({ ok: false, error: 'Title and description are required' });
    }

    try {
      const result = await db.execute({
        sql: `INSERT INTO services (title, description, tags, image, order_index)
              VALUES (?, ?, ?, ?, ?)`,
        args: [
          title.trim(),
          description.trim(),
          (tags || '').trim(),
          (image || 'images/siarvi.webp').trim(),
          Number(order_index) || 0
        ]
      });
      return res.status(201).json({ ok: true, id: Number(result.lastInsertRowid) });
    } catch (err) {
      return res.status(500).json({ ok: false, error: 'Failed to create service' });
    }
  }

  // PUT: Update Service
  if (req.method === 'PUT') {
    const { id, title, description, tags, image, order_index } = body;
    if (!id) return res.status(400).json({ ok: false, error: 'Service ID is required' });

    try {
      await db.execute({
        sql: `UPDATE services SET title = ?, description = ?, tags = ?, image = ?, order_index = ? WHERE id = ?`,
        args: [
          (title || '').trim(),
          (description || '').trim(),
          (tags || '').trim(),
          (image || '').trim(),
          Number(order_index) || 0,
          id
        ]
      });
      return res.status(200).json({ ok: true, message: 'Service updated' });
    } catch (err) {
      return res.status(500).json({ ok: false, error: 'Failed to update service' });
    }
  }

  // DELETE: Delete Service
  if (req.method === 'DELETE') {
    const id = body.id || (req.query && req.query.id);
    if (!id) return res.status(400).json({ ok: false, error: 'Service ID is required' });

    try {
      await db.execute({ sql: 'DELETE FROM services WHERE id = ?', args: [id] });
      return res.status(200).json({ ok: true, message: 'Service deleted' });
    } catch (err) {
      return res.status(500).json({ ok: false, error: 'Failed to delete service' });
    }
  }

  res.setHeader('Allow', 'GET, POST, PUT, DELETE');
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
};

