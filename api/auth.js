const { generateToken, verifyToken, verifyPassword } = require('./_auth');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    const isAuthed = verifyToken(req);
    if (!isAuthed) {
      return res.status(401).json({ ok: false, authenticated: false, error: 'Unauthorized' });
    }
    return res.status(200).json({ ok: true, authenticated: true });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const password = body.password;

    if (!verifyPassword(password)) {
      return res.status(401).json({ ok: false, error: 'Password salah. Silakan coba lagi.' });
    }

    const token = generateToken();
    return res.status(200).json({ ok: true, token });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
};

