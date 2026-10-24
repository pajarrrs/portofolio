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

  // --- POST: Public endpoint for visitors submitting contact form ---
  if (req.method === 'POST') {
    const body = parseBody(req);

    // Honeypot: bots will fill hidden 'company' field. Silently return success.
    if (body.company) {
      return res.status(200).json({ ok: true });
    }

    const clamp = (v, n) => String(v || '').trim().slice(0, n);
    const name = clamp(body.name, 120);
    const email = clamp(body.email, 200);
    const message = clamp(body.message, 5000);

    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: 'Invalid input data' });
    }

    try {
      const result = await db.execute({
        sql: `INSERT INTO messages (name, email, message, is_read, created_at)
              VALUES (?, ?, ?, 0, CURRENT_TIMESTAMP)`,
        args: [name, email, message]
      });

      return res.status(200).json({
        ok: true,
        message: 'Message delivered successfully',
        id: Number(result.lastInsertRowid)
      });
    } catch (err) {
      console.error('Failed to save message:', err);
      return res.status(500).json({ ok: false, error: 'Failed to deliver message' });
    }
  }

  // --- All other methods require Admin Authentication ---
  if (!verifyToken(req)) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  // --- GET: Fetch all messages for the Admin panel ---
  if (req.method === 'GET') {
    try {
      const result = await db.execute('SELECT * FROM messages ORDER BY id DESC');
      return res.status(200).json({
        ok: true,
        messages: result.rows
      });
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      return res.status(500).json({ ok: false, error: 'Failed to fetch messages' });
    }
  }

  const body = parseBody(req);

  // --- PUT: Mark message as read/unread ---
  if (req.method === 'PUT') {
    const { id, is_read } = body;
    if (!id) return res.status(400).json({ ok: false, error: 'Message ID is required' });

    try {
      await db.execute({
        sql: 'UPDATE messages SET is_read = ? WHERE id = ?',
        args: [is_read ? 1 : 0, id]
      });
      return res.status(200).json({ ok: true, message: 'Message status updated' });
    } catch (err) {
      return res.status(500).json({ ok: false, error: 'Failed to update message' });
    }
  }

  // --- DELETE: Delete message from inbox ---
  if (req.method === 'DELETE') {
    const id = body.id || (req.query && req.query.id);
    if (!id) return res.status(400).json({ ok: false, error: 'Message ID is required' });

    try {
      await db.execute({
        sql: 'DELETE FROM messages WHERE id = ?',
        args: [id]
      });
      return res.status(200).json({ ok: true, message: 'Message deleted' });
    } catch (err) {
      return res.status(500).json({ ok: false, error: 'Failed to delete message' });
    }
  }

  res.setHeader('Allow', 'GET, POST, PUT, DELETE');
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
};
