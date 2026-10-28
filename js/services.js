/**
 * CITYMATE — Essential Services & Directory Controller
 * Connects directly to Supabase PostgreSQL "services" and "cities" tables
 * Powers services.html, hotels.html, restaurants.html, and hospitals.html
 */

(function () {
  'use strict';

  class CityMateServicesManager {
    constructor() {
      this.services = [];
      this.cities = [];
      this.activeServiceType = 'all'; // 'all', 'Hotel', 'Restaurant', 'Hospital', 'ATM', 'Petrol Bunk', etc.
      this.selectedCityId = 'all';
      this.searchQuery = '';
      this.selectedPriceRange = 'all';
      this.selectedStayTier = 'all';
      this.sortBy = 'rating_desc';
    }

    getClient() {
      return window.citymateSupabase ? window.citymateSupabase.getClient() : null;
    }

    /**
     * Fetch all cities for dropdown
     */
    async fetchCities() {
      const client = this.getClient();
      if (client) {
        try {
          const { data, error } = await client
            .from('cities')
            .select('*')
            .order('name', { ascending: true });
          if (!error && data && data.length > 0) {
            this.cities = data;
            return data;
          }
        } catch (e) {
          console.warn('[CityMate Services] Cities fetch error:', e);
        }
      }

      if (typeof SEED_DATA !== 'undefined' && SEED_DATA.cities) {
        this.cities = SEED_DATA.cities;
      }
      return this.cities;
    }

    /**
     * Populate City Select dropdown in the UI
     */
    async initCityDropdown(selectId = 'services-city-select') {
      const select = document.getElementById(selectId);
      if (!select) return;

      const cities = await this.fetchCities();
      select.innerHTML = '<option value="all">All Cities & Regions</option>' +
        cities.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

      select.value = this.selectedCityId;
      select.addEventListener('change', (e) => {
        this.selectedCityId = e.target.value;
        this.renderServicesGrid();
      });
    }

    /**
     * Fetch services from Supabase or rich seed data
     */
    async fetchServices() {
      const client = this.getClient();

      if (client) {
        try {
          let query = client
            .from('services')
            .select(`
              id,
              city_id,
              name,
              service_type,
              description,
              address,
              phone,
              image_url,
              latitude,
              longitude,
              rating,
              created_at,
              cities ( id, name, state )
            `);

          // City filter
          if (this.selectedCityId && this.selectedCityId !== 'all') {
            query = query.eq('city_id', Number(this.selectedCityId));
          }

          // Service type filter
          if (this.activeServiceType && this.activeServiceType !== 'all') {
            query = query.ilike('service_type', `%${this.activeServiceType}%`);
          }

          // Search query
          if (this.searchQuery && this.searchQuery.trim()) {
            query = query.ilike('name', `%${this.searchQuery.trim()}%`);
          }

          query = query.order('rating', { ascending: false });

          const { data, error } = await query;
          if (!error && data && data.length > 0) {
            this.services = data.map(s => ({
              id: s.id,
              city_id: s.city_id,
              city_name: s.cities ? s.cities.name : 'Tamil Nadu',
              name: s.name,
              service_type: s.service_type,
              description: s.description,
              address: s.address,
              phone: s.phone,
              image_url: s.image_url,
              lat: s.latitude,
              lng: s.longitude,
              rating: s.rating || 4.5,
              price_level: s.price_level || '$$',
              price_per_night: s.price_per_night || 2800,
              amenities: s.amenities || ['Free WiFi', 'Breakfast Included', 'Air Conditioning'],
              stay_tier: s.stay_tier || 'Comfort Stay'
            }));
            return this.services;
          }
        } catch (err) {
          console.warn('[CityMate Services] Supabase query error, applying fallback:', err);
        }
      }

      // Offline / Seed Fallback
      let list = (typeof SEED_DATA !== 'undefined' && SEED_DATA.services) ? [...SEED_DATA.services] : [];

      // Normalize seed data service_type if needed
      list = list.map(s => {
        let typeNorm = s.service_type;
        const low = (s.service_type || '').toLowerCase();
        if (low === 'hotel') typeNorm = 'Hotel';
        else if (low === 'restaurant') typeNorm = 'Restaurant';
        else if (low === 'hospital') typeNorm = 'Hospital';
        else if (low === 'atm') typeNorm = 'ATM';
        else if (low.includes('petrol')) typeNorm = 'Petrol Bunk';
        else if (low.includes('rental') || (s.name || '').toLowerCase().includes('car')) typeNorm = 'Car Rental';
        else if ((s.name || '').toLowerCase().includes('bike')) typeNorm = 'Bike Rental';
        else if (low === 'market') typeNorm = 'Market';
        else if (low.includes('restroom')) typeNorm = 'Restroom';

        // Derive price per night if missing
        let nightlyRate = s.price_per_night;
        if (!nightlyRate) {
          const lvl = (s.price_level || '').trim();
          if (lvl === '$') nightlyRate = 1499;
          else if (lvl === '$$') nightlyRate = 3200;
          else if (lvl === '$$$') nightlyRate = 4800;
          else if (lvl === '$$$$') nightlyRate = 7500;
          else nightlyRate = 2800;
        }

        // Derive amenities
        let amenities = s.amenities;
        if (!amenities || !Array.isArray(amenities) || amenities.length === 0) {
          if (s.price_level === '$$$$') {
            amenities = ['Free WiFi', 'Swimming Pool', 'Luxury Spa', 'Fine Dining', 'Air Conditioning'];
          } else if (s.price_level === '$') {
            amenities = ['Free WiFi', 'AC Room', '24/7 Reception', 'Daily Housekeeping'];
          } else {
            amenities = ['Free WiFi', 'Breakfast Included', 'Swimming Pool', 'Air Conditioning'];
          }
        }

        let stayTier = s.stay_tier;
        if (!stayTier) {
          if (s.price_level === '$$$$') stayTier = 'Luxury 5-Star';
          else if (s.price_level === '$$$') stayTier = 'Heritage Resort';
          else if (s.price_level === '$') stayTier = 'Budget Stay';
          else stayTier = 'Comfort Hotel';
        }

        return {
          id: s.id,
          city_id: s.city_id,
          city_name: s.city_name || 'CityMate City',
          name: s.name,
          service_type: typeNorm,
          description: s.opening_status || 'Open and ready to serve travelers.',
          address: s.address,
          phone: s.phone || '+91 1800-425-2489',
          image_url: s.image_url || 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=500',
          lat: s.lat,
          lng: s.lng,
          rating: s.rating || 4.5,
          price_level: s.price_level || '$$',
          price_per_night: nightlyRate,
          amenities: amenities,
          stay_tier: stayTier
        };
      });

      if (this.selectedCityId && this.selectedCityId !== 'all') {
        list = list.filter(s => Number(s.city_id) === Number(this.selectedCityId));
      }

      if (this.activeServiceType && this.activeServiceType !== 'all') {
        list = list.filter(s => s.service_type.toLowerCase().includes(this.activeServiceType.toLowerCase()));
      }

      // Filter by Price Range (Hotels)
      if (this.selectedPriceRange && this.selectedPriceRange !== 'all') {
        if (this.selectedPriceRange === 'budget') {
          list = list.filter(s => (s.price_per_night || 2000) <= 2000 || s.price_level === '$');
        } else if (this.selectedPriceRange === 'mid') {
          list = list.filter(s => {
            const p = s.price_per_night || 3500;
            return (p > 2000 && p <= 5000) || s.price_level === '$$' || s.price_level === '$$$';
          });
        } else if (this.selectedPriceRange === 'luxury') {
          list = list.filter(s => (s.price_per_night || 6000) > 5000 || s.price_level === '$$$$');
        }
      }

      // Filter by Stay Tier (Hotels)
      if (this.selectedStayTier && this.selectedStayTier !== 'all') {
        const tier = this.selectedStayTier.toLowerCase();
        list = list.filter(s => (s.stay_tier || '').toLowerCase().includes(tier));
      }

      if (this.searchQuery && this.searchQuery.trim()) {
        const q = this.searchQuery.trim().toLowerCase();
        list = list.filter(s => 
          s.name.toLowerCase().includes(q) || 
          (s.address || '').toLowerCase().includes(q) ||
          (s.city_name || '').toLowerCase().includes(q) ||
          (s.stay_tier || '').toLowerCase().includes(q)
        );
      }

      // Sorting
      if (this.sortBy === 'price_asc') {
        list.sort((a, b) => (a.price_per_night || 2500) - (b.price_per_night || 2500));
      } else if (this.sortBy === 'price_desc') {
        list.sort((a, b) => (b.price_per_night || 2500) - (a.price_per_night || 2500));
      } else if (this.sortBy === 'name_asc') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      this.services = list;
      return this.services;
    }

    /**
     * Render Services Grid into DOM
     */
    async renderServicesGrid(containerId = 'services-grid') {
      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-secondary);">
          <i class="fa-solid fa-spinner fa-spin" style="font-size: 2.2rem; color: var(--primary-light);"></i>
          <p style="margin-top: 14px; font-weight: 600;">Finding verified hotels and accommodations...</p>
        </div>
      `;

      const services = await this.fetchServices();

      // Update count badge if present
      const countEl = document.getElementById('hotels-count-badge');
      if (countEl) {
        countEl.textContent = `${services.length} Hotel${services.length === 1 ? '' : 's'} Available`;
      }

      if (!services || services.length === 0) {
        container.innerHTML = `
          <div class="empty-state-box" style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
            <i class="fa-solid fa-hotel empty-state-icon" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 16px;"></i>
            <h3 class="empty-state-title" style="font-size: 1.3rem; color: #fff; margin-bottom: 8px;">No Hotels Found</h3>
            <p class="empty-state-desc" style="color: var(--text-secondary); max-width: 440px; margin: 0 auto 20px;">
              No accommodations match your current filter and price criteria. Try selecting another city or reset filters.
            </p>
            <button class="btn btn-outline btn-sm" onclick="window.servicesManager.resetFilters()">
              <i class="fa-solid fa-rotate-left"></i> Reset All Filters
            </button>
          </div>
        `;
        return;
      }

      container.innerHTML = services.map(s => this.createServiceCardHtml(s)).join('');
    }

    /**
     * Generate HTML for Service / Hotel Card
     */
    createServiceCardHtml(s) {
      const key = (s.service_type || '').toLowerCase();
      const isHotel = key.includes('hotel');
      const isHospital = key.includes('hospital');

      // Hotel specific metadata
      const nightlyRate = s.price_per_night || 2800;
      const stayTier = s.stay_tier || 'Comfort Stay';
      const amenities = Array.isArray(s.amenities) ? s.amenities.slice(0, 3) : ['Free WiFi', 'Breakfast Included'];

      return `
        <div class="service-card hotel-card" data-id="${s.id}" style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); overflow:hidden; display:flex; flex-direction:column; box-shadow:var(--shadow-md); transition:transform 0.25s ease, box-shadow 0.25s ease;">
          <div class="service-card-header" style="position:relative; height:190px; overflow:hidden;">
            <img src="${s.image_url}" alt="${s.name}" loading="lazy" style="width:100%; height:100%; object-fit:cover; transition:transform 0.5s ease;" onerror="this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'" />
            <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(10,15,29,0.9) 0%, transparent 55%);"></div>
            
            <div style="position:absolute; top:12px; left:12px; display:flex; gap:6px; flex-wrap:wrap;">
              <span class="badge ${isHotel ? 'badge-primary' : (isHospital ? 'badge-rose' : 'badge-secondary')}" style="font-weight:700; font-size:0.75rem;">
                <i class="fa-solid ${isHotel ? 'fa-hotel' : (isHospital ? 'fa-hospital' : 'fa-bell-concierge')}"></i> ${isHotel ? stayTier : s.service_type}
              </span>
            </div>

            <div style="position:absolute; top:12px; right:12px; background:rgba(0,0,0,0.7); backdrop-filter:blur(6px); padding:4px 9px; border-radius:14px; font-size:0.82rem; font-weight:700; color:var(--accent-amber); display:flex; align-items:center; gap:4px; border:1px solid rgba(255,255,255,0.15);">
              <i class="fa-solid fa-star"></i> ${Number(s.rating).toFixed(1)}
            </div>

            <div style="position:absolute; bottom:12px; left:14px; right:14px; display:flex; justify-content:space-between; align-items:flex-end;">
              <span style="font-size:0.78rem; color:#bae6fd; font-weight:700;">
                <i class="fa-solid fa-location-dot" style="color:var(--primary-light);"></i> ${s.city_name}
              </span>
              ${isHotel ? `
                <div style="text-align:right;">
                  <strong style="font-size:1.15rem; color:#fff; font-weight:800; text-shadow:0 2px 4px rgba(0,0,0,0.5);">₹${nightlyRate.toLocaleString()}</strong>
                  <span style="font-size:0.72rem; color:#cbd5e1; display:block; margin-top:-2px;">/ night</span>
                </div>
              ` : ''}
            </div>
          </div>

          <div class="service-card-body" style="padding:18px; display:flex; flex-direction:column; flex:1; justify-content:space-between;">
            <div>
              <h3 class="service-card-title" style="font-size:1.1rem; font-weight:800; color:#fff; margin-bottom:6px; line-height:1.3;">${s.name}</h3>
              <p style="font-size:0.83rem; color:var(--text-secondary); margin-bottom:12px; line-height:1.4;">
                <i class="fa-solid fa-map-pin" style="color:var(--secondary-light); margin-right:4px;"></i>
                ${s.address || 'Central City Location'}
              </p>

              ${isHotel && amenities.length > 0 ? `
                <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px;">
                  ${amenities.map(a => `
                    <span style="font-size:0.72rem; background:rgba(2,132,199,0.1); border:1px solid rgba(56,189,248,0.2); border-radius:6px; padding:3px 8px; color:#bae6fd; font-weight:600;">
                      <i class="fa-solid fa-circle-check" style="color:#10b981; font-size:0.68rem; margin-right:4px;"></i>${a}
                    </span>
                  `).join('')}
                </div>
              ` : ''}
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; padding-top:10px; border-top:1px solid var(--border-subtle); flex-wrap:wrap; gap:8px;">
                ${s.phone ? `
                  <a href="tel:${s.phone.replace(/[^0-9+]/g, '')}" class="service-phone-link" style="font-size:0.82rem; color:var(--text-secondary); text-decoration:none; display:inline-flex; align-items:center; gap:6px;" title="Click to Call">
                    <i class="fa-solid fa-phone" style="color:var(--primary-light);"></i> ${s.phone}
                  </a>
                ` : `
                  <span style="font-size:0.82rem; color:var(--text-muted);"><i class="fa-solid fa-circle-check" style="color:var(--accent-emerald);"></i> Verified Listing</span>
                `}
                <span style="font-size:0.75rem; color:#10b981; font-weight:600;"><i class="fa-solid fa-bolt"></i> Instant Confirmation</span>
              </div>

              <!-- Action Buttons -->
              <div class="service-card-footer" style="display:grid; grid-template-columns: ${isHotel ? '1fr 1fr 1.3fr' : '1fr 1fr'}; gap:8px;">
                ${s.phone ? `
                  <a href="tel:${s.phone.replace(/[^0-9+]/g, '')}" class="btn btn-secondary btn-sm" style="text-decoration:none; padding:7px 8px; font-size:0.8rem; display:flex; align-items:center; justify-content:center; gap:4px;">
                    <i class="fa-solid fa-phone"></i> Call
                  </a>
                ` : ''}
                
                <button type="button" class="btn btn-secondary btn-sm" style="padding:7px 8px; font-size:0.8rem; display:flex; align-items:center; justify-content:center; gap:4px;" onclick="window.servicesManager.openDirections(${s.lat}, ${s.lng}, '${s.name.replace(/'/g, "\\'")}')">
                  <i class="fa-solid fa-location-arrow"></i> Map
                </button>

                ${isHotel ? `
                  <button type="button" class="btn btn-primary btn-sm" style="font-weight:700; background:linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); box-shadow:0 4px 12px rgba(13,148,136,0.3); border:none; padding:7px 10px; font-size:0.82rem; display:flex; align-items:center; justify-content:center; gap:5px;" onclick="window.hotelBookingCtrl.openBookingModal(${s.id})">
                    <i class="fa-solid fa-calendar-check"></i> Book Stay
                  </button>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    /**
     * Open map directions within the project itself
     */
    openDirections(lat, lng, name) {
      if (lat && lng) {
        window.location.href = `map.html?destination=${lat},${lng}&name=${encodeURIComponent(name || '')}`;
      } else {
        window.location.href = `map.html?search=${encodeURIComponent(name || '')}`;
      }
    }

    /**
     * Filter controls
     */
    setServiceType(type, btnElement) {
      this.activeServiceType = type;
      document.querySelectorAll('.category-pill').forEach(el => el.classList.remove('active'));
      if (btnElement) btnElement.classList.add('active');
      this.renderServicesGrid();
    }

    setCityFilter(cityId) {
      this.selectedCityId = cityId;
      this.renderServicesGrid();
    }

    setPriceFilter(priceRange) {
      this.selectedPriceRange = priceRange;
      this.renderServicesGrid();
    }

    setStayTierFilter(tier) {
      this.selectedStayTier = tier;
      this.renderServicesGrid();
    }

    setSortBy(sortBy) {
      this.sortBy = sortBy;
      this.renderServicesGrid();
    }

    setSearchQuery(q) {
      this.searchQuery = q;
      this.renderServicesGrid();
    }

    resetFilters() {
      this.selectedCityId = 'all';
      if (!this.lockedType) {
        this.activeServiceType = 'all';
      }
      this.searchQuery = '';
      this.selectedPriceRange = 'all';
      this.selectedStayTier = 'all';
      this.sortBy = 'rating_desc';

      const searchInput = document.getElementById('services-search-input');
      if (searchInput) searchInput.value = '';

      const citySelect = document.getElementById('services-city-select');
      if (citySelect) citySelect.value = 'all';

      const priceSelect = document.getElementById('hotel-price-filter');
      if (priceSelect) priceSelect.value = 'all';

      const tierSelect = document.getElementById('hotel-tier-filter');
      if (tierSelect) tierSelect.value = 'all';

      const sortSelect = document.getElementById('hotel-sort-select');
      if (sortSelect) sortSelect.value = 'rating_desc';

      document.querySelectorAll('.category-pill').forEach(el => {
        el.classList.toggle('active', el.dataset.type === (this.lockedType || 'all'));
      });

      this.renderServicesGrid();
    }
  }

  // Expose singleton
  window.servicesManager = new CityMateServicesManager();
  window.servicesCtrl = window.servicesManager; // alias for backwards compatibility

})();
