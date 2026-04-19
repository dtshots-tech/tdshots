const PASSWORD = 'Admin123';
const COOKIE_NAME = 'tdshots_hub_auth';
const COOKIE_SECRET = 'tdshots-secret-x9k2m7'; // change this to anything random if you like

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Only protect /hub
    if (!url.pathname.startsWith('/hub')) {
      return fetch(request);
    }

    // Check for valid auth cookie
    const cookie = request.headers.get('Cookie') || '';
    if (cookie.includes(`${COOKIE_NAME}=${COOKIE_SECRET}`)) {
      return fetch(request); // Let them through
    }

    // Handle login form POST
    if (request.method === 'POST') {
      const body = await request.text();
      const params = new URLSearchParams(body);
      const submitted = params.get('password');

      if (submitted === PASSWORD) {
        // Correct — set cookie and redirect to hub
        return new Response('', {
          status: 302,
          headers: {
            'Location': '/hub',
            'Set-Cookie': `${COOKIE_NAME}=${COOKIE_SECRET}; Path=/hub; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`
          }
        });
      } else {
        // Wrong password — show login page with error
        return new Response(loginPage(true), {
          status: 401,
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }

    // No cookie, no POST — show login page
    return new Response(loginPage(false), {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
};

function loginPage(error) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>T&DSHOTS — Hub</title>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --bg: #0d0d0d; --surface: #161616; --border: #272727; --orange: #f06a00; --orange2: #ff8c2a; --text: #f0f0f0; --muted: #7a7a7a; }
    body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .logo { font-family: 'Bebas Neue', sans-serif; font-size: 3rem; letter-spacing: 0.1em; margin-bottom: 0.25rem; text-align: center; }
    .logo span { color: var(--orange); }
    .tagline { font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--muted); margin-bottom: 2.5rem; text-align: center; }
    .box { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 2rem 2.25rem; width: 100%; max-width: 360px; display: flex; flex-direction: column; gap: 1rem; }
    label { font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
    .pw-wrap { position: relative; display: flex; align-items: center; }
    input[type=password], input[type=text] { width: 100%; background: #111; border: 1px solid ${error ? '#e53935' : 'var(--border)'}; border-radius: 8px; padding: 0.75rem 3rem 0.75rem 1rem; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.95rem; outline: none; letter-spacing: 0.15em; }
    input:focus { border-color: var(--orange); }
    .toggle { position: absolute; right: 0.85rem; background: none; border: none; cursor: pointer; color: var(--muted); font-size: 1rem; }
    .toggle:hover { color: var(--text); }
    .error { font-size: 0.75rem; color: #e53935; text-align: center; }
    button[type=submit] { background: var(--orange); color: #000; border: none; border-radius: 8px; padding: 0.8rem; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 700; letter-spacing: 0.08em; cursor: pointer; text-transform: uppercase; transition: background 0.2s; }
    button[type=submit]:hover { background: var(--orange2); }
  </style>
</head>
<body>
  <div class="logo">T<span>&</span>DSHOTS</div>
  <div class="tagline">Business Hub</div>
  <div class="box">
    <form method="POST" action="/hub">
      <div style="display:flex;flex-direction:column;gap:1rem">
        <label for="pw">Password</label>
        <div class="pw-wrap">
          <input type="password" id="pw" name="password" placeholder="Enter password" autocomplete="current-password" autofocus/>
          <button type="button" class="toggle" onclick="var i=document.getElementById('pw');i.type=i.type==='password'?'text':'password'">👁</button>
        </div>
        ${error ? '<div class="error">Incorrect password. Try again.</div>' : '<div></div>'}
        <button type="submit">Unlock Hub</button>
      </div>
    </form>
  </div>
</body>
</html>`;
}
