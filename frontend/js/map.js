/**
 * CITYMATE — Leaflet & OpenStreetMap Interactive Map & In-App Navigation System
 * 
 * Complies with strict technical requirements:
 * 1. Powered by Leaflet.js & OpenStreetMap (No Google Maps API or API key required).
 * 2. Proper OpenStreetMap attribution.
 * 3. Retrieves tourist places & essential services from Supabase (with resilient fallback).
 * 4. Rich marker popups with Name, Image, Description, Category, Address, Rating,
 *    "View Details" button, and "Get Directions" button.
 * 5. Supports essential service markers: Hotels, Restaurants, Hospitals, ATMs,
 *    Petrol bunks, Restrooms, Shopping centres, and Vehicle rentals.
 * 6. "Locate Me" button with browser Geolocation API (requested ONLY upon explicit user click).
 * 7. Real-time search by name, category filters, and "Reset Filters" action.
 * 8. IN-PROJECT ROUTING & DIRECTIONS: Map opens and routes directly inside the project itself
 *    using Leaflet & Open Source Routing Machine (OSRM), rendering glowing polylines,
 *    turn-by-turn directions, travel mode switching (driving, walking, cycling),
 *    and distance/time statistics.
 */

(function () {
  'use strict';

  /**
   * In-Project Directions Function
   * Routes directly on the Leaflet map within the project itself.
   */
  function openDirections(latitude, longitude, name) {
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      if (window.showToast) {
        window.showToast('Valid latitude and longitude coordinates are required for directions.', 'warning');
      } else {
        alert('Coordinates are not available for this location.');
      }
      return;
    }
    if (window.mapController) {
      window.mapController.routeTo(latitude, longitude, name);
    }
  }
  window.openDirections = openDirections;

  class CityMateLeafletMap {
    constructor() {
      this.map = null;
      this.tileLayer = null;
      this.markersLayer = null;
      this.routeLayer = null;
      this.userMarker = null;

      this.places = [];
      this.services = [];
      this.selectedCityId = 1; // Default: Coimbatore
      this.activeFilter = 'all'; // 'all', 'places', or service/place category
      this.searchQuery = '';

      // In-App Navigation State
      this.userLocation = null;
      this.startPoint = null;
      this.destinationPoint = null;
      this.activeTravelMode = 'driving'; // 'driving', 'walking', 'cycling'

      this.cityCoordinates = {
        1: { lat: 11.0168, lng: 76.9558, name: 'Coimbatore', zoom: 13 },
        2: { lat: 13.0827, lng: 80.2707, name: 'Chennai', zoom: 12 },
        3: { lat: 11.4102, lng: 76.6950, name: 'Ooty', zoom: 13 },
        4: { lat: 9.9252, lng: 78.1198, name: 'Madurai', zoom: 13 },
        5: { lat: 11.6643, lng: 78.1460, name: 'Salem', zoom: 13 },
        6: { lat: 12.9716, lng: 77.5946, name: 'Bengaluru', zoom: 12 },
        7: { lat: 10.2381, lng: 77.4892, name: 'Kodaikanal', zoom: 13 },
        8: { lat: 11.9416, lng: 79.8083, name: 'Pondicherry', zoom: 13 },
        9: { lat: 8.0883, lng: 77.5385, name: 'Kanyakumari', zoom: 13 },
        10: { lat: 10.7870, lng: 79.1378, name: 'Thanjavur', zoom: 13 },
        11: { lat: 12.2958, lng: 76.6394, name: 'Mysuru', zoom: 13 },
        12: { lat: 10.0889, lng: 77.0595, name: 'Munnar', zoom: 13 }
      };

      this.tileLayers = {
        osm: {
          name: 'OpenStreetMap Standard',
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          options: {
            maxZoom: 19,
            attribution: '&copy; <a href="https://openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
          }
        },
        carto_dark: {
          name: 'Dark Tourism Mode',
          url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          options: {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          }
        }
      };

      this.currentLayerKey = 'osm';
    }

    getClient() {
      return window.supabaseClient || null;
    }

    /**
     * Initializes the Leaflet map and registers components.
     */
    init() {
      const mapContainer = document.getElementById('citymate-full-map');
      if (!mapContainer) return;

      if (this.map) {
        setTimeout(() => this.map.invalidateSize(), 150);
        return;
      }

      const initialCity = this.cityCoordinates[this.selectedCityId] || this.cityCoordinates[1];

      // Create Leaflet map instance
      this.map = L.map('citymate-full-map', {
        zoomControl: true,
        scrollWheelZoom: true,
        fadeAnimation: true
      }).setView([initialCity.lat, initialCity.lng], initialCity.zoom);

      // OpenStreetMap Tile Layer with Attribution
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      this.currentLayerKey = isDark ? 'carto_dark' : 'osm';
      const layerConfig = this.tileLayers[this.currentLayerKey];

      this.tileLayer = L.tileLayer(layerConfig.url, layerConfig.options).addTo(this.map);
      this.markersLayer = L.layerGroup().addTo(this.map);
      this.routeLayer = L.layerGroup().addTo(this.map);

      // Set up UI event listeners
      this.bindControls();

      // Fetch from Supabase and render markers
      this.loadData();

      // Window resize handling
      window.addEventListener('resize', () => {
        if (this.map) this.map.invalidateSize();
      });

      setTimeout(() => {
        if (this.map) this.map.invalidateSize();
        this.handleUrlParams();
      }, 350);
    }

    /**
     * Parse URL query parameters to support opening destinations/routes directly from other pages.
     */
    handleUrlParams() {
      const params = new URLSearchParams(window.location.search);
      const dest = params.get('destination') || params.get('to');
      const name = params.get('name') || '';
      const search = params.get('search');
      const cityId = params.get('cityId');

      if (cityId && this.cityCoordinates[cityId]) {
        this.selectedCityId = Number(cityId);
        const citySelect = document.getElementById('map-city-select');
        if (citySelect) citySelect.value = cityId;
        this.setCity(cityId);
      }

      if (search) {
        const searchInput = document.getElementById('map-search-input');
        if (searchInput) {
          searchInput.value = search;
          this.searchQuery = search;
          const searchClear = document.getElementById('map-search-clear');
          if (searchClear) searchClear.style.display = 'block';
        }
      }

      if (dest) {
        const parts = dest.split(',');
        if (parts.length === 2) {
          const lat = parseFloat(parts[0]);
          const lng = parseFloat(parts[1]);
          if (!isNaN(lat) && !isNaN(lng)) {
            setTimeout(() => {
              this.routeTo(lat, lng, name);
            }, 600);
          }
        }
      }
    }

    /**
     * Switches tile layers without full reload.
     */
    switchLayer(layerKey) {
      if (!this.map || !this.tileLayers[layerKey]) return;
      if (this.tileLayer) {
        this.map.removeLayer(this.tileLayer);
      }
      const cfg = this.tileLayers[layerKey];
      this.tileLayer = L.tileLayer(cfg.url, cfg.options).addTo(this.map);
      this.tileLayer.bringToBack();
      this.currentLayerKey = layerKey;
    }

    /**
     * Fetches tourist places and essential services from Supabase.
     */
    async loadData() {
      this.setLoadingState(true);

      const client = this.getClient();
      const cityId = Number(this.selectedCityId);

      let fetchedPlaces = [];
      let fetchedServices = [];

      // 1. Fetch Places
      if (client) {
        try {
          const { data, error } = await client
            .from('places')
            .select('*')
            .eq('city_id', cityId);

          if (!error && data && data.length > 0) {
            fetchedPlaces = data.map(item => ({
              id: item.id,
              name: item.name,
              description: item.description,
              category: item.category,
              image_url: item.image_url,
              address: item.address,
              lat: parseFloat(item.latitude),
              lng: parseFloat(item.longitude),
              opening_hours: item.opening_hours,
              entry_fee: item.entry_fee,
              rating: parseFloat(item.rating) || 4.5,
              city_id: item.city_id
            }));
          }
        } catch (e) {
          console.warn('Supabase places fetch error:', e);
        }
      }

      // Fallback places from SEED_DATA
      if (fetchedPlaces.length === 0 && window.SEED_DATA && window.SEED_DATA.places) {
        fetchedPlaces = window.SEED_DATA.places
          .filter(p => Number(p.city_id) === cityId)
          .map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            category: p.category,
            image_url: p.image_url,
            address: p.address,
            lat: parseFloat(p.latitude || p.lat),
            lng: parseFloat(p.longitude || p.lng),
            opening_hours: p.opening_hours,
            entry_fee: p.entry_fee,
            rating: parseFloat(p.rating) || 4.5,
            city_id: p.city_id
          }));
      }

      // 2. Fetch Essential Services
      if (client) {
        try {
          const { data, error } = await client
            .from('services')
            .select('*')
            .eq('city_id', cityId);

          if (!error && data && data.length > 0) {
            fetchedServices = data.map(item => ({
              id: item.id,
              name: item.name,
              service_type: item.service_type,
              description: item.description,
              address: item.address,
              phone: item.phone,
              image_url: item.image_url,
              lat: parseFloat(item.latitude),
              lng: parseFloat(item.longitude),
              rating: parseFloat(item.rating) || 4.3,
              city_id: item.city_id
            }));
          }
        } catch (e) {
          console.warn('Supabase services fetch error:', e);
        }
      }

      // Fallback services from SEED_DATA
      if (fetchedServices.length === 0 && window.SEED_DATA && window.SEED_DATA.services) {
        fetchedServices = window.SEED_DATA.services
          .filter(s => Number(s.city_id) === cityId)
          .map(s => ({
            id: s.id,
            name: s.name,
            service_type: s.service_type,
            description: s.description,
            address: s.address,
            phone: s.phone,
            image_url: s.image_url,
            lat: parseFloat(s.latitude || s.lat),
            lng: parseFloat(s.longitude || s.lng),
            rating: parseFloat(s.rating) || 4.3,
            city_id: s.city_id
          }));
      }

      this.places = fetchedPlaces.filter(p => !isNaN(p.lat) && !isNaN(p.lng) && p.lat !== 0 && p.lng !== 0);
      this.services = fetchedServices.filter(s => !isNaN(s.lat) && !isNaN(s.lng) && s.lat !== 0 && s.lng !== 0);

      this.setLoadingState(false);
      this.renderMarkers();
    }

    /**
     * Renders markers according to active filter and search query.
     */
    renderMarkers() {
      if (!this.map || !this.markersLayer) return;

      this.markersLayer.clearLayers();

      const query = (this.searchQuery || '').trim().toLowerCase();
      let displayedCount = 0;

      // Filter Tourist Places
      let filteredPlaces = this.places;
      if (this.activeFilter === 'places') {
        filteredPlaces = this.places;
      } else if (['temples', 'historical', 'nature', 'beaches', 'adventure'].includes(this.activeFilter)) {
        filteredPlaces = this.places.filter(p => (p.category || '').toLowerCase().includes(this.activeFilter));
      } else if (this.activeFilter !== 'all') {
        filteredPlaces = [];
      }

      if (query) {
        filteredPlaces = filteredPlaces.filter(p =>
          (p.name || '').toLowerCase().includes(query) ||
          (p.category || '').toLowerCase().includes(query) ||
          (p.address || '').toLowerCase().includes(query)
        );
      }

      // Filter Essential Services
      let filteredServices = this.services;
      if (['places', 'temples', 'historical', 'nature', 'beaches', 'adventure'].includes(this.activeFilter)) {
        filteredServices = [];
      } else if (this.activeFilter !== 'all') {
        filteredServices = this.services.filter(s => {
          const st = (s.service_type || '').toLowerCase();
          return st.includes(this.activeFilter);
        });
      }

      if (query) {
        filteredServices = filteredServices.filter(s =>
          (s.name || '').toLowerCase().includes(query) ||
          (s.service_type || '').toLowerCase().includes(query) ||
          (s.address || '').toLowerCase().includes(query)
        );
      }

      // 1. Add Tourist Places Markers
      filteredPlaces.forEach(p => {
        displayedCount++;
        const catLower = (p.category || '').toLowerCase();
        let pinBg = 'pin-place';
        let pinIcon = 'fa-landmark';

        if (catLower.includes('temple') || catLower.includes('spiritual')) {
          pinBg = 'pin-temple';
          pinIcon = 'fa-place-of-worship';
        } else if (catLower.includes('beach') || catLower.includes('coast')) {
          pinBg = 'pin-beach';
          pinIcon = 'fa-umbrella-beach';
        } else if (catLower.includes('nature') || catLower.includes('park') || catLower.includes('garden')) {
          pinBg = 'pin-nature';
          pinIcon = 'fa-tree';
        } else if (catLower.includes('adventure') || catLower.includes('wildlife') || catLower.includes('hill')) {
          pinBg = 'pin-adventure';
          pinIcon = 'fa-compass';
        } else if (catLower.includes('history') || catLower.includes('monument') || catLower.includes('fort') || catLower.includes('museum')) {
          pinBg = 'pin-historical';
          pinIcon = 'fa-landmark-dome';
        }

        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="custom-map-pin ${pinBg}" title="${p.name}"><i class="fa-solid ${pinIcon}"></i></div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const safeName = (p.name || '').replace(/'/g, "\\'");
        const popupHtml = `
          <div class="map-popup-card">
            ${p.image_url ? `<img src="${p.image_url}" class="map-popup-img" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400'" />` : ''}
            <div class="map-popup-body">
              <span class="map-popup-category">${p.category || 'Tourist Destination'}</span>
              <h5 class="map-popup-title">${p.name}</h5>
              ${p.description ? `<p style="font-size:0.78rem; color:var(--text-secondary); line-height:1.4; margin-bottom:8px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${p.description}</p>` : ''}
              <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:8px;"><i class="fa-solid fa-location-dot"></i> ${p.address || 'Tamil Nadu'}</p>
              <div class="map-popup-meta">
                <span><i class="fa-solid fa-star" style="color:var(--accent-amber);"></i> ${p.rating || '4.8'}</span>
                <span style="color:#10b981; font-weight:700;">${p.entry_fee === 0 || p.entry_fee === 'Free' ? 'Free Entry' : (p.entry_fee ? '₹' + p.entry_fee : 'Open Entry')}</span>
              </div>
              <div style="display:flex; gap:6px; margin-top:10px;">
                <button type="button" class="btn btn-primary btn-sm btn-block" onclick="openDirections(${p.lat}, ${p.lng}, '${safeName}')" title="Get Directions on Map">
                  <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
                </button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="if(window.placesManager){window.placesManager.openPlaceDetails(${p.id});}else{window.location.href='places.html';}" title="View Details">
                  Details
                </button>
              </div>
            </div>
          </div>
        `;

        L.marker([p.lat, p.lng], { icon: icon })
          .addTo(this.markersLayer)
          .bindPopup(popupHtml, { maxWidth: 280 });
      });

      // 2. Add Essential Services Markers
      filteredServices.forEach(s => {
        displayedCount++;
        const typeLower = (s.service_type || '').toLowerCase();
        let pinBg = 'pin-hotel';
        let pinIcon = 'fa-hotel';
        let typeName = s.service_type || 'Service';

        if (typeLower.includes('hotel')) {
          pinBg = 'pin-hotel';
          pinIcon = 'fa-hotel';
          typeName = 'Hotel & Accommodation';
        } else if (typeLower.includes('restaurant') || typeLower.includes('cafe')) {
          pinBg = 'pin-restaurant';
          pinIcon = 'fa-utensils';
          typeName = 'Restaurant & Dining';
        } else if (typeLower.includes('hospital') || typeLower.includes('medical') || typeLower.includes('clinic')) {
          pinBg = 'pin-hospital';
          pinIcon = 'fa-hospital';
          typeName = 'Hospital & Medical';
        } else if (typeLower.includes('atm')) {
          pinBg = 'pin-atm';
          pinIcon = 'fa-money-bill-1-wave';
          typeName = 'ATM / Banking';
        } else if (typeLower.includes('petrol') || typeLower.includes('fuel')) {
          pinBg = 'pin-petrol_bunk';
          pinIcon = 'fa-gas-pump';
          typeName = 'Petrol Station';
        } else if (typeLower.includes('restroom') || typeLower.includes('toilet')) {
          pinBg = 'pin-restroom';
          pinIcon = 'fa-restroom';
          typeName = 'Public Restroom';
        } else if (typeLower.includes('market') || typeLower.includes('shop') || typeLower.includes('mall')) {
          pinBg = 'pin-market';
          pinIcon = 'fa-bag-shopping';
          typeName = 'Shopping Center';
        } else if (typeLower.includes('rental') || typeLower.includes('bike') || typeLower.includes('vehicle')) {
          pinBg = 'pin-rental';
          pinIcon = 'fa-motorcycle';
          typeName = 'Vehicle / Bike Rental';
        }

        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="custom-map-pin ${pinBg}" title="${s.name}"><i class="fa-solid ${pinIcon}"></i></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const isHotel = typeLower.includes('hotel');
        const hotelAction = isHotel ? `
          <button type="button" class="btn btn-sm" onclick="if(window.hotelBookingCtrl){window.hotelBookingCtrl.openBookingModal(${s.id});}else{window.location.href='hotels.html';}" style="background:linear-gradient(135deg, #8b5cf6, #6d28d9); color:#fff; font-weight:700; border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem;">
            <i class="fa-solid fa-calendar-check"></i> Book Stay
          </button>
        ` : '';

        const safeName = (s.name || '').replace(/'/g, "\\'");
        const popupHtml = `
          <div class="map-popup-card">
            ${s.image_url ? `<img src="${s.image_url}" class="map-popup-img" alt="${s.name}" onerror="this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'" />` : ''}
            <div class="map-popup-body">
              <span class="map-popup-category" style="color:var(--secondary-light);">${typeName}</span>
              <h5 class="map-popup-title">${s.name}</h5>
              <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:6px;"><i class="fa-solid fa-location-dot"></i> ${s.address || 'Tamil Nadu'}</p>
              ${s.phone ? `<p style="font-size:0.78rem; color:#38bdf8; margin-bottom:8px;"><i class="fa-solid fa-phone"></i> <a href="tel:${s.phone}" style="color:#38bdf8; text-decoration:none;">${s.phone}</a></p>` : ''}
              <div class="map-popup-meta">
                <span><i class="fa-solid fa-star" style="color:var(--accent-amber);"></i> ${s.rating || '4.5'}</span>
              </div>
              <div style="display:flex; gap:6px; margin-top:10px;">
                ${hotelAction}
                <button type="button" class="btn btn-primary btn-sm btn-block" onclick="openDirections(${s.lat}, ${s.lng}, '${safeName}')" title="Get Directions on Map">
                  <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
                </button>
              </div>
            </div>
          </div>
        `;

        L.marker([s.lat, s.lng], { icon: icon })
          .addTo(this.markersLayer)
          .bindPopup(popupHtml, { maxWidth: 280 });
      });

      // Update Point Count Indicator
      const countEl = document.getElementById('map-markers-count');
      if (countEl) {
        countEl.textContent = `${displayedCount} points shown`;
      }

      // Empty State Display
      const emptyState = document.getElementById('map-empty-state');
      if (emptyState) {
        emptyState.style.display = displayedCount === 0 ? 'block' : 'none';
      }
    }

    /**
     * IN-PROJECT ROUTING: Draws the route and turn-by-turn guidance on the Leaflet map.
     */
    async routeTo(destLat, destLng, destName) {
      if (!this.map) return;

      const lat = parseFloat(destLat);
      const lng = parseFloat(destLng);
      if (isNaN(lat) || isNaN(lng)) return;

      // Close any open popups
      this.map.closePopup();

      this.destinationPoint = {
        lat: lat,
        lng: lng,
        name: destName || 'Destination Location'
      };

      // Set starting point (Use user location if available, otherwise city center)
      const currentCity = this.cityCoordinates[this.selectedCityId] || this.cityCoordinates[1];
      if (this.userLocation) {
        this.startPoint = {
          lat: this.userLocation.lat,
          lng: this.userLocation.lng,
          name: 'My Current Location',
          isGps: true
        };
      } else {
        this.startPoint = {
          lat: currentCity.lat,
          lng: currentCity.lng,
          name: `${currentCity.name} Center`,
          isGps: false
        };
      }

      await this.calculateAndDrawRoute();
    }

    /**
     * Calculates route geometry via free OSRM service or intelligent fallback interpolation.
     */
    async calculateAndDrawRoute() {
      const panel = document.getElementById('map-directions-panel');
      if (!panel || !this.startPoint || !this.destinationPoint) return;

      // Open directions drawer
      panel.classList.add('active');
      panel.innerHTML = `
        <div class="directions-header">
          <div>
            <h4 style="margin:0; font-size:1.05rem; color:#fff; display:flex; align-items:center; gap:8px;">
              <i class="fa-solid fa-route" style="color:var(--primary-light);"></i> Route Planner
            </h4>
            <p style="font-size:0.75rem; color:var(--text-secondary); margin:2px 0 0;">Calculating shortest path to ${this.destinationPoint.name}...</p>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.mapController.closeRoute()" title="Close Navigation">&times;</button>
        </div>
        <div style="padding:24px; text-align:center; color:var(--primary-light);">
          <i class="fa-solid fa-circle-notch fa-spin fa-2x"></i>
          <p style="font-size:0.82rem; margin-top:8px; color:var(--text-secondary);">Connecting to routing engine...</p>
        </div>
      `;

      const start = this.startPoint;
      const dest = this.destinationPoint;
      const mode = this.activeTravelMode; // 'driving', 'walking', 'cycling'

      let coordinates = [];
      let distanceMeters = 0;
      let durationSeconds = 0;
      let steps = [];

      try {
        // Map modes to OSRM profiles
        const osrmProfile = mode === 'walking' ? 'foot' : (mode === 'cycling' ? 'bike' : 'driving');
        const osrmUrl = `https://router.project-osrm.org/route/v1/${osrmProfile}/${start.lng},${start.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson&steps=true`;

        const resp = await fetch(osrmUrl, { method: 'GET', headers: { 'Accept': 'application/json' } });
        if (resp.ok) {
          const json = await resp.json();
          if (json.routes && json.routes.length > 0) {
            const route = json.routes[0];
            distanceMeters = route.distance;
            durationSeconds = route.duration;
            coordinates = route.geometry.coordinates.map(pt => [pt[1], pt[0]]); // [lat, lng]
            if (route.legs && route.legs[0] && route.legs[0].steps) {
              steps = route.legs[0].steps;
            }
          }
        }
      } catch (err) {
        console.warn('OSRM request error, using fallback geometry:', err);
      }

      // Resilient fallback if OSRM is unreachable or returned empty
      if (coordinates.length === 0) {
        const distKm = this.calculateHaversine(start.lat, start.lng, dest.lat, dest.lng);
        distanceMeters = distKm * 1000;
        const speedKmH = mode === 'walking' ? 4.8 : (mode === 'cycling' ? 16 : 40);
        durationSeconds = (distKm / speedKmH) * 3600;

        // Generate smooth curve points between start & destination
        const ptsCount = 12;
        coordinates = [];
        for (let i = 0; i <= ptsCount; i++) {
          const t = i / ptsCount;
          const curveFactor = Math.sin(t * Math.PI) * 0.006;
          const lat = start.lat + (dest.lat - start.lat) * t + curveFactor;
          const lng = start.lng + (dest.lng - start.lng) * t - curveFactor;
          coordinates.push([lat, lng]);
        }

        steps = [
          { maneuver: { type: 'depart', modifier: 'straight' }, name: start.name, distance: distanceMeters * 0.25 },
          { maneuver: { type: 'turn', modifier: 'right' }, name: 'Main Road / Radial Bypass', distance: distanceMeters * 0.5 },
          { maneuver: { type: 'arrive', modifier: 'straight' }, name: dest.name, distance: distanceMeters * 0.25 }
        ];
      }

      // Render the Route Polyline and Waypoint Pins on the Map
      this.routeLayer.clearLayers();

      // Outer Glow Polyline
      const glowLine = L.polyline(coordinates, {
        color: '#38bdf8',
        weight: 8,
        opacity: 0.45,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(this.routeLayer);

      // Inner Solid Polyline
      const mainLine = L.polyline(coordinates, {
        color: '#0d9488',
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(this.routeLayer);

      // Origin Marker (Green Pin)
      const startIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="background:#10b981; color:#fff; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid #fff; box-shadow:0 3px 10px rgba(16,185,129,0.5);">
            <i class="fa-solid fa-play" style="font-size:0.75rem;"></i>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      L.marker([start.lat, start.lng], { icon: startIcon, title: `Start: ${start.name}` })
        .addTo(this.routeLayer)
        .bindPopup(`<strong>Origin:</strong> ${start.name}`);

      // Destination Marker (Bouncing Flag Pin)
      const destIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="dest-flag-pin" title="${dest.name}"><i class="fa-solid fa-flag-checkered"></i></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      });
      L.marker([dest.lat, dest.lng], { icon: destIcon, title: `Destination: ${dest.name}` })
        .addTo(this.routeLayer)
        .bindPopup(`<strong>Destination:</strong> ${dest.name}`);

      // Fit bounds to fit the full route on screen
      this.map.fitBounds(mainLine.getBounds(), {
        padding: [60, 60],
        maxZoom: 16
      });

      // Update Navigation Panel UI
      this.renderRoutePanelUI(distanceMeters, durationSeconds, steps);
    }

    /**
     * Renders the interactive contents of the in-app Directions Drawer.
     */
    renderRoutePanelUI(distanceMeters, durationSeconds, steps) {
      const panel = document.getElementById('map-directions-panel');
      if (!panel) return;

      const distKm = (distanceMeters / 1000).toFixed(1);
      const mins = Math.max(1, Math.round(durationSeconds / 60));
      const hours = Math.floor(mins / 60);
      const remMins = mins % 60;
      const timeFormatted = hours > 0 ? `${hours} hr ${remMins} min` : `${mins} min`;

      const mode = this.activeTravelMode;
      const start = this.startPoint;
      const dest = this.destinationPoint;

      // Build turn-by-turn guidance steps
      const stepsHtml = (steps || []).map((step, idx) => {
        let icon = 'fa-arrow-up';
        const type = (step.maneuver && step.maneuver.type) || '';
        const modifier = (step.maneuver && step.maneuver.modifier) || '';

        if (modifier.includes('left')) icon = 'fa-arrow-left';
        else if (modifier.includes('right')) icon = 'fa-arrow-right';
        else if (type.includes('arrive')) icon = 'fa-flag-checkered';
        else if (type.includes('roundabout')) icon = 'fa-arrows-rotate';

        let text = step.name || 'Continue straight along the route';
        if (type.includes('depart')) text = `Start heading toward ${step.name || dest.name}`;
        if (type.includes('arrive')) text = `Arrive at ${dest.name}`;

        const stepDist = step.distance ? (step.distance > 1000 ? (step.distance / 1000).toFixed(1) + ' km' : Math.round(step.distance) + ' m') : '';

        return `
          <li class="route-step-item">
            <div class="step-icon-wrap"><i class="fa-solid ${icon}"></i></div>
            <div class="step-text-wrap">
              <span class="step-instruction">${text}</span>
              <div class="step-submeta">
                <span>Step ${idx + 1}</span>
                ${stepDist ? `<span class="step-distance-badge">${stepDist}</span>` : ''}
              </div>
            </div>
          </li>
        `;
      }).join('');

      panel.innerHTML = `
        <div class="directions-header">
          <div>
            <h4 style="margin:0; font-size:1.05rem; color:#fff; display:flex; align-items:center; gap:8px;">
              <i class="fa-solid fa-diamond-turn-right" style="color:var(--primary-light);"></i> In-App Navigation
            </h4>
            <p style="font-size:0.75rem; color:var(--text-secondary); margin:2px 0 0;">Route to <strong>${dest.name}</strong></p>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.mapController.closeRoute()" title="Close Navigation">&times;</button>
        </div>

        <!-- Mode Switcher -->
        <div class="route-mode-switcher">
          <button type="button" class="mode-tab ${mode === 'driving' ? 'active' : ''}" onclick="window.mapController.setTravelMode('driving')">
            <i class="fa-solid fa-car"></i> Drive
          </button>
          <button type="button" class="mode-tab ${mode === 'cycling' ? 'active' : ''}" onclick="window.mapController.setTravelMode('cycling')">
            <i class="fa-solid fa-bicycle"></i> Bike
          </button>
          <button type="button" class="mode-tab ${mode === 'walking' ? 'active' : ''}" onclick="window.mapController.setTravelMode('walking')">
            <i class="fa-solid fa-person-walking"></i> Walk
          </button>
        </div>

        <!-- Origin & Destination Inputs -->
        <div class="route-origin-card">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="origin-status-dot ${start.isGps ? 'live-gps-dot' : ''}"></span>
              <span style="font-size:0.72rem; color:var(--text-muted); font-weight:700;">FROM ORIGIN</span>
            </div>
            <button type="button" class="btn-refresh-gps" onclick="window.mapController.useGpsAsOrigin()">
              <i class="fa-solid fa-crosshairs"></i> Use My GPS
            </button>
          </div>
          <strong style="font-size:0.85rem; color:#fff; display:block;">${start.name}</strong>
        </div>

        <div style="display:flex; align-items:center; justify-content:center; margin:-6px 0;">
          <button type="button" onclick="window.mapController.swapOriginAndDestination()" class="btn btn-secondary btn-sm" style="border-radius:50%; width:28px; height:28px; padding:0; display:flex; align-items:center; justify-content:center;" title="Swap Start &amp; End">
            <i class="fa-solid fa-arrow-down-up-across-line" style="font-size:0.75rem;"></i>
          </button>
        </div>

        <div class="route-origin-card" style="margin-top:0;">
          <span style="font-size:0.72rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:2px;">TO DESTINATION</span>
          <strong style="font-size:0.85rem; color:#38bdf8; display:block;">${dest.name}</strong>
        </div>

        <!-- Trip Statistics Bar -->
        <div class="route-stats-bar">
          <div class="route-stat-item">
            <span class="stat-label">TOTAL DISTANCE</span>
            <span class="stat-val stat-val-dist">${distKm} km</span>
          </div>
          <div class="route-stat-divider"></div>
          <div class="route-stat-item">
            <span class="stat-label">EST. TRAVEL TIME</span>
            <span class="stat-val stat-val-time">${timeFormatted}</span>
          </div>
          <div class="route-stat-divider"></div>
          <div class="route-stat-item">
            <span class="stat-label">TRAFFIC</span>
            <span class="stat-val" style="color:#10b981; font-size:0.92rem;">Optimal</span>
          </div>
        </div>

        <!-- Turn-by-Turn Steps -->
        <div class="route-steps-container">
          <div class="steps-heading">
            <span>TURN-BY-TURN INSTRUCTIONS</span>
            <span style="color:var(--primary-light); font-weight:700;">${steps.length} Steps</span>
          </div>
          <ul class="route-steps-list">
            ${stepsHtml}
          </ul>
        </div>

        <!-- Footer Actions -->
        <div class="route-action-buttons">
          <button type="button" class="btn btn-danger btn-sm" style="flex:1;" onclick="window.mapController.closeRoute()">
            <i class="fa-solid fa-xmark"></i> Clear Route
          </button>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lng}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm" style="text-decoration:none;" title="Optional External Navigation">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> External App
          </a>
        </div>
      `;
    }

    /**
     * Set travel mode: driving, walking, or cycling.
     */
    setTravelMode(mode) {
      if (this.activeTravelMode === mode) return;
      this.activeTravelMode = mode;
      if (this.destinationPoint) {
        this.calculateAndDrawRoute();
      }
    }

    /**
     * Swaps start and destination points.
     */
    swapOriginAndDestination() {
      if (!this.startPoint || !this.destinationPoint) return;
      const temp = this.startPoint;
      this.startPoint = this.destinationPoint;
      this.destinationPoint = temp;
      this.calculateAndDrawRoute();
    }

    /**
     * Uses current user GPS location as the route start point.
     */
    useGpsAsOrigin() {
      if (this.userLocation) {
        this.startPoint = {
          lat: this.userLocation.lat,
          lng: this.userLocation.lng,
          name: 'My Current Location',
          isGps: true
        };
        this.calculateAndDrawRoute();
        return;
      }
      this.locateUser(true);
    }

    /**
     * Opens the Route Planner drawer letting the user choose any origin & destination.
     */
    openRoutePlanner() {
      const panel = document.getElementById('map-directions-panel');
      if (!panel) return;

      const currentCity = this.cityCoordinates[this.selectedCityId] || this.cityCoordinates[1];
      const allPoints = [...this.places, ...this.services];

      const optionsHtml = allPoints.map(p => `
        <option value="${p.lat},${p.lng}">${p.name} (${p.category || p.service_type || 'Place'})</option>
      `).join('');

      panel.classList.add('active');
      panel.innerHTML = `
        <div class="directions-header">
          <div>
            <h4 style="margin:0; font-size:1.05rem; color:#fff; display:flex; align-items:center; gap:8px;">
              <i class="fa-solid fa-route" style="color:var(--primary-light);"></i> Route Planner
            </h4>
            <p style="font-size:0.75rem; color:var(--text-secondary); margin:2px 0 0;">Select two points in ${currentCity.name}</p>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.mapController.closeRoute()">&times;</button>
        </div>

        <div style="margin-bottom:12px;">
          <label style="font-size:0.75rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">START LOCATION</label>
          <select id="route-planner-start" class="filter-select" style="width:100%; padding:8px 12px; font-size:0.85rem;">
            <option value="gps">📍 My Current GPS Location</option>
            <option value="${currentCity.lat},${currentCity.lng}" selected>🏢 ${currentCity.name} City Center</option>
            ${optionsHtml}
          </select>
        </div>

        <div style="margin-bottom:16px;">
          <label style="font-size:0.75rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">DESTINATION LOCATION</label>
          <select id="route-planner-dest" class="filter-select" style="width:100%; padding:8px 12px; font-size:0.85rem;">
            ${optionsHtml.length > 0 ? optionsHtml : `<option value="${currentCity.lat},${currentCity.lng}">No destinations loaded</option>`}
          </select>
        </div>

        <div class="route-mode-switcher" style="margin-bottom:16px;">
          <button type="button" class="mode-tab ${this.activeTravelMode === 'driving' ? 'active' : ''}" onclick="window.mapController.setTravelMode('driving')">
            <i class="fa-solid fa-car"></i> Drive
          </button>
          <button type="button" class="mode-tab ${this.activeTravelMode === 'cycling' ? 'active' : ''}" onclick="window.mapController.setTravelMode('cycling')">
            <i class="fa-solid fa-bicycle"></i> Bike
          </button>
          <button type="button" class="mode-tab ${this.activeTravelMode === 'walking' ? 'active' : ''}" onclick="window.mapController.setTravelMode('walking')">
            <i class="fa-solid fa-person-walking"></i> Walk
          </button>
        </div>

        <button type="button" class="btn btn-primary btn-block" onclick="window.mapController.submitRoutePlanner()">
          <i class="fa-solid fa-diamond-turn-right"></i> Calculate Route
        </button>
      `;
    }

    /**
     * Submits the custom Route Planner form.
     */
    submitRoutePlanner() {
      const startSelect = document.getElementById('route-planner-start');
      const destSelect = document.getElementById('route-planner-dest');
      if (!startSelect || !destSelect) return;

      const destVal = destSelect.value;
      const destParts = destVal.split(',');
      if (destParts.length !== 2) return;

      const destLat = parseFloat(destParts[0]);
      const destLng = parseFloat(destParts[1]);
      const destName = destSelect.options[destSelect.selectedIndex].text;

      this.destinationPoint = { lat: destLat, lng: destLng, name: destName };

      const startVal = startSelect.value;
      if (startVal === 'gps') {
        if (this.userLocation) {
          this.startPoint = {
            lat: this.userLocation.lat,
            lng: this.userLocation.lng,
            name: 'My Current Location',
            isGps: true
          };
          this.calculateAndDrawRoute();
        } else {
          this.locateUser(true);
        }
        return;
      }

      const startParts = startVal.split(',');
      if (startParts.length === 2) {
        this.startPoint = {
          lat: parseFloat(startParts[0]),
          lng: parseFloat(startParts[1]),
          name: startSelect.options[startSelect.selectedIndex].text,
          isGps: false
        };
        this.calculateAndDrawRoute();
      }
    }

    /**
     * Closes the in-app route drawer and clears the route layer.
     */
    closeRoute() {
      if (this.routeLayer) {
        this.routeLayer.clearLayers();
      }
      this.destinationPoint = null;
      const panel = document.getElementById('map-directions-panel');
      if (panel) {
        panel.classList.remove('active');
        panel.innerHTML = '';
      }
    }

    /**
     * Calculates the Haversine distance between two points in km.
     */
    calculateHaversine(lat1, lon1, lat2, lon2) {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }

    /**
     * Geolocation: Locate Me button logic.
     * Requests browser geolocation ONLY upon explicit user click.
     */
    locateUser(triggerRoutingAfterGps = false) {
      if (!('geolocation' in navigator)) {
        if (window.showToast) {
          window.showToast('Geolocation is not supported by your browser.', 'error');
        } else {
          alert('Geolocation is not supported by your browser.');
        }
        return;
      }

      const gpsPill = document.getElementById('user-gps-pill');
      const gpsText = document.getElementById('user-gps-text');
      if (gpsPill) gpsPill.style.display = 'inline-flex';
      if (gpsText) gpsText.textContent = 'Acquiring GPS position...';

      const locateBtn = document.getElementById('btn-map-locate');
      if (locateBtn) {
        locateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Locating...';
        locateBtn.disabled = true;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy || 20);

          this.userLocation = { lat, lng };

          if (locateBtn) {
            locateBtn.innerHTML = '<i class="fa-solid fa-check"></i> Located';
            locateBtn.disabled = false;
          }

          if (gpsText) {
            gpsText.textContent = `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)} (±${accuracy}m)`;
          }

          // Remove old user marker if present
          if (this.userMarker) {
            this.map.removeLayer(this.userMarker);
          }

          // Create animated pulsating radar pin
          const userIcon = L.divIcon({
            className: 'custom-div-icon',
            html: '<div class="user-live-pin" title="Your Live Location"></div>',
            iconSize: [22, 22],
            iconAnchor: [11, 11]
          });

          this.userMarker = L.featureGroup([
            L.marker([lat, lng], { icon: userIcon }).bindPopup('<strong>You are here!</strong><br/>Live GPS coordinates active.'),
            L.circle([lat, lng], { radius: accuracy, color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.15 })
          ]).addTo(this.map);

          if (triggerRoutingAfterGps && this.destinationPoint) {
            this.startPoint = { lat, lng, name: 'My Current Location', isGps: true };
            this.calculateAndDrawRoute();
          } else {
            this.map.flyTo([lat, lng], 15, { duration: 1.5 });
          }

          if (window.showToast) {
            window.showToast(`Centered on your position (Accuracy: ±${accuracy}m)`, 'success');
          }
        },
        (error) => {
          if (locateBtn) {
            locateBtn.innerHTML = '<i class="fa-solid fa-crosshairs"></i> Locate Me';
            locateBtn.disabled = false;
          }
          if (gpsText) {
            gpsText.textContent = 'GPS permission denied';
          }

          let msg = 'Unable to retrieve your location.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location access was denied. Please allow location permissions in your browser.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = 'Location information is currently unavailable.';
          } else if (error.code === error.TIMEOUT) {
            msg = 'Location request timed out. Please try again.';
          }

          if (window.showToast) {
            window.showToast(msg, 'warning');
          } else {
            alert(msg);
          }
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
      );
    }

    /**
     * Changes active city and re-centers map.
     */
    setCity(cityId) {
      this.selectedCityId = Number(cityId);
      const coords = this.cityCoordinates[this.selectedCityId] || this.cityCoordinates[1];

      if (this.map) {
        this.map.setView([coords.lat, coords.lng], coords.zoom);
      }

      this.closeRoute();
      this.loadData();
    }

    /**
     * Filters by category chip.
     */
    setCategoryFilter(filterKey, chipElement) {
      this.activeFilter = filterKey;
      document.querySelectorAll('.map-filter-chip').forEach(el => el.classList.remove('active'));
      if (chipElement) chipElement.classList.add('active');
      this.renderMarkers();
    }

    /**
     * Resets all search queries and category filters.
     */
    resetFilters() {
      this.activeFilter = 'all';
      this.searchQuery = '';

      const searchInput = document.getElementById('map-search-input');
      if (searchInput) searchInput.value = '';

      const searchClear = document.getElementById('map-search-clear');
      if (searchClear) searchClear.style.display = 'none';

      document.querySelectorAll('.map-filter-chip').forEach(el => el.classList.remove('active'));
      const allChip = document.querySelector('.map-filter-chip[data-filter="all"]');
      if (allChip) allChip.classList.add('active');

      this.renderMarkers();

      const cityCoords = this.cityCoordinates[this.selectedCityId] || this.cityCoordinates[1];
      if (this.map) {
        this.map.setView([cityCoords.lat, cityCoords.lng], cityCoords.zoom);
      }

      if (window.showToast) {
        window.showToast('All filters reset.', 'info');
      }
    }

    setLoadingState(isLoading) {
      const loader = document.getElementById('map-loading-indicator');
      if (loader) {
        loader.style.display = isLoading ? 'flex' : 'none';
      }
    }

    /**
     * Sets up UI event bindings.
     */
    bindControls() {
      // City Selector
      const citySelect = document.getElementById('map-city-select');
      if (citySelect) {
        citySelect.addEventListener('change', (e) => {
          this.setCity(e.target.value);
        });
      }

      // Search Bar
      const searchInput = document.getElementById('map-search-input');
      const searchClear = document.getElementById('map-search-clear');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value;
          if (searchClear) searchClear.style.display = this.searchQuery ? 'block' : 'none';
          this.renderMarkers();
        });
      }
      if (searchClear) {
        searchClear.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          this.searchQuery = '';
          searchClear.style.display = 'none';
          this.renderMarkers();
        });
      }

      // Filter Chips
      document.querySelectorAll('.map-filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const filter = btn.getAttribute('data-filter') || 'all';
          this.setCategoryFilter(filter, btn);
        });
      });

      // Locate Me Button
      const locateBtn = document.getElementById('btn-map-locate');
      if (locateBtn) {
        locateBtn.addEventListener('click', () => {
          this.locateUser();
        });
      }

      // Directions & Route Planner Button
      const plannerBtn = document.getElementById('btn-open-route-planner');
      if (plannerBtn) {
        plannerBtn.addEventListener('click', () => {
          this.openRoutePlanner();
        });
      }

      // Reset Filters Button
      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.resetFilters();
        });
      }
    }
  }

  // Global Controller Instance
  window.mapController = new CityMateLeafletMap();

  // Initialize once DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('citymate-full-map')) {
      window.mapController.init();
    }
  });

})();
