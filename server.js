const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const FRONTEND_DIR = path.join(__dirname, 'frontend');

// Load environment variables from .env
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [k, ...v] = trimmed.split('=');
        const key = k.trim();
        const val = v.join('=').trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
}
loadEnv();

const ADMIN_USER = process.env.CITYMATE_ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.CITYMATE_ADMIN_PASSWORD || 'change-this-password';
const TRAVELER_USER = process.env.CITYMATE_USER_USERNAME || 'traveler';
const TRAVELER_PASS = process.env.CITYMATE_USER_PASSWORD || 'traveler123';
const REALM = process.env.CITYMATE_AUTH_REALM || 'CityMate';

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function parseBasicAuth(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return null;
  }
  try {
    const b64 = authHeader.split(' ')[1];
    const decoded = Buffer.from(b64, 'base64').toString('utf8');
    const [user, pass] = decoded.split(':');
    return { user, pass };
  } catch (e) {
    return null;
  }
}

function verifyAuth(req) {
  const creds = parseBasicAuth(req);
  if (!creds || !creds.user || !creds.pass) {
    return { authenticated: false, user: null };
  }

  const rawUser = creds.user.trim();
  const rawPass = creds.pass;
  const userLower = rawUser.toLowerCase();

  // 1. Explicit Admin or any username/email containing 'admin'
  if ((rawUser === ADMIN_USER && rawPass === ADMIN_PASS) || 
      userLower === 'admin' || 
      userLower.includes('admin')) {
    return {
      authenticated: true,
      user: {
        id: 1,
        username: rawUser,
        role: 'admin',
        full_name: rawUser.toLowerCase() === 'admin' ? 'Administrator' : (rawUser.charAt(0).toUpperCase() + rawUser.slice(1)),
        email: rawUser.includes('@') ? rawUser : `${rawUser}@citymate.com`
      }
    };
  }

  // 2. Explicit Traveler test account
  if (rawUser === TRAVELER_USER && rawPass === TRAVELER_PASS) {
    return {
      authenticated: true,
      user: { id: 2, username: rawUser, role: 'user', full_name: 'Traveler', email: 'traveler@citymate.com' }
    };
  }

  // 3. ANY Email ID and Password is permitted to access the project!
  if (rawUser.length > 0 && rawPass.length > 0) {
    const isEmail = rawUser.includes('@');
    const cleanName = isEmail ? rawUser.split('@')[0] : rawUser;
    const displayName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    const email = isEmail ? rawUser : `${rawUser}@citymate.com`;

    // Generate stable numerical ID from string
    let idNum = 0;
    for (let i = 0; i < rawUser.length; i++) {
      idNum = ((idNum << 5) - idNum) + rawUser.charCodeAt(i);
      idNum |= 0;
    }

    return {
      authenticated: true,
      user: {
        id: Math.abs(idNum) || 100,
        username: cleanName,
        role: 'user',
        full_name: displayName,
        email: email
      }
    };
  }

  return { authenticated: false, user: null };
}

function send401(res, message = 'Valid CityMate credentials are required.', isHtml = false) {
  res.writeHead(401, {
    'WWW-Authenticate': `Basic realm="${REALM}"`,
    'Content-Type': isHtml ? 'text/html; charset=UTF-8' : 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN'
  });

  if (isHtml) {
    const loginPath = path.join(FRONTEND_DIR, 'login.html');
    if (fs.existsSync(loginPath)) {
      res.end(fs.readFileSync(loginPath));
    } else {
      res.end(JSON.stringify({ error: 'Unauthorized', message }));
    }
  } else {
    res.end(JSON.stringify({
      error: 'Unauthorized',
      message: message
    }, null, 2));
  }
}

function send403(res, message = 'You do not have permission to access this resource.') {
  res.writeHead(403, {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN'
  });
  res.end(JSON.stringify({
    error: 'Forbidden',
    message: message
  }, null, 2));
}

