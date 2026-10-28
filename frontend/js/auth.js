/**
 * CITYMATE — Supabase Authentication & Session Management Module
 * Handles User Registration, Login, Logout, Session Sync, and Navbar State.
 */

(function () {
  'use strict';

  // Quick helper to show toasts
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info';
    toast.innerHTML = '<i class="fa-solid ' + icon + '"></i><span>' + message + '</span>';
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  const authCtrl = {
    currentUser: null,
    currentSession: null,

    /**
     * Get active Supabase client
     */
    getClient: function () {
      return window.citymateSupabase ? window.citymateSupabase.getClient() : null;
    },

    /**
     * Initialize Auth state, listen to changes, and sync navbar
     */
    init: async function () {
      const client = this.getClient();
      if (!client) {
        console.log('[CityMate Auth] Supabase not yet configured. Navbar showing guest status.');
        this.updateNavbar(null);
        return;
      }

      try {
        // Fetch current session from Supabase
        const { data: { session }, error } = await client.auth.getSession();
        if (error) {
          console.warn('[CityMate Auth] Error getting session:', error.message);
        }

        if (session && session.user) {
          this.currentSession = session;
          this.currentUser = session.user;
          this.updateNavbar(session.user);
        } else {
          this.currentUser = null;
          this.currentSession = null;
          this.updateNavbar(null);
        }

        // Real-time auth state listener
        client.auth.onAuthStateChange(async (event, session) => {
          console.log('[CityMate Auth] Auth state change event:', event);
          if (session && session.user) {
            this.currentSession = session;
            this.currentUser = session.user;
            this.updateNavbar(session.user);
          } else {
            this.currentUser = null;
            this.currentSession = null;
            this.updateNavbar(null);
          }

          // Trigger custom event for other page scripts to listen
          window.dispatchEvent(new CustomEvent('citymate:auth_changed', {
            detail: { event, session, user: session ? session.user : null }
          }));
        });

      } catch (err) {
        console.error('[CityMate Auth] Initialization failed:', err);
        this.updateNavbar(null);
      }
    },

    /**
     * Update the Navigation Bar based on current authentication state
     */
    updateNavbar: function (user) {
      const guestActions = document.querySelectorAll('#nav-guest-actions, .nav-guest-actions');
      const userActions = document.querySelectorAll('#nav-user-actions, .nav-user-actions');
      const userNameEls = document.querySelectorAll('#nav-user-name, .nav-user-name');
      const userAvatarEls = document.querySelectorAll('#nav-user-avatar, .nav-user-avatar');

      if (user) {
        const fullName = (user.user_metadata && user.user_metadata.full_name) ||
                         (user.email ? user.email.split('@')[0] : 'Traveler');
        const avatarUrl = (user.user_metadata && user.user_metadata.avatar_url) ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

        guestActions.forEach(el => el.style.display = 'none');
        userActions.forEach(el => {
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.gap = '10px';
        });

        userNameEls.forEach(el => {
          el.textContent = fullName;
        });

        userAvatarEls.forEach(el => {
          if (el.tagName === 'IMG') {
            el.src = avatarUrl;
          }
        });
      } else {
        guestActions.forEach(el => {
          el.style.display = 'flex';
          el.style.gap = '8px';
        });
        userActions.forEach(el => el.style.display = 'none');
      }
    },

    /**
     * Register a new user with Supabase Auth
     */
    register: async function (fullName, email, password, confirmPassword) {
      const client = this.getClient();
      if (!client) {
        throw new Error('Supabase is not configured yet. Please enter your Supabase Project URL & Anon Key.');
      }

      // Input validation
      if (!fullName || !fullName.trim()) {
        throw new Error('Please enter your full name.');
      }
      if (!email || !email.includes('@')) {
        throw new Error('Please provide a valid email address.');
      }
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match. Please re-check your password.');
      }

      const cleanFullName = fullName.trim();
      const cleanEmail = email.trim().toLowerCase();

      // Call Supabase Auth signUp
      const { data, error } = await client.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            full_name: cleanFullName,
            avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanFullName)}`
          }
        }
      });

      if (error) {
        // Human-friendly error translation
        if (error.message && error.message.toLowerCase().includes('rate limit')) {
          throw new Error('Supabase email rate limit reached. Please disable "Confirm email" in your Supabase Dashboard (Authentication → Providers → Email) to enable instant signups.');
        }
        if (error.message && error.message.toLowerCase().includes('already registered')) {
          throw new Error('An account with this email address already exists. Please sign in instead.');
        }
        throw new Error(error.message);
      }

      // Supabase returns empty identities array if the user already exists (enumeration protection)
      if (data && data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        throw new Error('An account with this email address already exists. Please sign in instead.');
      }

      return data;
    },

    /**
     * Sign In with Email & Password
     */
    login: async function (email, password) {
      const client = this.getClient();
      if (!client) {
        throw new Error('Supabase is not configured yet. Please enter your Supabase Project URL & Anon Key.');
      }

      if (!email || !email.trim()) {
        throw new Error('Please enter your email address.');
      }
      if (!password) {
        throw new Error('Please enter your password.');
      }

      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });

      if (error) {
        if (error.message && error.message.toLowerCase().includes('invalid login credentials')) {
          throw new Error('Invalid email or password. Please verify your credentials, ensure you have created an account on the register page, and confirmed your email if required.');
        }
        if (error.message && error.message.toLowerCase().includes('email not confirmed')) {
          throw new Error('Your email address has not been confirmed yet. Please check your inbox or disable "Confirm email" in Supabase Auth settings.');
        }
        throw new Error(error.message);
      }

      return data;
    },

    /**
     * Sign out and clear session
     */
    logout: async function () {
      const client = this.getClient();
      try {
        if (client) {
          await client.auth.signOut();
        }
      } catch (err) {
        console.warn('[CityMate Auth] Sign out error:', err);
      }

      this.currentUser = null;
      this.currentSession = null;
      this.updateNavbar(null);

      showToast('You have been logged out successfully.', 'info');

      // Redirect to login page
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 500);
    },

    /**
     * Protect page route — redirect to login if unauthenticated
     */
    requireAuth: async function (redirectAfterLogin = null) {
      const client = this.getClient();
      const currentUrl = redirectAfterLogin || window.location.pathname.split('/').pop() || 'index.html';

      if (!client) {
        console.warn('[CityMate Auth] Supabase not connected. Allowing page preview.');
        return null;
      }

      const { data: { session } } = await client.auth.getSession();
      if (!session || !session.user) {
        console.log('[CityMate Auth] Access denied: Unauthenticated user redirected to login.');
        window.location.href = `login.html?next=${encodeURIComponent(currentUrl)}`;
        return null;
      }

      this.currentUser = session.user;
      this.currentSession = session;
      return session.user;
    },

    /**
     * Get current user synchronous or null
     */
    getUser: function () {
      return this.currentUser;
    }
  };

  // Expose globally
  window.authCtrl = authCtrl;

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => authCtrl.init());
  } else {
    authCtrl.init();
  }

})();
