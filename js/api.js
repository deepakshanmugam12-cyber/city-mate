/**
 * CityMate Unified API Client
 * Seamlessly connects to Flask REST backend (http://127.0.0.1:5000/api)
 * Automatically falls back to LocalStorage & SEED_DATA if Flask backend is not currently running.
 * This ensures the frontend functions perfectly whether opened directly or through Flask!
 */

const API_BASE_URL = window.location.origin.includes('5000') 
  ? '/api' 
  : 'http://127.0.0.1:5000/api';

class ApiService {
  constructor() {
    this.isBackendOnline = null;
    this.initLocalStorage();
  }

  initLocalStorage() {
    // Clean up any corrupted "undefined" or "null" strings from previous sessions
    const keysToClean = ['cm_reviews', 'cm_feedbacks', 'cm_favorites', 'cm_users', 'cm_current_user', 'cm_selected_city', 'cm_cities', 'cm_categories', 'cm_places', 'cm_services', 'cm_bookings'];
    keysToClean.forEach(key => {
      try {
        const val = localStorage.getItem(key);
        if (val === 'undefined' || val === 'null') {
          localStorage.removeItem(key);
        }
      } catch (e) {}
    });

    const safeParse = (key, fallback) => {
      try {
        const val = localStorage.getItem(key);
        if (!val || val === 'undefined' || val === 'null') return fallback;
        return JSON.parse(val);
      } catch (e) {
        return fallback;
      }
    };

    const safeSet = (key, val) => {
      try {
        localStorage.setItem(key, JSON.stringify(val ?? []));
      } catch (e) {}
    };

    const dataCities = (typeof SEED_DATA !== 'undefined' && SEED_DATA.cities) ? SEED_DATA.cities : [];
    const dataCategories = (typeof SEED_DATA !== 'undefined' && SEED_DATA.categories) ? SEED_DATA.categories : [];
    const dataPlaces = (typeof SEED_DATA !== 'undefined' && SEED_DATA.places) ? SEED_DATA.places : [];
    const dataServices = (typeof SEED_DATA !== 'undefined' && SEED_DATA.services) ? SEED_DATA.services : [];
    const dataReviews = (typeof SEED_DATA !== 'undefined' && SEED_DATA.reviews) ? SEED_DATA.reviews : [];
    const dataFeedbacks = (typeof SEED_DATA !== 'undefined' && SEED_DATA.feedbacks) ? SEED_DATA.feedbacks : [];
    const dataFavorites = (typeof SEED_DATA !== 'undefined' && SEED_DATA.favorites) ? SEED_DATA.favorites : [1, 2];
    const dataUsers = (typeof SEED_DATA !== 'undefined' && SEED_DATA.users) ? SEED_DATA.users : [
      { id: 1, full_name: "System Admin", email: "admin@citymate.com", phone: "9876543210", role: "admin", is_active: 1 },
      { id: 2, full_name: "Arun Kumar", email: "demo@citymate.com", phone: "9845123456", role: "user", is_active: 1 },
      { id: 3, full_name: "Priya Sharma", email: "priya@citymate.com", phone: "9789012345", role: "user", is_active: 1 }
    ];

    // 1. Sync & update cities
    const currentCities = safeParse('cm_cities', []);
    if (currentCities.length === 0) {
      safeSet('cm_cities', dataCities);
    } else {
      const updatedCities = dataCities.map(sc => {
        const match = currentCities.find(c => c.id === sc.id);
        return match ? { ...match, places_count: sc.places_count, services_count: sc.services_count } : sc;
      });
      safeSet('cm_cities', updatedCities);
    }

    const currentStoredCategories = safeParse('cm_categories', []);
    if (!localStorage.getItem('cm_categories') || currentStoredCategories.length < dataCategories.length) {
      safeSet('cm_categories', dataCategories);
    }

    // 2. Sync & auto-merge places
    const currentStoredPlaces = safeParse('cm_places', []);
    const existingPlaceIds = new Set(currentStoredPlaces.map(p => p.id));
    const missingPlaces = dataPlaces.filter(p => !existingPlaceIds.has(p.id));
    if (missingPlaces.length > 0) {
      safeSet('cm_places', [...currentStoredPlaces, ...missingPlaces]);
    } else if (currentStoredPlaces.length === 0) {
      safeSet('cm_places', dataPlaces);
    }

    // 3. Sync & auto-merge services
    const currentStoredServices = safeParse('cm_services', []);
    const existingServiceIds = new Set(currentStoredServices.map(s => s.id));
    const missingServices = dataServices.filter(s => !existingServiceIds.has(s.id));
    if (missingServices.length > 0) {
      safeSet('cm_services', [...currentStoredServices, ...missingServices]);
    } else if (currentStoredServices.length === 0) {
      safeSet('cm_services', dataServices);
    }

    // 4. Sync & auto-merge reviews
    const currentStoredReviews = safeParse('cm_reviews', []);
    const existingReviewIds = new Set(currentStoredReviews.map(r => r.id));
    const missingReviews = dataReviews.filter(r => !existingReviewIds.has(r.id));
    if (missingReviews.length > 0) {
      safeSet('cm_reviews', [...currentStoredReviews, ...missingReviews]);
    } else if (currentStoredReviews.length === 0) {
      safeSet('cm_reviews', dataReviews);
    }

    // 5. Sync & auto-merge feedbacks
    const currentStoredFeedbacks = safeParse('cm_feedbacks', []);
    const existingFeedbackIds = new Set(currentStoredFeedbacks.map(f => f.id));
    const missingFeedbacks = dataFeedbacks.filter(f => !existingFeedbackIds.has(f.id));
    if (missingFeedbacks.length > 0) {
      safeSet('cm_feedbacks', [...currentStoredFeedbacks, ...missingFeedbacks]);
    } else if (currentStoredFeedbacks.length === 0) {
      safeSet('cm_feedbacks', dataFeedbacks);
    }

    if (!localStorage.getItem('cm_favorites')) {
      safeSet('cm_favorites', dataFavorites);
    }
    if (!localStorage.getItem('cm_users')) {
      safeSet('cm_users', dataUsers);
    }
    if (!localStorage.getItem('cm_current_user')) {
      // Default logged in as Demo Traveler for seamless preview
      safeSet('cm_current_user', dataUsers[1] || dataUsers[0]);
    }
    if (!localStorage.getItem('cm_selected_city') && dataCities.length > 0) {
      safeSet('cm_selected_city', dataCities[0]);
    }

    const dataBookings = (typeof SEED_DATA !== 'undefined' && SEED_DATA.bookings) ? SEED_DATA.bookings : [
      {
        id: 1,
        booking_ref: "CM-AY9821",
        place_id: 1,
        place_name: "Adiyogi Shiva & Isha Yoga Center",
        image_url: "assets/places/adiyogi.jpg",
        address: "Velliangiri Foothills, Ishana Vihar, Coimbatore",
        city_name: "Coimbatore",
        visitor_name: "Arun Kumar",
        visitor_email: "demo@citymate.com",
        visitor_phone: "+91 98451 23456",
        visit_date: "2026-10-25",
        visit_time: "10:00 AM",
        num_adults: 2,
        num_children: 1,
        total_amount: 0,
        entry_fee_per_person: 0,
        opening_hours: "6:00 AM - 8:00 PM",
        special_requests: "Wheelchair assistance requested at Dhyanalinga entry",
        status: "confirmed",
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        booking_ref: "CM-GD5412",
        place_id: 4,
        place_name: "Gedee Car Museum",
        image_url: "assets/places/gedee_cars.jpg",
        address: "Avanashi Road, Race Course, Coimbatore",
        city_name: "Coimbatore",
        visitor_name: "Arun Kumar",
        visitor_email: "demo@citymate.com",
        visitor_phone: "+91 98451 23456",
        visit_date: "2026-10-27",
        visit_time: "02:30 PM",
        num_adults: 2,
        num_children: 0,
        total_amount: 200,
        entry_fee_per_person: 100,
        opening_hours: "9:00 AM - 6:30 PM",
        special_requests: "Guided heritage automobile tour reservation",
        status: "confirmed",
        created_at: new Date().toISOString()
      }
    ];

    const currentStoredBookings = safeParse('cm_bookings', []);
    if (currentStoredBookings.length === 0) {
      safeSet('cm_bookings', dataBookings);
    }
  }

