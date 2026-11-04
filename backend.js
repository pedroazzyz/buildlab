/* Cliente mínimo para Supabase Auth e REST. Sem chave privilegiada no browser. */
(() => {
  const cfg = window.BUILDLAB_SUPABASE || {};
  const key = cfg.publicKey || '';
  const base = (cfg.url || '').replace(/\/$/, '');
  const tokenKey = 'buildlab-auth-v1';
  let session = null;
  try { session = JSON.parse(localStorage.getItem(tokenKey) || 'null'); } catch {}
  const ready = () => Boolean(base && key);
  const persist = () => session ? localStorage.setItem(tokenKey, JSON.stringify(session)) : localStorage.removeItem(tokenKey);
  async function request(path, options = {}, auth = true) {
    if (!ready()) throw new Error('Configure a URL e a chave pública do Supabase em supabase-config.js.');
    const headers = { apikey: key, 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (auth && session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
    let res = await fetch(`${base}${path}`, { ...options, headers });
    if (res.status === 401 && session?.refresh_token && !options.__retried) {
      const refreshed = await fetch(`${base}/auth/v1/token?grant_type=refresh_token`, { method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: session.refresh_token }) });
      if (refreshed.ok) { session = await refreshed.json(); persist(); return request(path, { ...options, __retried: true }, auth); }
    }
    const body = await res.text();
    if (!res.ok) { let message = body; try { const j = JSON.parse(body); message = j.msg || j.message || j.error_description || j.error || body; } catch {} throw new Error(message || `Supabase respondeu ${res.status}`); }
    return body ? JSON.parse(body) : null;
  }
  async function authPost(action, email, password) {
    const result = await request(`/auth/v1/${action}`, { method: 'POST', body: JSON.stringify({ email, password }) }, false);
    if (result.access_token) { session = result; persist(); }
    return result;
  }
  async function getProgress() {
    const rows = await request('/rest/v1/user_progress?select=state&limit=1');
    return rows?.[0]?.state || null;
  }
  async function putProgress(state) {
    return request('/rest/v1/user_progress?on_conflict=user_id', {
      method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ user_id: session.user.id, state, updated_at: new Date().toISOString() })
    });
  }
  window.BuildLabBackend = {
    ready, get user() { return session?.user || null; },
    async signIn(email, password) { return authPost('token?grant_type=password', email, password); },
    async signUp(email, password) { return authPost('signup', email, password); },
    async signOut() { try { if (session) await request('/auth/v1/logout', { method: 'POST' }); } finally { session = null; persist(); } },
    getProgress, putProgress
  };
})();