const server = http.createServer((req, res) => {
  // Security & CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Expose-Headers', 'WWW-Authenticate, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlPath = req.url.split('?')[0];
  const accept = req.headers['accept'] || '';
  const isHtmlRequest = accept.includes('text/html');

  // 1. API Health Endpoint (Public)
  if (urlPath === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      application: 'CITYMATE – Smart Tourist Companion',
      version: '1.0.0',
      authentication: 'HTTP Basic Auth (RFC 7235)'
    }));
    return;
  }

  // 2. Auth Status Endpoint (Public / Optional Auth)
  if (urlPath === '/auth/status' || urlPath === '/api/auth/status') {
    const auth = verifyAuth(req);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(auth));
    return;
  }

  // 3. Dedicated Login Page (/login)
  if (urlPath === '/login') {
    const auth = verifyAuth(req);
    if (auth.authenticated) {
      res.writeHead(302, { 'Location': '/?auth=success' });
      res.end();
      return;
    }
    const loginPath = path.join(FRONTEND_DIR, 'login.html');
    if (fs.existsSync(loginPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(fs.readFileSync(loginPath));
      return;
    }
  }

  // 3b. Native Auth Sign In Endpoint (/auth/signin)
  if (urlPath === '/auth/signin') {
    const auth = verifyAuth(req);
    if (auth.authenticated) {
      res.writeHead(302, { 'Location': '/?auth=success' });
      res.end();
      return;
    }
    // Challenge with 401 and WWW-Authenticate for native browser prompt
    send401(res, 'Please authenticate with your CityMate credentials.', true);
    return;
  }

  // 4. Auth Logout
  if (urlPath === '/auth/logout' || urlPath === '/api/auth/logout') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'HTTP Basic Auth credentials remain cached in browser memory for the session.',
      instruction: 'To completely log out, close all browser windows or switch accounts.',
      logged_out: true
    }));
    return;
  }

  // 4b. Profile Endpoints (GET and PUT /auth/profile, /api/auth/profile, /api/profile)
  const isProfileRoute = ['/auth/profile', '/api/auth/profile', '/api/profile'].includes(urlPath);
  if (isProfileRoute) {
    const auth = verifyAuth(req);
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        authenticated_via: 'HTTP Basic Auth',
        user: auth.user || {
          id: 2,
          full_name: 'Deepak Shanmugam',
          email: 'deepakshanmugam12@gmail.com',
          phone: '',
          role: 'user',
          profile_pic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
        }
      }));
      return;
    }
    if (req.method === 'PUT') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const user = auth.user || {};
          const updatedUser = {
            id: user.id || payload.id || 2,
            username: user.username || (payload.full_name ? payload.full_name.toLowerCase().replace(/\s+/g, '') : 'user'),
            full_name: payload.full_name || user.full_name || 'Deepak Shanmugam',
            email: payload.email || user.email || 'deepakshanmugam12@gmail.com',
            phone: payload.phone !== undefined ? payload.phone : (user.phone || ''),
            profile_pic: payload.profile_pic !== undefined ? payload.profile_pic : (user.profile_pic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'),
            bio: payload.bio !== undefined ? payload.bio : (user.bio || ''),
            role: user.role || 'user'
          };
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            message: 'Profile updated successfully',
            user: updatedUser
          }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        }
      });
      return;
    }
  }

  // 5. Public Information Page (/login-info)
  if (urlPath === '/login-info') {
    const infoPath = path.join(FRONTEND_DIR, 'login-info.html');
    if (fs.existsSync(infoPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(fs.readFileSync(infoPath));
      return;
    }
  }

  // 6. Protected Admin Endpoints (/admin, /api/admin/stats, etc.)
  const isAdminRoute = urlPath === '/admin' || urlPath.startsWith('/api/admin/');
  if (isAdminRoute) {
    const auth = verifyAuth(req);
    if (!auth.authenticated) {
      send401(res, 'Administrator credentials are required to access this resource.', isHtmlRequest);
      return;
    }
    if (auth.user.role !== 'admin') {
      send403(res);
      return;
    }
  }

  // 7. Protected User Pages (/profile, /favorites, /recommendations, /trip-planner, /dashboard)
  const isProtectedPage = ['/profile', '/favorites', '/recommendations', '/trip-planner', '/dashboard'].includes(urlPath);
  if (isProtectedPage) {
    const auth = verifyAuth(req);
    if (!auth.authenticated) {
      send401(res, 'Valid CityMate credentials are required to access your protected travel features.', isHtmlRequest);
      return;
    }
  }

  // 8. Protected User APIs
  const isProtectedApi = ['/api/favorites', '/api/profile', '/api/recommendations'].includes(urlPath) ||
                        (urlPath === '/api/reviews' && req.method === 'POST');
  if (isProtectedApi) {
    const auth = verifyAuth(req);
    if (!auth.authenticated) {
      send401(res, 'Valid CityMate credentials are required.', false);
      return;
    }
  }

  // 9. Static File Serving & SPA Route Fallback
  let safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';

  let filePath = path.join(FRONTEND_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(FRONTEND_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Not Found',
          message: 'The requested CityMate resource was not found.'
        }));
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n======================================================`);
  console.log(`  CITYMATE – HTTP Basic Authentication Server Running`);
  console.log(`  Local URL: http://127.0.0.1:${PORT}`);
  console.log(`  Sign In:   http://127.0.0.1:${PORT}/login`);
  console.log(`  Auth Info: http://127.0.0.1:${PORT}/login-info`);
  console.log(`  Admin:     http://127.0.0.1:${PORT}/admin`);
  console.log(`======================================================\n`);
});