  async checkBackend() {
    if (this.isBackendOnline !== null) return this.isBackendOnline;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      this.isBackendOnline = res.ok;
    } catch (e) {
      this.isBackendOnline = false;
    }
    console.log(`CityMate Mode: ${this.isBackendOnline ? 'Connected to Flask REST API (SQLite)' : 'Client-Side Offline Engine (LocalStorage + Seed Data)'}`);
    return this.isBackendOnline;
  }

  // --- Auth APIs ---
  async login(email, password) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        localStorage.setItem('cm_current_user', JSON.stringify(data.user));
        return data.user;
      } catch (err) {
        if (!err.message.includes('Failed to fetch')) throw err;
      }
    }

    // Local fallback: Universal login accepts ANY email and password
    const users = JSON.parse(localStorage.getItem('cm_users') || '[]');
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      const isEmail = email.includes('@');
      const cleanName = isEmail ? email.split('@')[0] : email;
      const displayName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      const isRoleAdmin = email.toLowerCase().includes('admin');
      user = {
        id: users.length + 10,
        full_name: displayName,
        email: isEmail ? email : `${email}@citymate.com`,
        role: isRoleAdmin ? 'admin' : 'user',
        is_active: true,
        created_at: new Date().toISOString()
      };
      users.push(user);
      localStorage.setItem('cm_users', JSON.stringify(users));
    }
    
    localStorage.setItem('cm_current_user', JSON.stringify(user));
    return user;
  }

  async register(userData) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        localStorage.setItem('cm_current_user', JSON.stringify(data.user));
        return data.user;
      } catch (err) {
        if (!err.message.includes('Failed to fetch')) throw err;
      }
    }

    // Local fallback
    const users = JSON.parse(localStorage.getItem('cm_users') || '[]');
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('An account with this email already exists');
    }
    const newUser = {
      id: Date.now(),
      full_name: userData.full_name,
      email: userData.email,
      phone: userData.phone || '',
      role: 'user',
      profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      is_active: 1,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('cm_users', JSON.stringify(users));
    localStorage.setItem('cm_current_user', JSON.stringify(newUser));
    return newUser;
  }

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('cm_current_user') || 'null');
    } catch {
      return null;
    }
  }

  logout() {
    localStorage.removeItem('cm_current_user');
  }

  async updateProfile(userData) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const token = localStorage.getItem('cm_basic_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = 'Basic ' + token;
        const res = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(userData)
        });
        const data = await res.json();
        if (res.ok && data.user) {
          localStorage.setItem('cm_current_user', JSON.stringify(data.user));
          return data.user;
        }
      } catch (e) {}
    }

    const current = this.getCurrentUser() || {};
    const updated = { ...current, ...userData };
    localStorage.setItem('cm_current_user', JSON.stringify(updated));

    const users = JSON.parse(localStorage.getItem('cm_users') || '[]');
    const idx = users.findIndex(u => u.id === current.id || (u.email && u.email === current.email));
    if (idx !== -1) {
      users[idx] = updated;
      localStorage.setItem('cm_users', JSON.stringify(users));
    }
    return updated;
  }

  // --- Cities & Categories ---
  async getCities() {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/cities`);
        if (res.ok) {
          const data = await res.json();
          return data.cities;
        }
      } catch (e) {}
    }
    return JSON.parse(localStorage.getItem('cm_cities') || '[]');
  }

  async getCategories() {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        if (res.ok) {
          const data = await res.json();
          return data.categories;
        }
      } catch (e) {}
    }
    return JSON.parse(localStorage.getItem('cm_categories') || '[]');
  }

  // --- Tourist Places ---
  async getPlaces(filters = {}) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const queryParams = new URLSearchParams();
        if (filters.city_id) queryParams.append('city_id', filters.city_id);
        if (filters.category_slug) queryParams.append('category_slug', filters.category_slug);
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.min_rating) queryParams.append('min_rating', filters.min_rating);
        if (filters.max_fee) queryParams.append('max_fee', filters.max_fee);
        if (filters.sort_by) queryParams.append('sort_by', filters.sort_by);
        if (filters.featured) queryParams.append('featured', 1);

        const res = await fetch(`${API_BASE_URL}/places?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          return data.places;
        }
      } catch (e) {}
    }

    // Local filter engine
    let places = [];
    try {
      places = JSON.parse(localStorage.getItem('cm_places') || '[]');
    } catch (e) {
      places = [];
    }
    if (places.length === 0 && typeof SEED_DATA !== 'undefined' && SEED_DATA.places) {
      places = [...SEED_DATA.places];
      try { localStorage.setItem('cm_places', JSON.stringify(places)); } catch (e) {}
    }

    if (filters.city_id && filters.city_id !== 'all') {
      const cityIdNum = Number(filters.city_id);
      const filteredByCity = places.filter(p => p.city_id === cityIdNum || (p.city_name && window.app && window.app.selectedCity && p.city_name.toLowerCase() === window.app.selectedCity.name.toLowerCase()));
      if (filteredByCity.length > 0) {
        places = filteredByCity;
      } else if (typeof SEED_DATA !== 'undefined' && SEED_DATA.places) {
        const seedCity = SEED_DATA.places.filter(p => p.city_id === cityIdNum);
        if (seedCity.length > 0) places = seedCity;
      }
    }
    if (filters.category_slug && filters.category_slug !== 'all') {
      places = places.filter(p => p.category_slug && p.category_slug.toLowerCase() === filters.category_slug.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      places = places.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) || 
        (p.description && p.description.toLowerCase().includes(q)) || 
        (p.category_name && p.category_name.toLowerCase().includes(q)) ||
        (p.city_name && p.city_name.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    if (filters.min_rating) {
      places = places.filter(p => p.rating >= Number(filters.min_rating));
    }
    if (filters.max_fee !== undefined && filters.max_fee !== null && filters.max_fee !== '') {
      places = places.filter(p => p.entry_fee <= Number(filters.max_fee));
    }
    if (filters.featured) {
      const featured = places.filter(p => p.is_featured);
      if (featured.length > 0) places = featured;
    }

    // Sort
    const sortBy = filters.sort_by || 'rating_desc';
    if (sortBy === 'rating_desc') places.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'rating_asc') places.sort((a, b) => a.rating - b.rating);
    else if (sortBy === 'fee_asc') places.sort((a, b) => a.entry_fee - b.entry_fee);
    else if (sortBy === 'fee_desc') places.sort((a, b) => b.entry_fee - a.entry_fee);
    else if (sortBy === 'distance_asc') places.sort((a, b) => a.distance_km - b.distance_km);
    else if (sortBy === 'name_asc') places.sort((a, b) => a.name.localeCompare(b.name));

    return places;
  }

  async getPlaceById(id) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/places/${id}`);
        if (res.ok) {
          const data = await res.json();
          return data.place;
        }
      } catch (e) {}
    }

    const places = JSON.parse(localStorage.getItem('cm_places') || '[]');
    const place = places.find(p => p.id === Number(id));
    if (!place) return null;

    const reviews = JSON.parse(localStorage.getItem('cm_reviews') || '[]')
      .filter(r => r.place_id === Number(id));
    const services = JSON.parse(localStorage.getItem('cm_services') || '[]')
      .filter(s => s.city_id === place.city_id && (s.place_id === place.id || !s.place_id));

    // rating distribution
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => { dist[r.rating] = (dist[r.rating] || 0) + 1; });

    return {
      ...place,
      reviews,
      rating_distribution: dist,
      nearby_services: services
    };
  }

  // --- Essential Services ---
  async getServices(filters = {}) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const queryParams = new URLSearchParams();
        if (filters.city_id) queryParams.append('city_id', filters.city_id);
        if (filters.service_type) queryParams.append('service_type', filters.service_type);
        if (filters.place_id) queryParams.append('place_id', filters.place_id);
        if (filters.search) queryParams.append('search', filters.search);

        const res = await fetch(`${API_BASE_URL}/services?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          return data.services;
        }
      } catch (e) {}
    }

    let services = JSON.parse(localStorage.getItem('cm_services') || '[]');
    if (filters.city_id && filters.city_id !== 'all') {
      services = services.filter(s => s.city_id === Number(filters.city_id));
    }
    if (filters.service_type && filters.service_type !== 'all') {
      services = services.filter(s => s.service_type === filters.service_type);
    }
    if (filters.place_id) {
      services = services.filter(s => s.place_id === Number(filters.place_id));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      services = services.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.address.toLowerCase().includes(q) ||
        s.service_type.toLowerCase().includes(q)
      );
    }
    return services;
  }

  async addService(serviceData) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const token = localStorage.getItem('cm_basic_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = 'Basic ' + token;
        const res = await fetch(`${API_BASE_URL}/services`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(serviceData)
        });
        const data = await res.json();
        if (res.ok && data.service_id) {
          serviceData.id = data.service_id;
        }
      } catch (e) {}
    }

    const services = JSON.parse(localStorage.getItem('cm_services') || '[]');
    if (!serviceData.id) serviceData.id = Date.now();
    services.unshift(serviceData);
    localStorage.setItem('cm_services', JSON.stringify(services));
    return serviceData;
  }

  // --- Reviews ---
  async addReview(placeId, rating, comment) {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Please login to write a review');

    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            place_id: placeId,
            user_id: user.id,
            user_name: user.full_name,
            rating: Number(rating),
            comment: comment.trim()
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to submit review');
        return data;
      } catch (e) {
        if (!e.message.includes('Failed to fetch')) throw e;
      }
    }

    // Local fallback
    const reviews = JSON.parse(localStorage.getItem('cm_reviews') || '[]');
    const newRev = {
      id: Date.now(),
      place_id: Number(placeId),
      user_id: user.id,
      user_name: user.full_name,
      rating: Number(rating),
      comment: comment.trim(),
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    reviews.unshift(newRev);
    localStorage.setItem('cm_reviews', JSON.stringify(reviews));

    // Update place rating
    const places = JSON.parse(localStorage.getItem('cm_places') || '[]');
    const p = places.find(pl => pl.id === Number(placeId));
    if (p) {
      const placeRevs = reviews.filter(r => r.place_id === Number(placeId));
      const avg = placeRevs.reduce((acc, r) => acc + r.rating, 0) / placeRevs.length;
      p.rating = Math.round(avg * 10) / 10;
      p.review_count = placeRevs.length;
      localStorage.setItem('cm_places', JSON.stringify(places));
    }
    return { message: 'Review published successfully!', review: newRev };
  }

  async deleteReview(reviewId) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, { method: 'DELETE' });
        if (res.ok) return await res.json();
      } catch (e) {}
    }

    let reviews = JSON.parse(localStorage.getItem('cm_reviews') || '[]');
    reviews = reviews.filter(r => r.id !== Number(reviewId));
    localStorage.setItem('cm_reviews', JSON.stringify(reviews));
    return { message: 'Review deleted successfully' };
  }

  // --- Favorites ---
  async toggleFavorite(placeId) {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Please login to manage favorites');

    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/favorites/toggle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id, place_id: placeId })
        });
        if (res.ok) {
          const data = await res.json();
          // Sync local storage
          let favs = JSON.parse(localStorage.getItem('cm_favorites') || '[]');
          if (data.is_favorite) favs.push(Number(placeId));
          else favs = favs.filter(id => id !== Number(placeId));
          localStorage.setItem('cm_favorites', JSON.stringify([...new Set(favs)]));
          return data;
        }
      } catch (e) {}
    }

    let favs = JSON.parse(localStorage.getItem('cm_favorites') || '[]');
    const numId = Number(placeId);
    let isFav = false;
    if (favs.includes(numId)) {
      favs = favs.filter(id => id !== numId);
      isFav = false;
    } else {
      favs.push(numId);
      isFav = true;
    }
    localStorage.setItem('cm_favorites', JSON.stringify(favs));
    return {
      is_favorite: isFav,
      message: isFav ? 'Added to favorites' : 'Removed from favorites'
    };
  }

  getFavoritesList() {
    try {
      const favIds = JSON.parse(localStorage.getItem('cm_favorites') || '[]');
      const places = JSON.parse(localStorage.getItem('cm_places') || '[]');
      return places.filter(p => favIds.includes(p.id));
    } catch {
      return [];
    }
  }

  isFavorite(placeId) {
    const favs = JSON.parse(localStorage.getItem('cm_favorites') || '[]');
    return favs.includes(Number(placeId));
  }

  // --- Recommendations ---
  async getRecommendations(params) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/recommendations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        });
        if (res.ok) {
          const data = await res.json();
          return data.recommendations;
        }
      } catch (e) {}
    }

    // Offline heuristic engine
    const places = await this.getPlaces({ city_id: params.city_id });
    const interests = (params.interests || []).map(i => i.toLowerCase());
    const budget = (params.budget || 'medium').toLowerCase();
    const maxDist = Number(params.max_distance || 50);

    const scored = places.map(p => {
      let score = 0;
      const matched = [];
      if (interests.includes(p.category_slug.toLowerCase())) {
        score += 45;
        matched.push(p.category_name);
      }
      (p.tags || []).forEach(tag => {
        interests.forEach(int => {
          if (tag.toLowerCase().includes(int)) {
            score += 15;
            if (!matched.includes(int.toUpperCase())) matched.push(int.charAt(0).toUpperCase() + int.slice(1));
          }
        });
      });

      score += Math.round(p.rating * 8);

      if (budget === 'low') {
        if (p.entry_fee === 0) score += 20;
        else if (p.entry_fee <= 50) score += 10;
        else score -= 15;
      } else if (budget === 'medium' && p.entry_fee <= 250) {
        score += 15;
      } else if (budget === 'high') {
        score += 15;
      }

      if (p.distance_km <= maxDist) score += 15;

      let reason = matched.length > 0
        ? `Recommended because you selected ${matched.slice(0, 2).join(' & ')}.`
        : `Top recommended highlight in ${p.city_name} with exceptional ${p.rating}★ rating.`;

      return {
        ...p,
        recommendation_score: score,
        match_percentage: Math.min(99, Math.max(70, Math.round(score * 0.95))),
        recommendation_reason: reason
      };
    });

    scored.sort((a, b) => b.recommendation_score - a.recommendation_score);
    return scored.slice(0, 10);
  }

  // --- Smart Trip Planner ---
  async generateTripPlan(plannerParams) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/trip-planner`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(plannerParams)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }

    // Local planner generator
    const cities = JSON.parse(localStorage.getItem('cm_cities') || '[]');
    const city = cities.find(c => c.id === Number(plannerParams.city_id)) || cities[0] || { id: 1, name: 'Destination' };
    const allPlaces = (JSON.parse(localStorage.getItem('cm_places') || '[]'))
      .filter(p => p.city_id === city.id);
    const services = (JSON.parse(localStorage.getItem('cm_services') || '[]'))
      .filter(s => s.city_id === city.id);

    const hotels = services.filter(s => s.service_type === 'hotel');
    const restaurants = services.filter(s => s.service_type === 'restaurant');
    const bunks = services.filter(s => s.service_type === 'petrol_bunk');
    const hospitals = services.filter(s => s.service_type === 'hospital');
    const policeList = services.filter(s => s.service_type === 'police');

    const days = Math.min(14, Math.max(1, Number(plannerParams.days || 2) || 2));
    const budget = (plannerParams.budget || 'moderate').toLowerCase();
    const rawInterests = Array.isArray(plannerParams.interests) && plannerParams.interests.length ? plannerParams.interests : ['nature', 'temple', 'historical', 'shopping'];
    const interests = rawInterests.map(i => String(i).toLowerCase());

    // Filter hotels by budget
    let matchedHotels = hotels;
    if (budget === 'budget') {
      matchedHotels = hotels.filter(h => h.price_level === '$');
    } else if (budget === 'luxury') {
      matchedHotels = hotels.filter(h => h.price_level === '$$$$' || h.price_level === '$$$');
    } else {
      matchedHotels = hotels.filter(h => h.price_level === '$$' || h.price_level === '$$$');
    }
    if (!matchedHotels.length) matchedHotels = hotels;

    // Filter restaurants for breakfast, lunch, and dinner
    const bKeywords = ['breakfast', 'tiffin', 'morning', 'cafe', 'bakery', 'idli', 'coffee', 'bakes', 'waffles'];
    const lKeywords = ['lunch', 'meals', 'thali', 'mess', 'biryani', 'bistro', 'feast'];
    const dKeywords = ['dinner', 'rooftop', 'grill', 'barbecue', 'candlelight', 'pavilion', 'buffet', 'terrace', 'fine dining'];

    let breakfastSpots = restaurants.filter(r => {
      const txt = `${r.name || ''} ${r.opening_status || ''} ${r.address || ''}`.toLowerCase();
      return bKeywords.some(k => txt.includes(k));
    });
    let lunchSpots = restaurants.filter(r => {
      const txt = `${r.name || ''} ${r.opening_status || ''} ${r.address || ''}`.toLowerCase();
      return lKeywords.some(k => txt.includes(k));
    });
    let dinnerSpots = restaurants.filter(r => {
      const txt = `${r.name || ''} ${r.opening_status || ''} ${r.address || ''}`.toLowerCase();
      return dKeywords.some(k => txt.includes(k));
    });

    if (!breakfastSpots.length) breakfastSpots = restaurants.filter(r => r.price_level === '$' || r.price_level === '$$');
    if (!breakfastSpots.length) breakfastSpots = restaurants;
    if (!lunchSpots.length) lunchSpots = restaurants;
    if (!dinnerSpots.length) dinnerSpots = restaurants.filter(r => r.price_level === '$$$' || r.price_level === '$$$$');
    if (!dinnerSpots.length) dinnerSpots = restaurants;

    // Filter/rank candidate places by interest
    const matchedPlaces = [];
    const otherPlaces = [];
    allPlaces.forEach(p => {
      const cat = (p.category_slug || '').toLowerCase();
      const tags = (p.tags || []).map(t => t.toLowerCase());
      if (interests.includes(cat) || tags.some(t => interests.includes(t))) {
        matchedPlaces.push(p);
      } else {
        otherPlaces.push(p);
      }
    });

    const candidatePlaces = matchedPlaces.concat(otherPlaces);
    const placesToUse = candidatePlaces.length ? candidatePlaces : allPlaces;

    const slotConfigs = [
      { slot_number: 1, slot_name: 'Morning Spotlight', time: '08:30 AM - 10:45 AM', badge: 'Spot 1 • Morning Exploration', actPrefix: 'Iconic morning exploration & scenic photography' },
      { slot_number: 2, slot_name: 'Mid-Day Cultural Visit', time: '11:15 AM - 01:00 PM', badge: 'Spot 2 • Cultural & Heritage Stop', actPrefix: 'Architectural tour, exhibits & historical immersion' },
      { slot_number: 3, slot_name: 'Afternoon Scenic Leisure', time: '03:00 PM - 05:00 PM', badge: 'Spot 3 • Afternoon Leisure & Nature', actPrefix: 'Lush garden strolling, craft shopping & boat rides' },
      { slot_number: 4, slot_name: 'Golden Hour Sunset Finale', time: '05:30 PM - 07:30 PM', badge: 'Spot 4 • Sunset View & Twilight Leisure', actPrefix: 'Breathtaking twilight vista, light show & evening breeze' }
    ];

    const itinerary = [];
    for (let d = 1; d <= days; d++) {
      const bSpot = breakfastSpots[(d - 1) % breakfastSpots.length] || null;
      const lSpot = lunchSpots[(d - 1) % lunchSpots.length] || null;
      const dSpot = dinnerSpots[(d - 1) % dinnerSpots.length] || null;

      const daySpots = slotConfigs.map((cfg, sIdx) => {
        const placeIdx = ((d - 1) * 4 + sIdx) % (placesToUse.length || 1);
        const place = placesToUse[placeIdx] || null;
        let tip = 'Arrive early to avoid queues and enjoy the best ambient photography.';
        if (place && place.category_slug === 'temple') tip = 'Dress traditionally; morning and evening pooja aartis are spiritually uplifting.';
        if (place && place.category_slug === 'nature') tip = 'Carry light jackets for hill breezes and comfortable walking shoes.';
        if (place && place.category_slug === 'beach') tip = 'Enjoy the cool sea breeze and local sundal; avoid swimming during high tides.';
        if (place && place.category_slug === 'adventure') tip = 'Pre-book morning safari/jeep departures for the best wildlife sightings.';

        return {
          spot_number: cfg.slot_number,
          slot_name: cfg.slot_name,
          badge: cfg.badge,
          time: cfg.time,
          place,
          activity: `${cfg.actPrefix} at ${place ? place.name : 'Attraction'}`,
          tip
        };
      });

      const hotelStay = matchedHotels.length ? matchedHotels[(d - 1) % matchedHotels.length] : null;
      const fuel = bunks.length ? bunks[(d - 1) % bunks.length] : null;
      const hosp = hospitals.length ? hospitals[(d - 1) % hospitals.length] : null;
      const pol = policeList.length ? policeList[0] : null;

      // Daily base costs
      let baseStay = 2100;
      let baseFood = 1000;
      let baseSightseeing = 300;
      let baseTransit = 400;

      if (budget === 'budget') {
        baseStay = 800;
        baseFood = 450;
        baseSightseeing = 150;
        baseTransit = 200;
      } else if (budget === 'luxury') {
        baseStay = 5200;
        baseFood = 2100;
        baseSightseeing = 500;
        baseTransit = 700;
      }

      // Calculate actual entry fees for today's spots
      let dayActualEntry = 0;
      daySpots.forEach(s => {
        if (s.place && typeof s.place.entry_fee === 'number') {
          dayActualEntry += s.place.entry_fee;
        }
      });
      const daySightseeingEst = Math.max(baseSightseeing, dayActualEntry);
      const dayTotalCost = baseStay + baseFood + baseTransit + daySightseeingEst;

      itinerary.push({
        day: d,
        title: `Day ${d}: Highlights & Cultural Wonders of ${city.name}`,
        expected_amount_day: `₹${dayTotalCost.toLocaleString()}`,
        day_amount_numeric: dayTotalCost,
        day_cost_breakdown: {
          stay: `₹${baseStay.toLocaleString()}`,
          food: `₹${baseFood.toLocaleString()}`,
          sightseeing: `₹${daySightseeingEst.toLocaleString()}`,
          transit: `₹${baseTransit.toLocaleString()}`,
          actual_entry_fees: `₹${dayActualEntry.toLocaleString()}`,
          total: `₹${dayTotalCost.toLocaleString()}`
        },
        estimated_travel_km: (11.0 + d * 2.5).toFixed(1),
        spots_count: daySpots.length,
        spots: daySpots,
        meals: {
          breakfast: {
            time: '07:30 AM - 09:00 AM',
            meal_type: 'Breakfast',
            restaurant: bSpot,
            recommendation: 'Authentic morning filter kaapi, warm ghee roasts, fresh bakes or healthy tiffins'
          },
          lunch: {
            time: '01:00 PM - 02:30 PM',
            meal_type: 'Lunch',
            restaurant: lSpot,
            recommendation: 'Traditional banana leaf meals, authentic regional thalis or specialty biryanis'
          },
          dinner: {
            time: '08:00 PM - 10:00 PM',
            meal_type: 'Dinner',
            restaurant: dSpot,
            recommendation: 'Rooftop dining, candle-lit courtyard grills, sunset terrace dinner or fine dining'
          }
        },
        morning: {
          time: daySpots[0].time,
          activity: daySpots[0].activity,
          place: daySpots[0].place,
          tips: daySpots[0].tip
        },
        afternoon: {
          time: '01:00 PM - 03:00 PM',
          lunch: lSpot,
          activity: 'Authentic Regional Dining & Cultural Walk',
          highlight: daySpots[2] ? daySpots[2].place : null
        },
        evening: {
          time: daySpots[3] ? daySpots[3].time : '05:30 PM - 07:30 PM',
          activity: daySpots[3] ? daySpots[3].activity : 'Evening Sunset',
          place: daySpots[3] ? daySpots[3].place : null,
          tips: daySpots[3] ? daySpots[3].tip : 'Enjoy the twilight breeze'
        },
        suggested_hotel: hotelStay,
        nearest_petrol: fuel,
        nearest_hospital: hosp,
        police_assistance: pol
      });
    }

    let budgetBreakdown = {
      stay_per_day: '₹2,100',
      food_per_day: '₹1,000',
      sightseeing_per_day: '₹300',
      transit_per_day: '₹400',
      recommended_stay_tier: 'Comfort 3-Star Hotels / Boutique Stays',
      recommended_transit: 'App Cabs / Self-Drive Rentals / Dedicated Taxis'
    };

    if (budget === 'budget') {
      budgetBreakdown = {
        stay_per_day: '₹800',
        food_per_day: '₹450',
        sightseeing_per_day: '₹150',
        transit_per_day: '₹200',
        recommended_stay_tier: 'Budget Lodges / Backpacker Hostels / Homestays',
        recommended_transit: 'Public Bus / City Metro / Shared Auto'
      };
    } else if (budget === 'luxury') {
      budgetBreakdown = {
        stay_per_day: '₹5,200',
        food_per_day: '₹2,100',
        sightseeing_per_day: '₹500',
        transit_per_day: '₹700',
        recommended_stay_tier: '5-Star Luxury Resorts / Heritage Palaces & Suites',
        recommended_transit: 'Private Chauffeur Sedan / Premium Luxury SUV'
      };
    }

    const totalBudgetNum = itinerary.reduce((acc, d) => acc + (d.day_amount_numeric || 0), 0);
    const dailyRate = budget === 'budget' ? 1600 : (budget === 'luxury' ? 8500 : 3800);

    return {
      city,
      days,
      budget,
      daily_rate: dailyRate,
      total_estimated_budget: `₹${totalBudgetNum.toLocaleString()}`,
      budget_breakdown: budgetBreakdown,
      spots_per_day: 4,
      itinerary
    };
  }

  // --- Admin Stats & CRUD ---
  async getAdminStats() {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/stats`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }

    const users = JSON.parse(localStorage.getItem('cm_users') || '[]');
    const places = JSON.parse(localStorage.getItem('cm_places') || '[]');
    const services = JSON.parse(localStorage.getItem('cm_services') || '[]');
    const reviews = JSON.parse(localStorage.getItem('cm_reviews') || '[]');
    const favs = JSON.parse(localStorage.getItem('cm_favorites') || '[]');
    const cities = JSON.parse(localStorage.getItem('cm_cities') || '[]');

    const catCounts = {};
    places.forEach(p => {
      catCounts[p.category_name] = (catCounts[p.category_name] || 0) + 1;
    });

    const srvCounts = {};
    services.forEach(s => {
      srvCounts[s.service_type] = (srvCounts[s.service_type] || 0) + 1;
    });

    return {
      stats: {
        total_users: users.length,
        total_places: places.length,
        total_services: services.length,
        total_reviews: reviews.length,
        total_favorites: favs.length,
        total_cities: cities.length
      },
      category_breakdown: Object.entries(catCounts).map(([name, count]) => ({ name, count })),
      services_breakdown: Object.entries(srvCounts).map(([service_type, count]) => ({ service_type, count })),
      recent_reviews: reviews.slice(0, 6)
    };
  }

  async adminDeletePlace(placeId) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/places/${placeId}`, { method: 'DELETE' });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    let places = JSON.parse(localStorage.getItem('cm_places') || '[]');
    places = places.filter(p => p.id !== Number(placeId));
    localStorage.setItem('cm_places', JSON.stringify(places));
    return { message: 'Place deleted' };
  }

  async adminSavePlace(placeData) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const url = placeData.id ? `${API_BASE_URL}/places/${placeData.id}` : `${API_BASE_URL}/places`;
        const method = placeData.id ? 'PUT' : 'POST';
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(placeData)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }

    let places = JSON.parse(localStorage.getItem('cm_places') || '[]');
    if (placeData.id) {
      const idx = places.findIndex(p => p.id === Number(placeData.id));
      if (idx !== -1) places[idx] = { ...places[idx], ...placeData };
    } else {
      const newP = {
        ...placeData,
        id: Date.now(),
        rating: 4.5,
        review_count: 0
      };
      places.unshift(newP);
    }
    localStorage.setItem('cm_places', JSON.stringify(places));
    return { message: 'Place saved' };
  }

  async adminDeleteService(serviceId) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/services/${serviceId}`, { method: 'DELETE' });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    let srvs = JSON.parse(localStorage.getItem('cm_services') || '[]');
    srvs = srvs.filter(s => s.id !== Number(serviceId));
    localStorage.setItem('cm_services', JSON.stringify(srvs));
    return { message: 'Service deleted' };
  }

  async adminSaveService(serviceData) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const url = serviceData.id ? `${API_BASE_URL}/services/${serviceData.id}` : `${API_BASE_URL}/services`;
        const method = serviceData.id ? 'PUT' : 'POST';
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceData)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }

    let srvs = JSON.parse(localStorage.getItem('cm_services') || '[]');
    if (serviceData.id) {
      const idx = srvs.findIndex(s => s.id === Number(serviceData.id));
      if (idx !== -1) srvs[idx] = { ...srvs[idx], ...serviceData };
    } else {
      const newS = {
        ...serviceData,
        id: Date.now(),
        rating: 4.5
      };
      srvs.unshift(newS);
    }
    localStorage.setItem('cm_services', JSON.stringify(srvs));
    return { message: 'Service saved' };
  }

  async adminToggleUser(userId) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/toggle-status`, { method: 'POST' });
        if (res.ok) return await res.json();
      } catch (e) {}
    }

    let users = JSON.parse(localStorage.getItem('cm_users') || '[]');
    const u = users.find(usr => usr.id === Number(userId));
    if (u) {
      if (u.role === 'admin') throw new Error('Cannot deactivate admin');
      u.is_active = u.is_active ? 0 : 1;
      localStorage.setItem('cm_users', JSON.stringify(users));
      return { message: `User status updated`, is_active: u.is_active };
    }
    throw new Error('User not found');
  }

  // --- Feedback APIs ---
  async getFeedbacks(filters = {}) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const queryParams = new URLSearchParams();
        if (filters.type && filters.type !== 'All') queryParams.append('type', filters.type);
        if (filters.min_rating) queryParams.append('min_rating', filters.min_rating);
        const res = await fetch(`${API_BASE_URL}/feedback?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          return data;
        }
      } catch (e) {
        console.warn('Backend feedback fetch failed, falling back to local:', e);
      }
    }

    let list = JSON.parse(localStorage.getItem('cm_feedbacks') || '[]');
    if (filters.type && filters.type !== 'All') {
      list = list.filter(f => f.feedback_type === filters.type);
    }
    if (filters.min_rating) {
      list = list.filter(f => f.rating >= Number(filters.min_rating));
    }
    
    // Sort newest first
    list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

    // Calculate stats
    const total = list.length;
    const avg = total > 0 ? (list.reduce((sum, item) => sum + item.rating, 0) / total) : 4.8;
    const fiveStar = list.filter(f => f.rating === 5).length;
    const fourStar = list.filter(f => f.rating === 4).length;
    const satisfaction = total > 0 ? Math.round(((fiveStar + fourStar) / total) * 100) : 98;

    return {
      feedbacks: list,
      stats: {
        total_feedbacks: total,
        avg_rating: Math.round(avg * 10) / 10,
        satisfaction_percentage: satisfaction,
        five_star: fiveStar,
        four_star: fourStar,
        three_star: list.filter(f => f.rating === 3).length,
        two_star: list.filter(f => f.rating === 2).length,
        one_star: list.filter(f => f.rating === 1).length
      }
    };
  }

  async submitFeedback(feedbackData) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feedbackData)
        });
        if (res.ok) {
          const result = await res.json();
          // Also sync to local
          const localList = JSON.parse(localStorage.getItem('cm_feedbacks') || '[]');
          localList.unshift(result.feedback);
          localStorage.setItem('cm_feedbacks', JSON.stringify(localList));
          return result;
        }
      } catch (e) {
        console.warn('Backend feedback submit failed, falling back to local:', e);
      }
    }

    // Local fallback
    const localList = JSON.parse(localStorage.getItem('cm_feedbacks') || '[]');
    const currentUser = this.getCurrentUser();
    const newEntry = {
      id: Date.now(),
      user_id: currentUser ? currentUser.id : null,
      name: feedbackData.name || (currentUser ? currentUser.full_name : 'Traveler'),
      email: feedbackData.email || (currentUser ? currentUser.email : 'traveler@citymate.com'),
      feedback_type: feedbackData.feedback_type || 'General Experience',
      rating: Number(feedbackData.rating) || 5,
      subject: feedbackData.subject || '',
      message: feedbackData.message || '',
      tags: feedbackData.tags || '',
      status: 'Reviewed',
      user_pic: currentUser ? currentUser.profile_pic : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    localList.unshift(newEntry);
    localStorage.setItem('cm_feedbacks', JSON.stringify(localList));
    return {
      message: 'Thank you! Your feedback has been received and helps make CityMate better.',
      feedback: newEntry
    };
  }

  async adminGetFeedbacks() {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/feedback`);
        if (res.ok) {
          const data = await res.json();
          return data.feedbacks;
        }
      } catch (e) {}
    }
    return JSON.parse(localStorage.getItem('cm_feedbacks') || '[]');
  }

  async adminUpdateFeedbackStatus(id, status, adminNotes = '') {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/feedback/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, admin_notes: adminNotes })
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }

    const localList = JSON.parse(localStorage.getItem('cm_feedbacks') || '[]');
    const item = localList.find(f => f.id === Number(id));
    if (item) {
      item.status = status;
      item.admin_notes = adminNotes;
      localStorage.setItem('cm_feedbacks', JSON.stringify(localList));
      return { message: `Feedback #${id} updated to ${status}` };
    }
    throw new Error('Feedback not found');
  }

  async adminDeleteFeedback(id) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/feedback/${id}`, { method: 'DELETE' });
        if (res.ok) return await res.json();
      } catch (e) {}
    }

    let localList = JSON.parse(localStorage.getItem('cm_feedbacks') || '[]');
    localList = localList.filter(f => f.id !== Number(id));
    localStorage.setItem('cm_feedbacks', JSON.stringify(localList));
    return { message: `Feedback #${id} deleted` };
  }

  // ── AI Recommendations ────────────────────────────────────────────────────
  async getRecommendations(params = {}) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const token = localStorage.getItem('cm_basic_token') || localStorage.getItem('cm_auth_credentials');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = 'Basic ' + token;
        const res = await fetch(`${API_BASE_URL}/recommendations`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(params)
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.recommendations && data.recommendations.length > 0) {
            return data.recommendations;
          }
        }
      } catch (e) {
        console.warn('Backend recommendations failed, falling back to local:', e);
      }
    }

    // Local fallback heuristic scoring
    const places = await this.getPlaces(params.city_id ? { city_id: params.city_id } : {});
    const interests = (params.interests || ['nature', 'temple']).map(i => i.toLowerCase());
    const maxDist = Number(params.max_distance) || 50;

    const scored = places.map(p => {
      let score = (p.rating || 4.0) * 12;
      const catSlug = (p.category_slug || '').toLowerCase();
      const desc = ((p.description || '') + ' ' + (p.name || '')).toLowerCase();

      let matchedInterests = 0;
      interests.forEach(interest => {
        if (catSlug.includes(interest) || desc.includes(interest)) {
          score += 25;
          matchedInterests++;
        }
      });

      const dist = p.distance_km || 15;
      if (dist <= maxDist) {
        score += Math.max(0, 15 - (dist * 0.3));
      }

      if (params.budget === 'low' && (p.entry_fee === 0 || p.entry_fee < 50)) score += 15;
      if (params.budget === 'high' && p.rating >= 4.5) score += 15;

      const matchPercent = Math.min(99, Math.max(70, Math.round(score)));
      let reason = `Top rated spot in ${p.city_name || 'the city'} with ${p.rating}★ rating.`;
      if (matchedInterests > 0) {
        reason = `Matches your interest in ${interests.join(' & ')} (${p.category_name || 'Attraction'}).`;
      }

      return {
        ...p,
        recommendation_score: score,
        match_percentage: matchPercent,
        recommendation_reason: reason
      };
    });

    scored.sort((a, b) => b.recommendation_score - a.recommendation_score);
    return scored.slice(0, 10);
  }

  // ── Bookings ─────────────────────────────────────────────────────────────
  async createBooking(payload) {
    let newBooking = null;
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await this._authFetch(`${API_BASE_URL}/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          newBooking = data.booking;
        }
      } catch (e) {
        console.warn('Backend booking error:', e);
      }
    }

    // Always fetch place metadata
    const places = (typeof SEED_DATA !== 'undefined' && SEED_DATA.places) ? SEED_DATA.places : (JSON.parse(localStorage.getItem('cm_places') || '[]'));
    const place = places.find(p => p.id === Number(payload.place_id));

    if (!newBooking) {
      const baseFee = place ? Number(place.entry_fee || 0) : 0;
      const numAdults = parseInt(payload.num_adults) || 1;
      const numChildren = parseInt(payload.num_children) || 0;
      const numSeniors = parseInt(payload.num_seniors) || 0;
      const adultSubtotal = Math.round(baseFee * numAdults * 100) / 100;
      const childSubtotal = Math.round(baseFee * 0.5 * numChildren * 100) / 100;
      const seniorSubtotal = Math.round(baseFee * 0.6 * numSeniors * 100) / 100;
      const subtotal = Math.round((adultSubtotal + childSubtotal + seniorSubtotal) * 100) / 100;
      const taxAmount = subtotal > 0 ? Math.round(subtotal * 0.05 * 100) / 100 : 0;
      const totalAmount = payload.total_amount !== undefined ? parseFloat(payload.total_amount) : Math.round((subtotal + taxAmount) * 100) / 100;

      newBooking = {
        id: Date.now(),
        booking_ref: 'CM-TK-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        place_id: Number(payload.place_id),
        place_name: place ? place.name : (payload.place_name || 'Tourist Attraction'),
        image_url: place ? place.image_url : (payload.image_url || 'assets/places/adiyogi.jpg'),
        address: place ? place.address : (payload.address || ''),
        city_name: place ? (place.city_name || '') : (payload.city_name || 'Coimbatore'),
        visitor_name: payload.visitor_name,
        visitor_email: payload.visitor_email,
        visitor_phone: payload.visitor_phone || '',
        visit_date: payload.visit_date,
        visit_time: payload.visit_time || '09:00 AM – 11:00 AM (Morning Slot 1)',
        num_adults: numAdults,
        num_children: numChildren,
        num_seniors: numSeniors,
        adult_subtotal: adultSubtotal,
        child_subtotal: childSubtotal,
        senior_subtotal: seniorSubtotal,
        subtotal: subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        entry_fee_per_person: baseFee,
        opening_hours: place ? place.opening_hours : 'Open Daily',
        special_requests: payload.special_requests || '',
        status: 'confirmed',
        created_at: new Date().toISOString()
      };
    } else {
      if (place) {
        if (!newBooking.image_url) newBooking.image_url = place.image_url;
        if (!newBooking.address) newBooking.address = place.address;
        if (!newBooking.city_name) newBooking.city_name = place.city_name || 'Coimbatore';
      }
      if (payload.num_seniors) newBooking.num_seniors = payload.num_seniors;
    }

    // Save to local storage
    let bookings = [];
    try {
      bookings = JSON.parse(localStorage.getItem('cm_bookings') || '[]');
    } catch (e) {
      bookings = [];
    }
    // Remove if already exists with same ref, then unshift
    bookings = bookings.filter(b => b.booking_ref !== newBooking.booking_ref);
    bookings.unshift(newBooking);
    try {
      localStorage.setItem('cm_bookings', JSON.stringify(bookings));
    } catch (e) {}

    return { message: 'Booking confirmed!', booking: newBooking };
  }

  async getMyBookings() {
    let onlineBookings = [];
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await this._authFetch(`${API_BASE_URL}/bookings`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.bookings) {
            onlineBookings = data.bookings;
          }
        }
      } catch (e) {
        console.warn('Backend getMyBookings error:', e);
      }
    }

    let localBookings = [];
    try {
      localBookings = JSON.parse(localStorage.getItem('cm_bookings') || '[]');
    } catch (e) {
      localBookings = [];
    }

    // Merge online and local bookings by booking_ref (deduplicate, most recent first)
    const map = new Map();
    // Add local first
    localBookings.forEach(b => {
      if (b && b.booking_ref) map.set(b.booking_ref, b);
    });
    // Add online (overwriting or complementing)
    onlineBookings.forEach(b => {
      if (b && b.booking_ref) {
        const existing = map.get(b.booking_ref) || {};
        map.set(b.booking_ref, { ...existing, ...b });
      }
    });

    let merged = Array.from(map.values());
    if (merged.length === 0 && typeof SEED_DATA !== 'undefined' && SEED_DATA.bookings) {
      merged = [...SEED_DATA.bookings];
    }

    // Sort by created_at or id descending
    merged.sort((a, b) => (new Date(b.created_at || b.visit_date || 0)) - (new Date(a.created_at || a.visit_date || 0)));

    // Persist merged set locally
    try {
      localStorage.setItem('cm_bookings', JSON.stringify(merged));
    } catch (e) {}

    return { bookings: merged, count: merged.length };
  }

  async cancelBooking(bookingId) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await this._authFetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, { method: 'PUT' });
        if (res.ok) return await res.json();
        const err = await res.json();
        throw new Error(err.error || 'Cancel failed');
      } catch (e) { throw e; }
    }
    let bookings = JSON.parse(localStorage.getItem('cm_bookings') || '[]');
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx >= 0) {
      bookings[idx].status = 'cancelled';
      localStorage.setItem('cm_bookings', JSON.stringify(bookings));
    }
    return { message: 'Booking cancelled.' };
  }

  async lookupBooking(bookingRef, email = '') {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const queryParams = new URLSearchParams({ booking_ref: bookingRef });
        if (email) queryParams.append('email', email);
        const res = await this._authFetch(`${API_BASE_URL}/bookings/lookup?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          return data.booking;
        }
      } catch (e) {
        console.warn('Backend lookupBooking error:', e);
      }
    }

    // Local storage fallback
    const bookings = JSON.parse(localStorage.getItem('cm_bookings') || '[]');
    const match = bookings.find(b => {
      const matchRef = b.booking_ref && b.booking_ref.toLowerCase() === bookingRef.toLowerCase();
      if (!matchRef) return false;
      if (email) return b.visitor_email && b.visitor_email.toLowerCase() === email.toLowerCase();
      return true;
    });
    return match || null;
  }

  async getAdminBookings() {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await this._authFetch(`${API_BASE_URL}/admin/bookings`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Admin bookings error:', e);
      }
    }
    const bookings = JSON.parse(localStorage.getItem('cm_bookings') || '[]');
    const totalSales = bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0);
    return {
      bookings: bookings,
      count: bookings.length,
      stats: {
        total_bookings: bookings.length,
        confirmed_bookings: bookings.filter(b => b.status === 'confirmed').length,
        cancelled_bookings: bookings.filter(b => b.status === 'cancelled').length,
        total_sales_revenue: Math.round(totalSales * 100) / 100
      }
    };
  }

  async updateAdminBookingStatus(bookingId, status) {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await this._authFetch(`${API_BASE_URL}/admin/bookings/${bookingId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Update status error:', e);
      }
    }
    const bookings = JSON.parse(localStorage.getItem('cm_bookings') || '[]');
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx >= 0) {
      bookings[idx].status = status;
      localStorage.setItem('cm_bookings', JSON.stringify(bookings));
    }
    return { message: `Booking status updated to ${status}` };
  }

  // --- Exact Routing & Turn-by-Turn Navigation ---
  async getRoute(params = {}) {
    const { start_lat, start_lng, dest_lat, dest_lng, mode = 'driving' } = params;
    
    // 1. Direct client-side OSRM call (Fastest, zero proxy overhead)
    try {
      const osrmMode = mode === 'driving' ? 'driving' : (mode === 'walking' ? 'foot' : 'bike');
      const osrmUrl = `https://router.project-osrm.org/route/v1/${osrmMode}/${start_lng},${start_lat};${dest_lng},${dest_lat}?overview=full&geometries=geojson&steps=true`;
      const response = await fetch(osrmUrl, { cache: 'force-cache' });
      if (response.ok) {
        const data = await response.json();
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          return data;
        }
      }
    } catch (err) {
      console.warn('Direct OSRM fetch failed or rate-limited, attempting backend proxy...', err);
    }

    // 2. CityMate Backend API Proxy (reliable with server-side caching)
    try {
      const proxyUrl = `${API_BASE_URL}/route?start_lat=${start_lat}&start_lng=${start_lng}&dest_lat=${dest_lat}&dest_lng=${dest_lng}&mode=${mode}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          return data;
        }
      }
    } catch (err) {
      console.warn('Backend route proxy error, activating resilient road route generator...', err);
    }

    // 3. Resilient Road Route Fallback (Ensures the user never sees a broken map or dead-end)
    return this.generateSimulatedRoadRoute(start_lat, start_lng, dest_lat, dest_lng, mode);
  }

  generateSimulatedRoadRoute(startLat, startLng, destLat, destLng, mode = 'driving') {
    // Great circle haversine calculation
    const R = 6371e3; // meters
    const toRad = deg => deg * Math.PI / 180;
    const phi1 = toRad(startLat);
    const phi2 = toRad(destLat);
    const deltaPhi = toRad(destLat - startLat);
    const deltaLambda = toRad(destLng - startLng);
    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightDistance = R * c;

    // Road factor: Real city & highway routes are ~1.25x to 1.35x longer than straight lines
    const roadFactor = 1.28;
    const totalDistance = Math.max(250, straightDistance * roadFactor);

    // Speed in m/s: driving ~40 km/h (11.1 m/s), cycling ~15 km/h (4.16 m/s), walking ~4.5 km/h (1.25 m/s)
    let speedMs = 11.1;
    if (mode === 'walking') speedMs = 1.25;
    else if (mode === 'bike') speedMs = 4.16;
    const totalDuration = Math.round(totalDistance / speedMs);

    // Generate realistic curved road waypoints along the route
    const numPoints = 16;
    const coordinates = [];
    const steps = [];

    const roadNames = [
      'City Access Road',
      'Grand Southern Trunk Rd',
      'Collectorate Bypass Avenue',
      'Heritage Circle',
      'Destination Approach Road'
    ];

    for (let i = 0; i <= numPoints; i++) {
      const frac = i / numPoints;
      // Linear interpolation + slight perpendicular road curvature
      const latInterp = startLat + frac * (destLat - startLat);
      const lngInterp = startLng + frac * (destLng - startLng);
      
      const curveAmount = Math.sin(frac * Math.PI) * 0.0035 * (i % 2 === 0 ? 1 : -0.7);
      const ptLng = lngInterp + curveAmount;
      const ptLat = latInterp + (curveAmount * 0.4);
      coordinates.push([ptLng, ptLat]);
    }

    // Generate turn steps
    const stepCount = 5;
    const distPerStep = totalDistance / stepCount;
    const durPerStep = totalDuration / stepCount;

    for (let s = 0; s < stepCount; s++) {
      const isStart = s === 0;
      const isEnd = s === stepCount - 1;
      const coordIdx = Math.min(coordinates.length - 1, Math.floor((s / stepCount) * coordinates.length));
      const loc = coordinates[coordIdx];

      steps.push({
        name: roadNames[s % roadNames.length],
        distance: Math.round(distPerStep),
        duration: Math.round(durPerStep),
        maneuver: {
          type: isStart ? 'depart' : (isEnd ? 'arrive' : 'turn'),
          modifier: isStart ? 'forward' : (isEnd ? 'straight' : (s % 2 === 1 ? 'right' : 'left')),
          location: loc
        }
      });
    }

    return {
      code: 'Ok',
      routes: [{
        distance: totalDistance,
        duration: totalDuration,
        weight_name: 'routability',
        weight: totalDuration,
        geometry: {
          coordinates: coordinates,
          type: 'LineString'
        },
        legs: [{
          distance: totalDistance,
          duration: totalDuration,
          steps: steps
        }]
      }]
    };
  }

  // Helper: authenticated fetch using stored Basic Auth credentials
  async _authFetch(url, options = {}) {
    const creds = localStorage.getItem('cm_basic_token') || localStorage.getItem('cm_auth_credentials');
    const headers = { ...(options.headers || {}) };
    if (creds) headers['Authorization'] = 'Basic ' + creds;
    return fetch(url, { ...options, headers });
  }
}

// Global API instance
window.api = new ApiService();

