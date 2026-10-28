/**
 * CityMate Main Application Controller
 * Handles Navigation, State, Authentication, City Selection, and Global Interactions
 */

class CityMateApp {
  constructor() {
    this.currentView = 'home';
    this.selectedCity = null;
    this.allCities = [];
    this.allCategories = [];
  }

  async init() {
    console.log("Initializing CityMate – Smart Tourist Companion...");
    
    // Bind all buttons & navigation events FIRST so the interface is immediately interactive
    this.bindGlobalEvents();
    this.initBrandLogo();
    this.initTheme();

    try {
      // Load default or saved city
      this.allCities = await window.api.getCities();
      this.allCategories = await window.api.getCategories();
    } catch (err) {
      console.warn("Error fetching cities/categories:", err);
      this.allCities = (typeof SEED_DATA !== 'undefined' && SEED_DATA.cities) ? SEED_DATA.cities : [];
      this.allCategories = (typeof SEED_DATA !== 'undefined' && SEED_DATA.categories) ? SEED_DATA.categories : [];
    }

    try {
      const savedCity = localStorage.getItem('cm_selected_city');
      if (savedCity && savedCity !== 'undefined' && savedCity !== 'null') {
        this.selectedCity = JSON.parse(savedCity);
      }
    } catch (e) {
      this.selectedCity = null;
    }

    if (!this.selectedCity) {
      this.selectedCity = (this.allCities && this.allCities[0]) || (typeof SEED_DATA !== 'undefined' && SEED_DATA.cities && SEED_DATA.cities[0]);
    }

    this.updateActiveCityDisplay();

    try {
      await this.syncHttpBasicAuthStatus();
    } catch (err) {
      console.warn("HTTP Basic Auth check:", err);
    }

    // Render initial Home content
    try {
      await this.renderHomeCategories();
      if (window.placesCtrl) {
        await window.placesCtrl.renderPlacesGrid('home-places-grid', { featured: true });
      }
      if (window.servicesCtrl && this.selectedCity) {
        await window.servicesCtrl.renderServicesGrid('home-services-grid', { city_id: this.selectedCity.id });
      }
    } catch (err) {
      console.warn("Home content rendering warning:", err);
    }

    // Initialize Feedback Controller
    if (window.feedbackCtrl) {
      try {
        window.feedbackCtrl.init();
      } catch (err) {
        console.warn("Feedback init warning:", err);
      }
    }

    // Check if initial hash is set
    const hash = window.location.hash.replace('#', '');
    if (hash && ['places', 'tickets', 'recommendations', 'services', 'map', 'favorites', 'planner', 'profile', 'admin', 'feedback', 'bookings'].includes(hash)) {
      this.switchView(hash);
    }

    console.log("CityMate Initialized successfully.");
  }

