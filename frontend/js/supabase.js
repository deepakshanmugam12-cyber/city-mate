/**
 * CITYMATE — Official Supabase Client Initialization
 * 
 * Instructions:
 * 1. Log in to your Supabase Dashboard: https://supabase.com/dashboard
 * 2. Go to Project Settings -> API
 * 3. Copy your "Project URL" and "anon / public key"
 * 4. Paste them into the SUPABASE_URL and SUPABASE_ANON_KEY variables below
 *    (or enter them via the "Connect Supabase" button in the navigation bar)
 */

(function () {
  'use strict';

  // =========================================================================
  // SUPABASE CONFIGURATION PLACEHOLDERS
  // Replace these with your actual Supabase project credentials.
  // NEVER put your secret/service-role key here — ONLY the public "anon" key!
  // =========================================================================
  const DEFAULT_SUPABASE_URL = 'https://eusjujcooyzskzddrdkk.supabase.co';
  const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_FDf32Zq4webrCfKeIx3rTQ_b4iFXluk';

  // Ensure global config is available
  window.CITYMATE_CONFIG = window.CITYMATE_CONFIG || {
    supabaseUrl: DEFAULT_SUPABASE_URL,
    supabaseKey: DEFAULT_SUPABASE_ANON_KEY
  };

  // Clean up any old placeholder strings that might be cached in browser localStorage
  try {
    const storedUrl = localStorage.getItem('citymate_supabase_url');
    if (storedUrl && (storedUrl.includes('YOUR_SUPABASE') || storedUrl.includes('placeholder'))) {
      localStorage.removeItem('citymate_supabase_url');
    }
    const storedKey = localStorage.getItem('citymate_supabase_key');
    if (storedKey && (storedKey.includes('YOUR_SUPABASE') || storedKey.includes('placeholder'))) {
      localStorage.removeItem('citymate_supabase_key');
    }
  } catch (e) {}

  const activeUrl = (window.CITYMATE_CONFIG && window.CITYMATE_CONFIG.supabaseUrl) ||
                    localStorage.getItem('citymate_supabase_url') ||
                    DEFAULT_SUPABASE_URL;

  const activeAnonKey = (window.CITYMATE_CONFIG && window.CITYMATE_CONFIG.supabaseKey) ||
                        localStorage.getItem('citymate_supabase_key') ||
                        DEFAULT_SUPABASE_ANON_KEY;

  /**
   * Determine if the Supabase credentials are real or still placeholders
   */
  function checkIsConfigured(url, key) {
    if (!url || !key) return false;
    const isUrlPlaceholder = url.includes('YOUR_SUPABASE') || url.includes('placeholder') || !url.startsWith('https://');
    const isKeyPlaceholder = key.includes('YOUR_SUPABASE') || key.length < 10;
    return !isUrlPlaceholder && !isKeyPlaceholder;
  }

  const isConfigured = checkIsConfigured(activeUrl, activeAnonKey);

  let client = null;

  // Initialize Supabase Client if library is available
  try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      if (isConfigured) {
        client = window.supabase.createClient(activeUrl, activeAnonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storage: window.localStorage
          }
        });
        console.log('[CityMate] Supabase client initialized successfully with live endpoint:', activeUrl);
      } else {
        console.warn('[CityMate] Supabase placeholders detected. Using local seed data mode until live credentials are set.');
      }
    } else {
      console.warn('[CityMate] Supabase JS library not loaded yet. Make sure to include @supabase/supabase-js script tag.');
    }
  } catch (err) {
    console.error('[CityMate] Error initializing Supabase client:', err);
  }

  // Global CityMate Supabase Manager
  window.citymateSupabase = {
    client: client,
    isConfigured: isConfigured,
    url: activeUrl,
    anonKey: activeAnonKey,

    /**
     * Get active client or null
     */
    getClient: function () {
      return this.client;
    },

    /**
     * Update credentials dynamically from UI modal or console
     */
    updateCredentials: function (newUrl, newKey) {
      if (!newUrl || !newKey) {
        alert('Please provide both Project URL and Public Anon Key.');
        return false;
      }
      localStorage.setItem('citymate_supabase_url', newUrl.trim());
      localStorage.setItem('citymate_supabase_key', newKey.trim());
      window.location.reload();
      return true;
    },

    /**
     * Clear saved custom credentials
     */
    resetCredentials: function () {
      localStorage.removeItem('citymate_supabase_url');
      localStorage.removeItem('citymate_supabase_key');
      window.location.reload();
    },

    /**
     * Show connection modal / info dialog
     */
    showConnectionModal: function () {
      let modal = document.getElementById('cm-supabase-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cm-supabase-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
          <div class="modal-dialog" style="max-width: 520px;">
            <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center; padding:18px 24px; border-bottom:1px solid var(--border-subtle);">
              <div style="display:flex; align-items:center; gap:10px;">
                <div style="width:36px; height:36px; border-radius:8px; background:linear-gradient(135deg, #10b981 0%, #0d9488 100%); display:flex; align-items:center; justify-content:center; color:#fff;">
                  <i class="fa-solid fa-database"></i>
                </div>
                <div>
                  <h3 style="margin:0; font-size:1.15rem; color:#fff; font-weight:700;">Supabase Configuration</h3>
                  <span style="font-size:0.75rem; color:var(--text-secondary);">Connect CityMate to your live PostgreSQL database</span>
                </div>
              </div>
              <button type="button" onclick="document.getElementById('cm-supabase-modal').classList.remove('active')" style="background:none; border:none; color:var(--text-muted); font-size:1.2rem; cursor:pointer;">&times;</button>
            </div>
            <div class="modal-body" style="padding:24px;">
              <div style="background:rgba(13,148,136,0.1); border:1px solid rgba(13,148,136,0.3); border-radius:var(--radius-md); padding:12px 14px; margin-bottom:18px; font-size:0.85rem; color:var(--text-main); display:flex; gap:10px;">
                <i class="fa-solid fa-circle-info" style="color:var(--primary-light); margin-top:2px;"></i>
                <div>
                  <strong>Status:</strong> ${isConfigured ? '<span style="color:#10b981;">Connected to Live Supabase</span>' : '<span style="color:#f59e0b;">Using Placeholder / Seed Data</span>'}<br/>
                  Find credentials in your Supabase dashboard under <em>Project Settings &rarr; API</em>.
                </div>
              </div>

              <form onsubmit="event.preventDefault(); window.citymateSupabase.updateCredentials(document.getElementById('cm-sb-url-input').value, document.getElementById('cm-sb-key-input').value);">
                <div class="form-group" style="margin-bottom:16px;">
                  <label class="form-label" style="font-size:0.85rem; font-weight:600;">Supabase Project URL</label>
                  <input type="url" id="cm-sb-url-input" class="form-control" placeholder="https://xyzcompany.supabase.co" value="${checkIsConfigured(activeUrl, activeAnonKey) ? activeUrl : ''}" required style="font-size:0.88rem;" />
                  <span style="font-size:0.72rem; color:var(--text-muted);">Format: https://&lt;your-project-ref&gt;.supabase.co</span>
                </div>

                <div class="form-group" style="margin-bottom:20px;">
                  <label class="form-label" style="font-size:0.85rem; font-weight:600;">Supabase Publishable (Anon) Key</label>
                  <textarea id="cm-sb-key-input" class="form-control" rows="3" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." required style="font-size:0.82rem; font-family:monospace; resize:none;">${checkIsConfigured(activeUrl, activeAnonKey) ? activeAnonKey : ''}</textarea>
                  <span style="font-size:0.72rem; color:var(--text-muted);">Use ONLY the public "anon" key. Never use the secret service-role key.</span>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
                  ${isConfigured ? `<button type="button" class="btn btn-secondary btn-sm" onclick="window.citymateSupabase.resetCredentials()">Reset</button>` : '<span></span>'}
                  <div style="display:flex; gap:10px;">
                    <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('cm-supabase-modal').classList.remove('active')">Cancel</button>
                    <button type="submit" class="btn btn-primary btn-sm" style="font-weight:700;"><i class="fa-solid fa-floppy-disk"></i> Save & Connect</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
      }
      modal.classList.add('active');
    }
  };

  // Expose alias
  window.supabaseClient = client;

})();
