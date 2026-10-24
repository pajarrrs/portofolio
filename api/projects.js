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
    console.error('Database initialization error:', err);
    return res.status(500).json({ ok: false, error: 'Database connection failed' });
  }

  // --- GET: Fetch all projects ---
  if (req.method === 'GET') {
    try {
      const result = await db.execute('SELECT * FROM projects ORDER BY order_index ASC, id ASC');
      return res.status(200).json({
        ok: true,
        projects: result.rows
      });
    } catch (err) {
      console.error('Error fetching projects:', err);
      return res.status(500).json({ ok: false, error: 'Failed to fetch projects' });
    }
  }

  // All other methods (POST, PUT, DELETE) require admin authentication
  if (!verifyToken(req)) {
    return res.status(401).json({ ok: false, error: 'Unauthorized: Admin access required' });
  }

  const body = parseBody(req);

  // --- POST: Create a new project ---
  if (req.method === 'POST') {
    const { title, category, chip, description, tags, image, order_index } = body;

    if (!title || !category) {
      return res.status(400).json({ ok: false, error: 'Title and category are required' });
    }

    try {
      const result = await db.execute({
        sql: `INSERT INTO projects (title, category, chip, description, tags, image, order_index)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          title.trim(),
          category.trim(),
          (chip || '').trim(),
          (description || '').trim(),
          (tags || '').trim(),
          (image || 'images/jasakita.webp').trim(),
          Number(order_index) || 0
        ]
      });

      return res.status(201).json({
        ok: true,
        message: 'Project created successfully',
        id: Number(result.lastInsertRowid)
      });
    } catch (err) {
      console.error('Error creating project:', err);
      return res.status(500).json({ ok: false, error: 'Failed to create project' });
    }
  }

  // --- PUT: Update an existing project or reorder ---
  if (req.method === 'PUT') {
    if (body.action === 'reorder' && Array.isArray(body.orders)) {
      try {
        for (let i = 0; i < body.orders.length; i++) {
          await db.execute({
            sql: 'UPDATE projects SET order_index = ? WHERE id = ?',
            args: [i, body.orders[i]]
          });
        }
        return res.status(200).json({ ok: true, message: 'Projects reordered successfully' });
      } catch (err) {
        console.error('Error reordering projects:', err);
        return res.status(500).json({ ok: false, error: 'Failed to reorder projects' });
      }
    }

    const { id, title, category, chip, description, tags, image, order_index } = body;

    if (!id) {
      return res.status(400).json({ ok: false, error: 'Project ID is required' });
    }

    try {
      await db.execute({
        sql: `UPDATE projects
              SET title = ?, category = ?, chip = ?, description = ?, tags = ?, image = ?, order_index = ?
              WHERE id = ?`,
        args: [
          (title || '').trim(),
          (category || '').trim(),
          (chip || '').trim(),
          (description || '').trim(),
          (tags || '').trim(),
          (image || '').trim(),
          Number(order_index) || 0,
          id
        ]
      });

      return res.status(200).json({ ok: true, message: 'Project updated successfully' });
    } catch (err) {
      console.error('Error updating project:', err);
      return res.status(500).json({ ok: false, error: 'Failed to update project' });
    }
  }

  // --- DELETE: Delete a project ---
  if (req.method === 'DELETE') {
    const id = body.id || (req.query && req.query.id);

    if (!id) {
      return res.status(400).json({ ok: false, error: 'Project ID is required' });
    }

    try {
      await db.execute({
        sql: 'DELETE FROM projects WHERE id = ?',
        args: [id]
      });

      return res.status(200).json({ ok: true, message: 'Project deleted successfully' });
    } catch (err) {
      console.error('Error deleting project:', err);
      return res.status(500).json({ ok: false, error: 'Failed to delete project' });
    }
  }

  res.setHeader('Allow', 'GET, POST, PUT, DELETE');
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
};