  bindGlobalEvents() {
    // Navigation links
    document.querySelectorAll('.nav-link[data-view]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        this.switchView(view);
      });
    });

    // Mobile nav toggle
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer-overlay');
    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        mobileDrawer.classList.add('active');
      });
    }

    // Close buttons for modals
    document.querySelectorAll('.modal-close, .modal-backdrop-close').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-overlay').forEach(m => {
          m.classList.remove('active');
          if (m.id === 'booking-modal' && window.bookingCtrl) {
            window.bookingCtrl.currentPlace = null;
          }
        });
      });
    });

    // Close modal when clicking outside on the backdrop
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
          if (overlay.id === 'booking-modal' && window.bookingCtrl) {
            window.bookingCtrl.currentPlace = null;
          }
        }
      });
    });

    // Close active modal on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => {
          m.classList.remove('active');
          if (m.id === 'booking-modal' && window.bookingCtrl) {
            window.bookingCtrl.currentPlace = null;
          }
        });
      }
    });

    // Global Hero Search
    const heroSearchInput = document.getElementById('global-search-input');
    const heroSearchBtn = document.getElementById('btn-hero-search');
    if (heroSearchBtn && heroSearchInput) {
      const executeSearch = () => {
        const query = heroSearchInput.value.trim();
        if (!query) return;

        const qLower = query.toLowerCase();
        const isHospitalQuery = ['hospital', 'hospitals', 'medical', 'clinic', 'emergency', 'doctor', 'ambulance', 'kmch', 'apollo', 'gknm', 'fortis', 'ganga', 'psg', 'miot', 'manipal', 'rajaji', 'victoria'].some(k => qLower.includes(k));
        
        if (isHospitalQuery) {
          this.switchView('services');
          window.servicesCtrl.setType('hospital');
          window.servicesCtrl.currentSearch = query;
          window.servicesCtrl.renderServicesGrid('services-grid-container', { search: query, service_type: 'hospital' });
          this.showToast(`Found emergency hospital details for "${query}"`, 'info');
          return;
        }

        const isServiceQuery = ['hotel', 'stay', 'lodge', 'restaurant', 'food', 'atm', 'bank', 'petrol', 'fuel', 'restroom', 'toilet', 'cab', 'taxi', 'rental'].some(k => qLower.includes(k));
        if (isServiceQuery) {
          this.switchView('services');
          window.servicesCtrl.renderServicesGrid('services-grid-container', { search: query });
          return;
        }

        window.placesCtrl.currentSearch = query;
        this.switchView('places');
        window.placesCtrl.renderPlacesGrid('tourist-places-grid', { search: query });
      };

      heroSearchBtn.addEventListener('click', executeSearch);
      heroSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeSearch();
      });
    }

    // Quick category chips in hero
    document.querySelectorAll('.hero-search-actions .filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cat = chip.dataset.cat;
        if (cat === 'hospital') {
          this.switchView('services');
          window.servicesCtrl.setType('hospital');
          return;
        }
        document.querySelectorAll('.hero-search-actions .filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        window.placesCtrl.currentCategory = cat;
        this.switchView('places');
        window.placesCtrl.renderPlacesGrid('tourist-places-grid', { category_slug: cat });
      });
    });

    // Places Page Category Filter Bar
    document.querySelectorAll('.places-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.places-filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const cat = chip.dataset.cat;
        window.placesCtrl.currentCategory = cat;
        window.placesCtrl.renderPlacesGrid('tourist-places-grid', { category_slug: cat });
      });
    });

    // Places Page Sort dropdown
    const sortSelect = document.getElementById('places-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        window.placesCtrl.sortBy = e.target.value;
        window.placesCtrl.renderPlacesGrid('tourist-places-grid', { sort_by: e.target.value });
      });
    }

    // Services Page Pills
    document.querySelectorAll('.service-pill-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        window.servicesCtrl.setType(btn.dataset.type);
      });
    });

    // Auth forms
    const loginForm = document.getElementById('auth-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLoginForm(e));
    }

    const registerForm = document.getElementById('auth-register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => this.handleRegisterForm(e));
    }

    const profileForm = document.getElementById('edit-profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
    }

    const reviewForm = document.getElementById('submit-review-form');
    if (reviewForm) {
      reviewForm.addEventListener('submit', (e) => window.placesCtrl.submitReview(e));
    }

    const placeAdminForm = document.getElementById('admin-place-form');
    if (placeAdminForm) {
      placeAdminForm.addEventListener('submit', (e) => window.adminCtrl.savePlaceForm(e));
    }

    const serviceAdminForm = document.getElementById('admin-service-form');
    if (serviceAdminForm) {
      serviceAdminForm.addEventListener('submit', (e) => window.adminCtrl.saveServiceForm(e));
    }

    // City search in modal
    const citySearch = document.getElementById('city-modal-search');
    if (citySearch) {
      citySearch.addEventListener('input', (e) => {
        this.filterCitiesInModal(e.target.value.toLowerCase());
      });
    }
  }

  switchView(viewName) {
    this.currentView = viewName;
    window.location.hash = viewName;

    // Close mobile drawer if open
    const drawer = document.getElementById('mobile-drawer-overlay');
    if (drawer) drawer.classList.remove('active');

    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.style.display = 'none';
    });

    // Update active nav-links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewName);
    });

    // Show target view section
    const target = document.getElementById(`view-${viewName}`);
    if (target) {
      target.style.display = 'block';
      if (typeof window.scrollTo === 'function') {
        try {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
          window.scrollTo(0, 0);
        }
      }
    }

    // Specific view init actions with resilient error isolation
    try {
      if (viewName === 'places' && window.placesCtrl) {
        window.placesCtrl.renderPlacesGrid('tourist-places-grid');
      } else if (viewName === 'services' && window.servicesCtrl) {
        window.servicesCtrl.renderServicesGrid('services-grid-container');
      } else if (viewName === 'recommendations' && window.recomCtrl) {
        window.recomCtrl.init();
      } else if (viewName === 'planner' && window.plannerCtrl) {
        window.plannerCtrl.init();
      } else if (viewName === 'map' && window.mapCtrl) {
        setTimeout(() => {
          try { window.mapCtrl.initMap(); } catch (e) { console.warn('Map init:', e); }
        }, 100);
      } else if (viewName === 'favorites') {
        this.renderFavoritesView();
      } else if (viewName === 'profile') {
        this.renderProfileView();
      } else if (viewName === 'admin' && window.adminCtrl) {
        const user = window.api.getCurrentUser();
        if (!user || user.role !== 'admin') {
          this.showToast('Administrator privileges required. Logging in as Admin for demo.', 'info');
          this.demoLogin('admin');
        }
        setTimeout(() => {
          try { window.adminCtrl.initDashboard(); } catch (e) { console.warn('Admin init:', e); }
        }, 50);
      } else if (viewName === 'feedback' && window.feedbackCtrl) {
        window.feedbackCtrl.renderFeedbackWall();
        window.feedbackCtrl.updateUserContext();
      } else if (viewName === 'bookings' && window.bookingCtrl) {
        window.bookingCtrl.renderBookingsView('bookings-list-container');
      } else if (viewName === 'tickets' && window.bookingCtrl) {
        window.bookingCtrl.renderTicketsSection();
      }
    } catch (err) {
      console.warn(`View switch warning (${viewName}):`, err);
    }
  }

  openAboutModal() {
    const modal = document.getElementById('about-modal');
    if (modal) modal.classList.add('active');
  }

  openContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) modal.classList.add('active');
  }

  // --- Dark & Light Theme Switcher ---
  initTheme() {
    let savedTheme = localStorage.getItem('cm_theme');
    if (!savedTheme) {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      // Requirement: On first visit, use system theme preference if available; otherwise default to light
      savedTheme = prefersDark ? 'dark' : 'light';
    }
    this.applyTheme(savedTheme, false);

    // Listen for OS system theme changes if user hasn't explicitly toggled
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('cm_theme_manual')) {
          this.applyTheme(e.matches ? 'dark' : 'light', false);
        }
      });
    }
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('cm_theme_manual', 'true');
    this.applyTheme(nextTheme, true);
  }

  applyTheme(theme, showFeedback = false) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cm_theme', theme);

    const isDark = theme === 'dark';
    const nextLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme';

    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.title = nextLabel;
      btn.setAttribute('aria-label', nextLabel);
    }

    const mobileBtn = document.getElementById('mobile-theme-toggle-btn');
    if (mobileBtn) {
      mobileBtn.title = nextLabel;
      mobileBtn.setAttribute('aria-label', nextLabel);
      const textSpan = mobileBtn.querySelector('.theme-text-label');
      if (textSpan) {
        textSpan.textContent = isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme';
      }
    }

    // Safely update Leaflet map tile layer without creating duplicate map or removing routes
    if (window.mapCtrl && typeof window.mapCtrl.updateMapTheme === 'function') {
      window.mapCtrl.updateMapTheme(theme);
    }

    if (showFeedback) {
      const modeLabel = isDark ? 'Dark theme enabled' : 'Light theme enabled';
      this.showToast(modeLabel, 'info');
    }
  }

  // --- City Selection & Auto Location ---
  updateActiveCityDisplay() {
    if (!this.selectedCity) return;
    const labels = document.querySelectorAll('.active-city-name');
    labels.forEach(l => l.textContent = this.selectedCity.name);

    const bannerCity = document.getElementById('banner-city-name');
    if (bannerCity) bannerCity.textContent = this.selectedCity.name;

    localStorage.setItem('cm_selected_city', JSON.stringify(this.selectedCity));

    // Notify Map Controller
    if (window.mapCtrl) window.mapCtrl.onCityChanged(this.selectedCity);
  }

  openCityModal() {
    const modal = document.getElementById('city-selection-modal');
    if (!modal) return;
    this.renderCitiesModalList();
    modal.classList.add('active');
  }

  renderCitiesModalList(filter = '') {
    const container = document.getElementById('city-modal-cards-grid');
    if (!container) return;

    const filtered = this.allCities.filter(c => 
      c.name.toLowerCase().includes(filter) || c.state.toLowerCase().includes(filter)
    );

    container.innerHTML = filtered.map(c => `
      <div class="city-picker-card ${this.selectedCity && this.selectedCity.id === c.id ? 'active' : ''}" 
           onclick="window.app.selectCity(${c.id})" 
           style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px; cursor: pointer; display: flex; align-items: center; gap: 14px; transition: var(--transition-fast);">
        <img src="${c.image_url}" style="width: 60px; height: 60px; border-radius: var(--radius-sm); object-fit: cover;" />
        <div style="flex: 1;">
          <h4 style="font-size: 1.05rem; font-weight: 700; color: #fff;">${c.name}</h4>
          <p style="font-size: 0.8rem; color: var(--text-secondary);">${c.state}, ${c.country}</p>
          <span style="font-size: 0.75rem; color: var(--primary-light); font-weight: 600;">${c.places_count || 4} places • ${c.services_count || 8} services</span>
        </div>
        ${this.selectedCity && this.selectedCity.id === c.id ? '<i class="fa-solid fa-circle-check" style="color: var(--primary-light); font-size: 1.2rem;"></i>' : ''}
      </div>
    `).join('');
  }

  filterCitiesInModal(query) {
    this.renderCitiesModalList(query);
  }

  selectCity(cityId) {
    const city = this.allCities.find(c => c.id === Number(cityId));
    if (city) {
      this.selectedCity = city;
      this.updateActiveCityDisplay();
      this.showToast(`Exploring ${city.name}!`, 'success');
      document.getElementById('city-selection-modal').classList.remove('active');

      // Refresh data on current view
      const plannerCitySelect = document.getElementById('planner-city-select');
      if (plannerCitySelect) plannerCitySelect.value = city.id;

      if (this.currentView === 'home') {
        window.placesCtrl.renderPlacesGrid('home-places-grid', { featured: true });
        window.servicesCtrl.renderServicesGrid('home-services-grid', { city_id: city.id });
      } else if (this.currentView === 'places') {
        window.placesCtrl.renderPlacesGrid('tourist-places-grid');
      } else if (this.currentView === 'services') {
        window.servicesCtrl.renderServicesGrid('services-grid-container');
      } else if (this.currentView === 'recommendations') {
        window.recomCtrl.fetchAndRenderRecommendations();
      } else if (this.currentView === 'planner') {
        if (window.plannerCtrl) window.plannerCtrl.syncCitySelect();
      }
    }
  }

  useCurrentLocation() {
    if (!navigator.geolocation) {
      this.showToast('Geolocation is not supported by your browser.', 'info');
      return;
    }

    this.showToast('Detecting your nearest city...', 'info');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        // Find nearest city from allCities
        let nearest = this.allCities[0];
        let minDistance = 999999;

        this.allCities.forEach(c => {
          const dLat = c.lat - userLat;
          const dLng = c.lng - userLng;
          const dist = Math.sqrt(dLat * dLat + dLng * dLng);
          if (dist < minDistance) {
            minDistance = dist;
            nearest = c;
          }
        });

        this.selectCity(nearest.id);
        this.showToast(`Detected nearest destination: ${nearest.name}!`, 'success');
      },
      (err) => {
        this.showToast('Could not access GPS. Defaulted to Coimbatore.', 'info');
      }
    );
  }

  // --- Home Categories Render ---
  async renderHomeCategories() {
    const container = document.getElementById('home-categories-grid');
    if (!container) return;

    container.innerHTML = this.allCategories.map(cat => `
      <div class="category-card" onclick="window.app.filterByCategory('${cat.slug}')">
        <div class="category-icon-wrapper">
          <i class="fa-solid ${cat.icon}"></i>
        </div>
        <div class="category-name">${cat.name}</div>
        <div class="category-count">${cat.places_count || ''}</div>
      </div>
    `).join('');
  }

  filterByCategory(slug) {
    window.placesCtrl.currentCategory = slug;
    this.switchView('places');
    document.querySelectorAll('.places-filter-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.cat === slug);
    });
    window.placesCtrl.renderPlacesGrid('tourist-places-grid', { category_slug: slug });
  }

  // --- HTTP Basic Authentication UI & Synchronization ---
  async syncHttpBasicAuthStatus() {
    try {
      const token = localStorage.getItem('cm_basic_token');
      const headers = token ? { 'Authorization': 'Basic ' + token } : {};
      const res = await fetch('/auth/status', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          this.httpAuthUser = data.user;
          localStorage.setItem('cm_current_user', JSON.stringify(data.user));
          this.updateNavbarAuth();
          return data.user;
        } else {
          this.httpAuthUser = null;
          localStorage.removeItem('cm_basic_token');
          localStorage.removeItem('cm_current_user');
        }
      }
    } catch (e) {
      console.log('HTTP Basic Auth check:', e);
    }
    this.updateNavbarAuth();
    return null;
  }

  updateNavbarAuth() {
    let user = this.httpAuthUser;
    if (!user && localStorage.getItem('cm_basic_token')) {
      try {
        const raw = localStorage.getItem('cm_current_user');
        if (raw && raw !== 'undefined' && raw !== 'null') {
          user = JSON.parse(raw);
        }
      } catch (e) {
        user = null;
      }
    }
    const guestActions = document.getElementById('nav-guest-actions');
    const userActions = document.getElementById('nav-user-actions');
    const adminLink = document.getElementById('nav-admin-link');
    const mobileAdminLink = document.getElementById('mobile-admin-link');

    if (user && (this.httpAuthUser || localStorage.getItem('cm_basic_token'))) {
      if (guestActions) guestActions.style.display = 'none';
      if (userActions) {
        userActions.style.display = 'flex';
        const nameLabel = document.getElementById('nav-user-name');
        if (nameLabel) nameLabel.textContent = user.username || user.full_name;
      }
      if (user.role === 'admin') {
        if (adminLink) adminLink.style.display = 'inline-flex';
        if (mobileAdminLink) mobileAdminLink.style.display = 'block';
      } else {
        if (adminLink) adminLink.style.display = 'none';
        if (mobileAdminLink) mobileAdminLink.style.display = 'none';
      }
    } else {
      if (guestActions) guestActions.style.display = 'flex';
      if (userActions) userActions.style.display = 'none';
      if (adminLink) adminLink.style.display = 'none';
      if (mobileAdminLink) mobileAdminLink.style.display = 'none';
    }
  }

  triggerBasicAuthSignIn() {
    // Navigates to dedicated CityMate modern login page
    window.location.href = '/login?next=' + encodeURIComponent(window.location.pathname + window.location.hash);
  }

  handleBasicAuthLogout() {
    this.httpAuthUser = null;
    localStorage.removeItem('cm_basic_token');
    localStorage.removeItem('cm_current_user');
    fetch('/auth/logout').then(() => {
      this.showToast('You have signed out of CityMate.', 'info');
      this.updateNavbarAuth();
    }).catch(() => {
      this.updateNavbarAuth();
    });
  }

  openAuthModal(mode = 'login') {
    // Redirects to real HTTP Basic Auth or informs user
    this.triggerBasicAuthSignIn();
  }

  switchAuthTab(tab) {
    this.triggerBasicAuthSignIn();
  }

  async handleLoginForm(e) {
    e.preventDefault();
    this.triggerBasicAuthSignIn();
  }

  async handleRegisterForm(e) {
    e.preventDefault();
    this.triggerBasicAuthSignIn();
  }

  demoLogin(role = 'user') {
    this.triggerBasicAuthSignIn();
  }

  logout() {
    this.handleBasicAuthLogout();
  }

  // --- Favorites Page View ---
  renderFavoritesView() {
    const container = document.getElementById('favorites-grid');
    if (!container) return;

    const favPlaces = window.api.getFavoritesList();

    if (!favPlaces || favPlaces.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
          <i class="fa-solid fa-heart" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 16px;"></i>
          <h3 style="font-size: 1.3rem; margin-bottom: 8px;">Your Wishlist is Empty</h3>
          <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto 20px;">Explore tourist places and tap the heart icon on any card to save it for your journey.</p>
          <button class="btn btn-primary btn-sm" onclick="window.app.switchView('places')">Explore Tourist Places</button>
        </div>
      `;
      return;
    }

    container.innerHTML = favPlaces.map(p => window.placesCtrl.createPlaceCardHtml(p)).join('');
  }

  // --- Profile Page View ---
  renderProfileView() {
    const user = window.api.getCurrentUser();
    if (!user) {
      this.showToast('Please sign in to view your profile.', 'info');
      this.openAuthModal('login');
      this.switchView('home');
      return;
    }

    document.getElementById('profile-name').textContent = user.full_name || 'Traveler';
    document.getElementById('profile-email').textContent = user.email || 'traveler@citymate.com';
    document.getElementById('profile-phone').textContent = user.phone || 'No phone added';
    
    // Default to handsome male traveler portrait for Deepak/male travelers
    const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
    document.getElementById('profile-avatar').src = user.profile_pic || defaultAvatar;
    document.getElementById('profile-role').textContent = (user.role || 'USER').toUpperCase();

    const bioElem = document.getElementById('profile-bio');
    if (bioElem) {
      if (user.bio) {
        bioElem.textContent = user.bio;
        bioElem.style.display = 'block';
      } else {
        bioElem.style.display = 'none';
      }
    }

    // Render favorites in profile
    const favPlaces = window.api.getFavoritesList();
    const favListContainer = document.getElementById('profile-favorites-list');
    if (favListContainer) {
      favListContainer.innerHTML = favPlaces.length > 0 ? favPlaces.map(p => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-surface); border-radius: var(--radius-md); margin-bottom: 10px; border: 1px solid var(--border-subtle);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${p.image_url}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;" />
            <div>
              <strong>${p.name}</strong>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${p.city_name} • ${p.category_name}</div>
            </div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.placesCtrl.openPlaceDetails(${p.id})">Details</button>
        </div>
      `).join('') : '<p style="color: var(--text-muted);">No favorites saved yet.</p>';
    }

    // Render reviews written by user
    const reviews = (JSON.parse(localStorage.getItem('cm_reviews') || '[]'))
      .filter(r => r.user_id === user.id);
    const reviewsContainer = document.getElementById('profile-reviews-list');
    if (reviewsContainer) {
      reviewsContainer.innerHTML = reviews.length > 0 ? reviews.map(r => `
        <div class="review-item">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <strong>Place #${r.place_id}</strong>
            <span style="color: var(--accent-amber);">${r.rating}★</span>
          </div>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">${r.comment}</p>
        </div>
      `).join('') : '<p style="color: var(--text-muted);">You have not written any reviews yet.</p>';
    }
  }

  openEditProfileModal() {
    const user = window.api.getCurrentUser();
    if (!user) return;
    const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
    const pic = user.profile_pic || defaultAvatar;

    document.getElementById('edit-profile-name').value = user.full_name || '';
    document.getElementById('edit-profile-email').value = user.email || '';
    document.getElementById('edit-profile-phone').value = user.phone || '';
    document.getElementById('edit-profile-bio').value = user.bio || '';
    document.getElementById('edit-profile-pic').value = pic;
    document.getElementById('edit-profile-avatar-preview').src = pic;

    // Highlight matching preset button
    document.querySelectorAll('.avatar-preset-btn').forEach(b => {
      const img = b.querySelector('img');
      b.classList.toggle('active', img && img.src === pic);
    });

    document.getElementById('edit-profile-modal').classList.add('active');
  }

  closeEditProfileModal() {
    document.getElementById('edit-profile-modal').classList.remove('active');
  }

  selectAvatarPreset(url, btn) {
    document.getElementById('edit-profile-pic').value = url;
    document.getElementById('edit-profile-avatar-preview').src = url;
    document.querySelectorAll('.avatar-preset-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.showToast('Selected avatar preset!', 'info');
  }

  handleAvatarFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.showToast('Please select a valid image file (PNG/JPG)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      document.getElementById('edit-profile-pic').value = dataUrl;
      document.getElementById('edit-profile-avatar-preview').src = dataUrl;
      document.querySelectorAll('.avatar-preset-btn').forEach(b => b.classList.remove('active'));
      this.showToast('Photo uploaded from device!', 'success');
    };
    reader.readAsDataURL(file);
  }

  toggleCustomAvatarUrl() {
    const box = document.getElementById('custom-avatar-url-box');
    if (!box) return;
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
    if (box.style.display === 'block') {
      document.getElementById('edit-profile-pic-url-input').focus();
    }
  }

  handleCustomAvatarUrlInput(e) {
    const url = e.target.value.trim();
    if (url) {
      document.getElementById('edit-profile-pic').value = url;
      document.getElementById('edit-profile-avatar-preview').src = url;
      document.querySelectorAll('.avatar-preset-btn').forEach(b => b.classList.remove('active'));
    }
  }

  async handleProfileUpdate(e) {
    if (e && e.preventDefault) e.preventDefault();
    const full_name = document.getElementById('edit-profile-name').value.trim();
    const email = document.getElementById('edit-profile-email').value.trim();
    const phone = document.getElementById('edit-profile-phone').value.trim();
    const bio = document.getElementById('edit-profile-bio').value.trim();
    const profile_pic = document.getElementById('edit-profile-pic').value.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

    if (!full_name) {
      this.showToast('Please enter your full name.', 'error');
      return;
    }

    try {
      const current = window.api.getCurrentUser() || {};
      const updatedUser = {
        ...current,
        full_name,
        email: email || current.email,
        phone,
        bio,
        profile_pic
      };

      // 1. Save directly to LocalStorage
      localStorage.setItem('cm_current_user', JSON.stringify(updatedUser));
      this.httpAuthUser = updatedUser;

      // 2. Sync to Backend API
      await window.api.updateProfile(updatedUser);

      this.showToast('Profile updated successfully!', 'success');
      this.closeEditProfileModal();
      this.updateNavbarAuth();
      this.renderProfileView();
    } catch (err) {
      console.warn('Profile update notice:', err);
      // Even if network error, local update already succeeded
      this.closeEditProfileModal();
      this.updateNavbarAuth();
      this.renderProfileView();
      this.showToast('Profile updated successfully!', 'success');
    }
  }

  // --- Add Hospital Details Modal Handlers ---
  openAddHospitalModal() {
    const modal = document.getElementById('add-hospital-modal');
    if (!modal) return;
    const citySelect = document.getElementById('hosp-city');
    if (citySelect && this.selectedCity) {
      citySelect.value = String(this.selectedCity.id);
    }
    modal.classList.add('active');
  }

  closeAddHospitalModal() {
    const modal = document.getElementById('add-hospital-modal');
    if (modal) modal.classList.remove('active');
  }

  async handleAddHospitalSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const name = document.getElementById('hosp-name').value.trim();
    const cityId = Number(document.getElementById('hosp-city').value) || 1;
    const phone = document.getElementById('hosp-phone').value.trim();
    const address = document.getElementById('hosp-address').value.trim();
    const status = document.getElementById('hosp-status').value;
    const rating = parseFloat(document.getElementById('hosp-rating').value) || 4.8;
    const distance = parseFloat(document.getElementById('hosp-distance').value) || 1.5;
    const price = document.getElementById('hosp-price').value;
    const imageUrl = document.getElementById('hosp-image').value.trim() || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500';

    if (!name || !address || !phone) {
      this.showToast('Please enter Hospital name, address, and emergency phone number.', 'error');
      return;
    }

    // Default city coordinates offset slightly for map display
    const cityCoords = {
      1: { lat: 11.0168, lng: 76.9558 },
      2: { lat: 13.0827, lng: 80.2707 },
      3: { lat: 11.4102, lng: 76.6950 },
      4: { lat: 9.9252, lng: 78.1198 },
      5: { lat: 11.6643, lng: 78.1460 },
      6: { lat: 12.9716, lng: 77.5946 }
    };
    const center = cityCoords[cityId] || { lat: 11.0168, lng: 76.9558 };
    const randOffsetLat = (Math.random() - 0.5) * 0.02;
    const randOffsetLng = (Math.random() - 0.5) * 0.02;

    const newHospital = {
      id: Date.now(),
      city_id: cityId,
      place_id: null,
      service_type: 'hospital',
      name: name,
      address: address,
      lat: center.lat + randOffsetLat,
      lng: center.lng + randOffsetLng,
      rating: rating,
      phone: phone,
      opening_status: status,
      image_url: imageUrl,
      distance_km: distance,
      price_level: price
    };

    try {
      await window.api.addService(newHospital);
      this.showToast(`Hospital "${name}" added successfully!`, 'success');
      this.closeAddHospitalModal();

      // Reset form
      const form = document.getElementById('add-hospital-form');
      if (form) form.reset();

      // Refresh services grid if on services view
      if (window.servicesCtrl) {
        window.servicesCtrl.setType('hospital');
        window.servicesCtrl.renderServicesGrid();
      }
    } catch (err) {
      this.showToast('Could not save hospital: ' + err.message, 'error');
    }
  }

  // --- Custom Brand Logo Management ---
  initBrandLogo() {
    const customLogo = localStorage.getItem('cm_custom_logo');
    const customBrandName = localStorage.getItem('cm_custom_brand_name');

    if (customLogo) {
      this.applyBrandLogo(customLogo);
    } else {
      const testImg = new Image();
      testImg.onload = () => {
        this.applyBrandLogo('assets/logo.png');
      };
      testImg.onerror = () => {
        this.applyBrandLogo(null);
      };
      testImg.src = 'assets/logo.png';
    }

    if (customBrandName) {
      this.applyBrandName(customBrandName);
    }
  }

  applyBrandLogo(logoSrc) {
    document.querySelectorAll('.brand-icon').forEach(iconContainer => {
      let img = iconContainer.querySelector('img.brand-custom-img');
      const defaultIcon = iconContainer.querySelector('.brand-default-icon, i');

      if (logoSrc) {
        if (!img) {
          img = document.createElement('img');
          img.className = 'brand-custom-img';
          img.alt = 'Custom Brand Logo';
          iconContainer.prepend(img);
        }
        img.src = logoSrc;
        img.style.display = 'block';
        if (defaultIcon) defaultIcon.style.display = 'none';
      } else {
        if (img) img.style.display = 'none';
        if (defaultIcon) defaultIcon.style.display = 'block';
      }
    });

    if (logoSrc) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = logoSrc;
    }
  }

  applyBrandName(name) {
    if (!name) return;
    document.querySelectorAll('.brand-text').forEach(bt => {
      if (bt.id === 'modal-brand-text-preview') return;
      if (name.length > 4) {
        const mid = Math.ceil(name.length / 2);
        bt.innerHTML = `${name.slice(0, mid)}<span>${name.slice(mid)}</span>`;
      } else {
        bt.innerHTML = `<span>${name}</span>`;
      }
    });
  }

  openLogoUploadModal() {
    const modal = document.getElementById('logo-upload-modal');
    if (!modal) return;

    const currentLogo = localStorage.getItem('cm_custom_logo') || '';
    const currentName = localStorage.getItem('cm_custom_brand_name') || '';

    const urlInput = document.getElementById('logo-url-input');
    const nameInput = document.getElementById('brand-name-input');
    if (urlInput) urlInput.value = currentLogo.startsWith('data:') ? '' : currentLogo;
    if (nameInput) nameInput.value = currentName;

    this.updateModalPreview(currentLogo || null, currentName || 'CITYMATE');
    modal.classList.add('active');
  }

  closeLogoUploadModal() {
    const modal = document.getElementById('logo-upload-modal');
    if (modal) modal.classList.remove('active');
  }

  updateModalPreview(logoSrc, brandName) {
    const previewImg = document.getElementById('modal-preview-img');
    const defaultIcon = document.getElementById('modal-preview-default-icon');
    const textPreview = document.getElementById('modal-brand-text-preview');

    if (previewImg && defaultIcon) {
      if (logoSrc) {
        previewImg.src = logoSrc;
        previewImg.style.display = 'block';
        defaultIcon.style.display = 'none';
      } else {
        previewImg.style.display = 'none';
        defaultIcon.style.display = 'block';
      }
    }

    if (textPreview && brandName) {
      if (brandName.length > 4) {
        const mid = Math.ceil(brandName.length / 2);
        textPreview.innerHTML = `${brandName.slice(0, mid)}<span>${brandName.slice(mid)}</span>`;
      } else {
        textPreview.innerHTML = `<span>${brandName}</span>`;
      }
    }
  }

  handleLogoFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.showToast('Please select an image file (PNG, SVG, JPG, WebP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      this.tempLogoDataUrl = event.target.result;
      this.updateModalPreview(this.tempLogoDataUrl, (document.getElementById('brand-name-input') || {}).value || 'CITYMATE');
      this.showToast('Logo file loaded! Click "Save Logo" to apply.', 'info');
    };
    reader.readAsDataURL(file);
  }

  previewLogoUrl(url) {
    const trimmed = (url || '').trim();
    this.tempLogoDataUrl = trimmed || null;
    this.updateModalPreview(this.tempLogoDataUrl, (document.getElementById('brand-name-input') || {}).value || 'CITYMATE');
  }

  previewBrandName(name) {
    const trimmed = (name || '').trim();
    this.updateModalPreview(this.tempLogoDataUrl || localStorage.getItem('cm_custom_logo'), trimmed || 'CITYMATE');
  }

  handleLogoSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const urlInput = document.getElementById('logo-url-input');
    const nameInput = document.getElementById('brand-name-input');
    const customName = nameInput ? nameInput.value.trim() : '';

    let chosenLogo = this.tempLogoDataUrl;
    if (!chosenLogo && urlInput && urlInput.value.trim()) {
      chosenLogo = urlInput.value.trim();
    }

    if (chosenLogo) {
      localStorage.setItem('cm_custom_logo', chosenLogo);
      this.applyBrandLogo(chosenLogo);
    }

    if (customName) {
      localStorage.setItem('cm_custom_brand_name', customName);
      this.applyBrandName(customName);
    } else {
      localStorage.removeItem('cm_custom_brand_name');
    }

    this.showToast('Brand logo updated successfully across the entire site!', 'success');
    this.closeLogoUploadModal();
  }

  resetToDefaultLogo() {
    localStorage.removeItem('cm_custom_logo');
    localStorage.removeItem('cm_custom_brand_name');
    this.tempLogoDataUrl = null;
    this.applyBrandLogo(null);
    document.querySelectorAll('.brand-text').forEach(bt => {
      bt.innerHTML = `CITY<span>MATE</span>`;
    });

    const urlInput = document.getElementById('logo-url-input');
    const nameInput = document.getElementById('brand-name-input');
    const fileInput = document.getElementById('logo-file-input');
    if (urlInput) urlInput.value = '';
    if (nameInput) nameInput.value = '';
    if (fileInput) fileInput.value = '';

    this.updateModalPreview(null, 'CITYMATE');
    this.showToast('Reset to default CityMate logo.', 'info');
    this.closeLogoUploadModal();
  }

  // --- Toast Notification Utility ---
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info';
    toast.innerHTML = `
      <i class="fa-solid ${icon}" style="font-size: 1.15rem;"></i>
      <span style="flex: 1;">${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Global Application Instance
window.app = new CityMateApp();
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
