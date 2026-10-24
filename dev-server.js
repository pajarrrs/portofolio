require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml',
  '.txt': 'text/plain'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Helper methods to match Vercel Serverless Function behavior
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };

  // --- API Routes Handler ---
  if (pathname.startsWith('/api/')) {
    const routeName = pathname.replace(/^\/api\//, '').split('/')[0];
    const apiFilePath = path.join(ROOT, 'api', `${routeName}.js`);

    if (fs.existsSync(apiFilePath) && !routeName.startsWith('_')) {
      // Gather request body if POST / PUT / DELETE
      let bodyData = '';
      req.on('data', chunk => { bodyData += chunk; });
      req.on('end', async () => {
        req.query = parsedUrl.query;
        if (bodyData) {
          try {
            req.body = JSON.parse(bodyData);
          } catch (e) {
            req.body = bodyData;
          }
        } else {
          req.body = {};
        }

        try {
          // Clear require cache in development for instant hot reload
          delete require.cache[require.resolve(apiFilePath)];
          const handler = require(apiFilePath);
          await handler(req, res);
        } catch (err) {
          console.error(`API Error on ${pathname}:`, err);
          if (!res.writableEnded) {
            res.status(500).json({ ok: false, error: 'Internal Server Error', message: err.message });
          }
        }
      });
      return;
    } else {
      return res.status(404).json({ ok: false, error: 'API endpoint not found' });
    }
  }

  // --- Static Files Handler ---
  // Support clean URLs and directory index
  if (pathname === '/admin' || pathname === '/admin/') {
    pathname = '/admin/index.html';
  } else if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = path.join(ROOT, pathname);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end('<h1>404 Not Found</h1>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Portfolio CMS Dev Server running at:`);
  console.log(`👉 Web Portfolio : http://localhost:${PORT}`);
  console.log(`👉 CMS Admin     : http://localhost:${PORT}/admin`);
  console.log(`======================================================\n`);
});

