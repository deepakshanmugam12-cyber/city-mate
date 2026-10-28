/**
 * CITYMATE — Shared Global Script (js/script.js)
 * Manages Theme Toggle, Mobile Navigation, Navbar Authentication State, and Shared Helpers.
 */

(function () {
  'use strict';

  // 1. Theme Management (Dark / Light)
  function initTheme() {
    const savedTheme = localStorage.getItem('cm_theme') ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('cm_theme', next);
  }

  // 2. Mobile Navigation Drawer
  function initMobileNav() {
    const toggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (toggle && navMenu) {
      toggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        toggle.querySelector('i').classList.toggle('fa-bars');
        toggle.querySelector('i').classList.toggle('fa-xmark');
      });
    }
  }

  // 3. Supabase Quick Connect Button in Navbar if needed
  function initSupabaseBanner() {
    if (window.citymateSupabase && !window.citymateSupabase.isConfigured) {
      // Check if banner already dismissed
      if (sessionStorage.getItem('cm_supabase_banner_dismissed')) return;

      const banner = document.createElement('div');
      banner.id = 'supabase-status-banner';
      banner.style.cssText = 'background: linear-gradient(90deg, #0d9488, #0284c7); color: #fff; padding: 6px 16px; font-size: 0.8rem; display: flex; align-items: center; justify-content: space-between; z-index: 1000; position: relative;';
      banner.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <i class="fa-solid fa-circle-info"></i>
          <span><strong>CityMate:</strong> Using demo seed data. Want to connect your Supabase project?</span>
          <button type="button" onclick="window.citymateSupabase.showConnectionModal()" style="background: rgba(255,255,255,0.25); border: none; color: #fff; border-radius: 9999px; padding: 2px 10px; font-size: 0.75rem; font-weight: 700; cursor: pointer; margin-left: 6px;">
            <i class="fa-solid fa-plug"></i> Connect Live Database
          </button>
        </div>
        <button type="button" onclick="sessionStorage.setItem('cm_supabase_banner_dismissed', '1'); document.getElementById('supabase-status-banner').remove();" style="background: none; border: none; color: rgba(255,255,255,0.8); cursor: pointer; font-size: 1rem;">&times;</button>
      `;
      document.body.insertBefore(banner, document.body.firstChild);
    }
  }

  // Global Toast function
  window.showToast = function (message, type = 'info') {
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
  };

  // Initialize on load
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    setTimeout(initSupabaseBanner, 500);
  });

})();
