/**
 * CityMate - Tourist Spot Online Ticket Booking System Controller
 * Handles destination listing, ticket search/filters, booking modal with multi-ticket concessions,
 * live price breakdown, confirmation with printable QR E-Tickets, and My Bookings management.
 */

class BookingController {
  constructor() {
    this.currentPlace = null;
    this.bookingHistory = [];
    this.activeCityFilter = 'all';
    this.allPlacesCache = [];
    
    // Tickets view filters
    this.ticketsFilters = {
      search: '',
      city: 'all',
      category: 'all',
      price: 'all',
      sortBy: 'rating_desc'
    };
  }

  // ── 1. TOURIST SPOT LISTING (BOOK TICKETS VIEW) ───────────────────────────
  async renderTicketsSection() {
    const container = document.getElementById('tickets-cards-container');
    if (!container) return;

    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-secondary);">
        <i class="fa-solid fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--secondary-light);"></i>
        <p style="margin-top: 14px;">Loading destinations and ticket rates...</p>
      </div>`;

    try {
      // Load all places across all 12 cities
      if (!this.allPlacesCache || this.allPlacesCache.length === 0) {
        this.allPlacesCache = await window.api.getPlaces({ city_id: 'all', sort_by: 'rating_desc' });
      }
      this.populateDestinationsDropdown();
      this.renderTicketsGrid();
    } catch (err) {
      container.innerHTML = `<p style="grid-column:1/-1; color:#ef4444; padding:30px; text-align:center;">Failed to load ticket destinations: ${err.message}</p>`;
    }
  }

  renderTicketsGrid() {
    const container = document.getElementById('tickets-cards-container');
    if (!container) return;

    let places = [...(this.allPlacesCache || [])];
    const { search, city, category, price, sortBy } = this.ticketsFilters;

    // Filter by Search Query
    if (search) {
      const q = search.toLowerCase().trim();
      places = places.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.city_name && p.city_name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category_name && p.category_name.toLowerCase().includes(q))
      );
    }

    // Filter by City
    if (city && city !== 'all') {
      places = places.filter(p => p.city_name && p.city_name.toLowerCase() === city.toLowerCase());
    }

    // Filter by Category
    if (category && category !== 'all') {
      places = places.filter(p => p.category_slug && p.category_slug.toLowerCase() === category.toLowerCase());
    }

    // Filter by Price Range
    if (price && price !== 'all') {
      if (price === 'free') places = places.filter(p => Number(p.entry_fee) === 0);
      else if (price === 'under50') places = places.filter(p => Number(p.entry_fee) > 0 && Number(p.entry_fee) <= 50);
      else if (price === '50to200') places = places.filter(p => Number(p.entry_fee) > 50 && Number(p.entry_fee) <= 200);
      else if (price === 'above200') places = places.filter(p => Number(p.entry_fee) > 200);
    }

    // Sort By
    if (sortBy === 'rating_desc') places.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === 'fee_asc') places.sort((a, b) => (a.entry_fee || 0) - (b.entry_fee || 0));
    else if (sortBy === 'fee_desc') places.sort((a, b) => (b.entry_fee || 0) - (a.entry_fee || 0));
    else if (sortBy === 'name_asc') places.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    // Update Counter Label
    const countLabel = document.getElementById('tickets-count-label');
    if (countLabel) {
      const cityText = city === 'all' ? 'all 12 cities' : city;
      countLabel.textContent = `Found ${places.length} destination${places.length === 1 ? '' : 's'} available in ${cityText}`;
    }

    if (places.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
          <i class="fa-solid fa-ticket-simple" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 16px;"></i>
          <h3 style="font-size: 1.3rem; margin-bottom: 8px; color:#fff;">No Tourist Spots Found</h3>
          <p style="color: var(--text-secondary); max-width: 440px; margin: 0 auto 20px;">
            No destinations matched your current filter criteria. Try resetting filters or choosing another city.
          </p>
          <button class="btn btn-primary btn-sm" onclick="window.bookingCtrl.resetTicketsFilters()">
            <i class="fa-solid fa-rotate-left"></i> Reset All Filters
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = places.map(p => this._createTicketSpotCardHtml(p)).join('');
  }

  _createTicketSpotCardHtml(place) {
    const fee = Number(place.entry_fee) || 0;
    const adultRate = fee === 0 ? 'Free' : `₹${fee}`;
    const childRate = fee === 0 ? 'Free' : `₹${Math.round(fee * 0.5)}`;
    const seniorRate = fee === 0 ? 'Free' : `₹${Math.round(fee * 0.6)}`;
    const cityName = place.city_name || (window.app && window.app.selectedCity ? window.app.selectedCity.name : 'Tamil Nadu');

    return `
      <div class="place-card ticket-spot-card" data-id="${place.id}" style="display:flex; flex-direction:column; background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-md); transition:var(--transition-normal);">
        <div class="place-card-image-wrap" style="position:relative; height:190px; overflow:hidden;">
          <img src="${place.image_url}" alt="${place.name}" class="place-card-image" loading="lazy" onerror="this.src='assets/places/adiyogi.jpg'" style="width:100%; height:100%; object-fit:cover;" />
          <div class="place-card-overlay"></div>
          
          <div style="position:absolute; top:12px; left:12px; display:flex; gap:6px; flex-wrap:wrap;">
            <span class="badge" style="background:rgba(2,132,199,0.85); backdrop-filter:blur(6px); color:#fff; font-weight:700; font-size:0.75rem; border:1px solid rgba(255,255,255,0.2);">
              <i class="fa-solid fa-location-dot"></i> ${cityName}
            </span>
            <span class="badge" style="background:rgba(17,24,39,0.75); backdrop-filter:blur(6px); color:var(--text-main); font-size:0.75rem;">
              <i class="fa-solid ${place.category_icon || 'fa-landmark'}"></i> ${place.category_name || 'Sightseeing'}
            </span>
          </div>

          <div style="position:absolute; bottom:12px; right:12px; background:rgba(17,24,39,0.85); backdrop-filter:blur(6px); padding:4px 10px; border-radius:14px; font-size:0.8rem; font-weight:700; color:var(--accent-amber); border:1px solid rgba(255,255,255,0.1);">
            <i class="fa-solid fa-star"></i> ${place.rating || 4.5} <span style="font-size:0.7rem; color:var(--text-muted);">(${place.review_count || 120})</span>
          </div>
        </div>

        <div class="place-card-body" style="padding:18px; display:flex; flex-direction:column; flex:1; justify-content:space-between;">
          <div>
            <h3 class="place-card-title" style="font-size:1.15rem; font-weight:800; color:#fff; margin:0 0 4px; line-height:1.3;">${place.name}</h3>
            <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:8px;"><i class="fa-solid fa-map-pin" style="color:var(--secondary-light);"></i> ${place.address || cityName}</p>
            <p class="place-card-desc" style="font-size:0.84rem; color:var(--text-muted); line-height:1.5; margin-bottom:14px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${place.description || 'Iconic tourist destination offering rich culture, breathtaking scenery, and family recreation.'}</p>
          </div>

          <div>
            <!-- Ticket Rates Concession Matrix -->
            <div style="background:rgba(2,132,199,0.08); border:1px solid rgba(56,189,248,0.2); border-radius:8px; padding:8px 12px; margin-bottom:14px; display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; text-align:center;">
              <div>
                <span style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase; display:block;">Adult</span>
                <strong style="font-size:0.92rem; color:var(--accent-emerald);">${adultRate}</strong>
              </div>
              <div style="border-left:1px solid rgba(255,255,255,0.08); border-right:1px solid rgba(255,255,255,0.08);">
                <span style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase; display:block;">Child (-50%)</span>
                <strong style="font-size:0.92rem; color:var(--secondary-light);">${childRate}</strong>
              </div>
              <div>
                <span style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase; display:block;">Senior (-40%)</span>
                <strong style="font-size:0.92rem; color:var(--accent-amber);">${seniorRate}</strong>
              </div>
            </div>

            <!-- Opening hours & Slot info -->
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.78rem; color:var(--text-secondary); margin-bottom:14px;">
              <span><i class="fa-regular fa-clock" style="color:var(--secondary-light);"></i> ${place.opening_hours || 'Open Daily'}</span>
              <span style="color:var(--accent-emerald); font-weight:600;"><i class="fa-solid fa-circle-check"></i> Instant Pass</span>
            </div>

            <!-- Action Buttons -->
            <div style="display:grid; grid-template-columns:1fr 1.2fr; gap:8px;">
              <button class="btn btn-secondary btn-sm" onclick="window.placesCtrl.openPlaceDetails(${place.id})" style="font-weight:600; display:flex; align-items:center; justify-content:center; gap:6px;">
                <i class="fa-solid fa-circle-info"></i> View Details
              </button>
              <button class="btn btn-primary btn-sm" onclick="window.bookingCtrl.openBookingModal(${place.id})" style="font-weight:700; background:linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%); border:none; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 4px 12px rgba(2,132,199,0.3);">
                <i class="fa-solid fa-ticket"></i> Book Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  onTicketsFilterChange() {
    const searchInput = document.getElementById('tickets-search-input');
    const citySelect = document.getElementById('tickets-city-select');
    const catSelect = document.getElementById('tickets-category-select');
    const priceSelect = document.getElementById('tickets-price-select');
    const sortSelect = document.getElementById('tickets-sort-select');

    if (searchInput) this.ticketsFilters.search = searchInput.value;
    if (citySelect) this.ticketsFilters.city = citySelect.value;
    if (catSelect) this.ticketsFilters.category = catSelect.value;
    if (priceSelect) this.ticketsFilters.price = priceSelect.value;
    if (sortSelect) this.ticketsFilters.sortBy = sortSelect.value;

    this.renderTicketsGrid();
  }

  setTicketsCategory(cat, btnEl) {
    document.querySelectorAll('.tickets-chip').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    this.ticketsFilters.category = cat;
    const catSelect = document.getElementById('tickets-category-select');
    if (catSelect) catSelect.value = cat;

    this.renderTicketsGrid();
  }

  resetTicketsFilters() {
    this.ticketsFilters = {
      search: '',
      city: 'all',
      category: 'all',
      price: 'all',
      sortBy: 'rating_desc'
    };

    const sIn = document.getElementById('tickets-search-input');
    if (sIn) sIn.value = '';
    const cSel = document.getElementById('tickets-city-select');
    if (cSel) cSel.value = 'all';
    const catSel = document.getElementById('tickets-category-select');
    if (catSel) catSel.value = 'all';
    const pSel = document.getElementById('tickets-price-select');
    if (pSel) pSel.value = 'all';
    const sSel = document.getElementById('tickets-sort-select');
    if (sSel) sSel.value = 'rating_desc';

    document.querySelectorAll('.tickets-chip').forEach(b => {
      b.classList.toggle('active', b.dataset.cat === 'all');
    });

    this.renderTicketsGrid();
  }

  // ── 2. DESTINATIONS DROPDOWN SELECTOR ─────────────────────────────────────
  populateDestinationsDropdown(selectedPlaceId = null) {
    const select = document.getElementById('bk-destination-select');
    if (!select) return;

    const places = this.allPlacesCache && this.allPlacesCache.length > 0
      ? this.allPlacesCache
      : (typeof SEED_DATA !== 'undefined' && SEED_DATA.places ? SEED_DATA.places : []);

    // Group places by city
    const byCity = {};
    places.forEach(p => {
      const c = p.city_name || 'Tamil Nadu';
      if (!byCity[c]) byCity[c] = [];
      byCity[c].push(p);
    });

    let html = '';
    Object.keys(byCity).sort().forEach(cityName => {
      html += `<optgroup label="📍 ${cityName}">`;
      byCity[cityName].forEach(p => {
        const feeStr = p.entry_fee > 0 ? ` (₹${p.entry_fee})` : ' (Free)';
        html += `<option value="${p.id}">${p.name}${feeStr}</option>`;
      });
      html += `</optgroup>`;
    });

    select.innerHTML = html;
    if (selectedPlaceId) {
      select.value = String(selectedPlaceId);
    }
  }

  onDestinationSelectChange(placeId) {
    if (!placeId) return;
    this.openBookingModal(Number(placeId));
  }

  // ── 3. OPEN BOOKING MODAL (PRE-FILLED OR DIRECT) ──────────────────────────
  async openBookingModal(placeId, placeName, entryFee, openingHours) {
    // Close any other open modals to prevent duplicate backdrop stacking bugs
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      if (m.id !== 'booking-modal') m.classList.remove('active');
    });

    let numId = Number(placeId);

    // Ensure all places are cached for dropdown
    if (!this.allPlacesCache || this.allPlacesCache.length === 0) {
      try {
        this.allPlacesCache = await window.api.getPlaces({ city_id: 'all' });
      } catch (e) {
        this.allPlacesCache = (typeof SEED_DATA !== 'undefined' && SEED_DATA.places) ? SEED_DATA.places : [];
      }
    }

    // If no placeId provided or invalid (direct mode), pick active city spot or first spot
    if (!numId || isNaN(numId)) {
      const activeCityName = (window.app && window.app.selectedCity && window.app.selectedCity.name) ? window.app.selectedCity.name.toLowerCase() : null;
      let cityPlace = activeCityName ? (this.allPlacesCache || []).find(p => p.city_name && p.city_name.toLowerCase() === activeCityName) : null;
      if (!cityPlace && this.allPlacesCache && this.allPlacesCache.length > 0) {
        cityPlace = this.allPlacesCache[0];
      }
      if (!cityPlace && typeof SEED_DATA !== 'undefined' && SEED_DATA.places && SEED_DATA.places.length > 0) {
        cityPlace = SEED_DATA.places[0];
      }
      if (cityPlace) {
        numId = Number(cityPlace.id);
      }
    }

    let found = (this.allPlacesCache || []).find(p => p.id === numId);
    if (!found && typeof SEED_DATA !== 'undefined' && SEED_DATA.places) {
      found = SEED_DATA.places.find(p => p.id === numId);
    }
    if (!found && this.allPlacesCache && this.allPlacesCache.length > 0) {
      found = this.allPlacesCache[0];
      numId = Number(found.id);
    }

    if (found) {
      placeName = placeName || found.name;
      entryFee = (entryFee !== undefined && entryFee !== null) ? entryFee : found.entry_fee;
      openingHours = openingHours || found.opening_hours;
    }

    let user = window.api.getCurrentUser();
    if (!user) {
      user = {
        id: 1,
        username: 'traveler',
        full_name: 'Traveler Guest',
        email: 'traveler@citymate.com',
        role: 'user'
      };
      try {
        localStorage.setItem('cm_current_user', JSON.stringify(user));
        if (!localStorage.getItem('cm_basic_token')) {
          localStorage.setItem('cm_basic_token', btoa('traveler:traveler123'));
        }
      } catch (e) {}
    }

    const cityName = (found && found.city_name) ? found.city_name : (window.app && window.app.selectedCity ? window.app.selectedCity.name : 'Tamil Nadu');

    this.currentPlace = { 
      id: numId, 
      name: placeName || (found ? found.name : 'Tourist Destination'), 
      entryFee: parseFloat(entryFee) || 0, 
      openingHours: openingHours || (found ? found.opening_hours : 'Open Daily'),
      cityName: cityName,
      image_url: found ? found.image_url : '',
      address: found ? found.address : ''
    };

    // Populate and sync destination dropdown
    this.populateDestinationsDropdown(numId);

    // Pre-fill visitor info
    const nameEl  = document.getElementById('bk-visitor-name');
    const emailEl = document.getElementById('bk-visitor-email');
    const phoneEl = document.getElementById('bk-visitor-phone');
    if (nameEl)  nameEl.value  = (user.full_name && user.full_name !== 'Traveler Guest') ? user.full_name : (nameEl.value || '');
    if (emailEl) emailEl.value = (user.email && user.email !== 'traveler@citymate.com') ? user.email : (emailEl.value || '');
    if (phoneEl && user.phone) phoneEl.value = user.phone;

    // Header Place Display
    const nameDisplay = document.getElementById('bk-place-name-display');
    if (nameDisplay) {
      nameDisplay.innerHTML = `<span style="background:rgba(2,132,199,0.2); color:var(--secondary-light); font-weight:700; padding:2px 8px; border-radius:4px; font-size:0.75rem; margin-right:6px;"><i class="fa-solid fa-location-dot"></i> ${cityName}</span> <strong style="color:#fff;">${this.currentPlace.name}</strong>`;
    }
    const feeDisplay = document.getElementById('bk-fee-display');
    if (feeDisplay) feeDisplay.textContent = this.currentPlace.entryFee > 0 ? `Base Entry: ₹${this.currentPlace.entryFee}/person` : 'Free Entry';
    const hoursDisplay = document.getElementById('bk-hours-display');
    if (hoursDisplay) hoursDisplay.textContent = this.currentPlace.openingHours;

    // Set today as minimum date
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('bk-visit-date');
    if (dateInput) {
      dateInput.min = today;
      if (!dateInput.value) dateInput.value = today;
    }

    // Reset ticket counts to defaults
    const adultsIn = document.getElementById('bk-adults');
    const childIn = document.getElementById('bk-children');
    const seniorIn = document.getElementById('bk-seniors');
    if (adultsIn && (!adultsIn.value || parseInt(adultsIn.value) < 1)) adultsIn.value = 1;
    if (childIn) childIn.value = 0;
    if (seniorIn) seniorIn.value = 0;

    this.recalcTotal();

    const modal = document.getElementById('booking-modal');
    if (modal) {
      modal.classList.add('active');
      modal.scrollTop = 0;
      const dialog = modal.querySelector('.modal-dialog, .modal-card');
      if (dialog) dialog.scrollTop = 0;
    }
    const confirmSec = document.getElementById('booking-confirm-section');
    if (confirmSec) confirmSec.style.display = 'none';
    const formSec = document.getElementById('booking-form-section');
    if (formSec) formSec.style.display = 'block';

    // Reset slot selection
    const firstSlot = document.querySelector('.bk-slot-pill');
    if (firstSlot) {
      this.selectSlot('09:00 AM – 11:00 AM (Morning Slot 1)', firstSlot);
    }
    // Uncheck amenity checkboxes
    document.querySelectorAll('.bk-need-checkbox').forEach(cb => { cb.checked = false; });
  }

  openDirectBookingModal() {
    this.openBookingModal();
  }

  selectSlot(slotText, btnElement) {
    document.querySelectorAll('.bk-slot-pill').forEach(btn => {
      btn.classList.remove('active');
      btn.style.borderColor = 'var(--border-subtle)';
      btn.style.background = 'var(--bg-card)';
      btn.style.color = 'var(--text-secondary)';
    });
    if (btnElement) {
      btnElement.classList.add('active');
      btnElement.style.borderColor = 'rgba(56,189,248,0.6)';
      btnElement.style.background = 'rgba(2,132,199,0.2)';
      btnElement.style.color = '#fff';
    }
    const input = document.getElementById('bk-visit-time');
    if (input) input.value = slotText;
    const label = document.getElementById('bk-selected-slot-label');
    if (label) label.textContent = slotText.split('(')[0].trim();
  }

  closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) modal.classList.remove('active');
    this.currentPlace = null;
  }

  // ── 4. LIVE PRICE CALCULATION & BREAKDOWN ─────────────────────────────────
  recalcTotal() {
    if (!this.currentPlace) return;

    const baseFee  = parseFloat(this.currentPlace.entryFee) || 0;
    const adults   = parseInt(document.getElementById('bk-adults') ? document.getElementById('bk-adults').value : 1) || 1;
    const children = parseInt(document.getElementById('bk-children') ? document.getElementById('bk-children').value : 0) || 0;
    const seniors  = parseInt(document.getElementById('bk-seniors') ? document.getElementById('bk-seniors').value : 0) || 0;

    const childRatePerPerson = Math.round(baseFee * 0.5 * 100) / 100;
    const seniorRatePerPerson = Math.round(baseFee * 0.6 * 100) / 100;

    const adultTotal = Math.round(baseFee * adults * 100) / 100;
    const childTotal = Math.round(childRatePerPerson * children * 100) / 100;
    const seniorTotal = Math.round(seniorRatePerPerson * seniors * 100) / 100;
    const subtotal = Math.round((adultTotal + childTotal + seniorTotal) * 100) / 100;
    const taxAmount = subtotal > 0 ? Math.round(subtotal * 0.05 * 100) / 100 : 0.0;
    const grandTotal = Math.round((subtotal + taxAmount) * 100) / 100;

    // Update Live Breakdown Labels
    const baseBadge = document.getElementById('bk-base-rate-badge');
    if (baseBadge) baseBadge.textContent = baseFee === 0 ? 'Free Entry' : `Base Rate: ₹${baseFee} / adult`;

    const aCnt = document.getElementById('bk-adult-count-label');
    const aRate = document.getElementById('bk-adult-rate-label');
    const aSub = document.getElementById('bk-adult-subtotal');
    if (aCnt) aCnt.textContent = adults;
    if (aRate) aRate.textContent = `₹${baseFee}`;
    if (aSub) aSub.textContent = `₹${adultTotal.toFixed(2)}`;

    const cCnt = document.getElementById('bk-child-count-label');
    const cRate = document.getElementById('bk-child-rate-label');
    const cSub = document.getElementById('bk-child-subtotal');
    if (cCnt) cCnt.textContent = children;
    if (cRate) cRate.textContent = `₹${childRatePerPerson}`;
    if (cSub) cSub.textContent = `₹${childTotal.toFixed(2)}`;

    const sCnt = document.getElementById('bk-senior-count-label');
    const sRate = document.getElementById('bk-senior-rate-label');
    const sSub = document.getElementById('bk-senior-subtotal');
    if (sCnt) sCnt.textContent = seniors;
    if (sRate) sRate.textContent = `₹${seniorRatePerPerson}`;
    if (sSub) sSub.textContent = `₹${seniorTotal.toFixed(2)}`;

    const taxSub = document.getElementById('bk-tax-subtotal');
    if (taxSub) taxSub.textContent = taxAmount > 0 ? `₹${taxAmount.toFixed(2)}` : '₹0.00 (Exempt)';

    const totalEl = document.getElementById('bk-total-display');
    if (totalEl) {
      totalEl.textContent = grandTotal === 0 ? 'Free Entry' : `₹${grandTotal.toFixed(2)}`;
    }
  }

  // ── 5. SUBMIT BOOKING & GENERATE CONFIRMATION ─────────────────────────────
  async submitBooking(e) {
    e.preventDefault();
    const btn = document.getElementById('bk-submit-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Confirming Reservation & Generating Pass...';

    // Collect essential needs
    const selectedNeeds = [];
    document.querySelectorAll('.bk-need-checkbox:checked').forEach(cb => {
      selectedNeeds.push(cb.value);
    });
    const customReq = document.getElementById('bk-special') ? document.getElementById('bk-special').value.trim() : '';
    let combinedNotes = selectedNeeds.join(', ');
    if (customReq) {
      combinedNotes = combinedNotes ? `${combinedNotes} | Note: ${customReq}` : customReq;
    }

    const baseFee  = parseFloat(this.currentPlace.entryFee) || 0;
    const adults   = parseInt(document.getElementById('bk-adults').value) || 1;
    const children = parseInt(document.getElementById('bk-children').value) || 0;
    const seniors  = parseInt(document.getElementById('bk-seniors') ? document.getElementById('bk-seniors').value : 0) || 0;

    const adultTotal = Math.round(baseFee * adults * 100) / 100;
    const childTotal = Math.round(baseFee * 0.5 * children * 100) / 100;
    const seniorTotal = Math.round(baseFee * 0.6 * seniors * 100) / 100;
    const subtotal = Math.round((adultTotal + childTotal + seniorTotal) * 100) / 100;
    const taxAmount = subtotal > 0 ? Math.round(subtotal * 0.05 * 100) / 100 : 0.0;
    const grandTotal = Math.round((subtotal + taxAmount) * 100) / 100;

    const payload = {
      place_id:         this.currentPlace.id,
      place_name:       this.currentPlace.name,
      city_name:        this.currentPlace.cityName,
      image_url:        this.currentPlace.image_url,
      address:          this.currentPlace.address,
      visit_date:       document.getElementById('bk-visit-date').value,
      visit_time:       document.getElementById('bk-visit-time').value || '09:00 AM – 11:00 AM (Morning Slot 1)',
      num_adults:       adults,
      num_children:     children,
      num_seniors:      seniors,
      adult_subtotal:   adultTotal,
      child_subtotal:   childTotal,
      senior_subtotal:  seniorTotal,
      subtotal:         subtotal,
      tax_amount:       taxAmount,
      total_amount:     grandTotal,
      visitor_name:     document.getElementById('bk-visitor-name').value.trim(),
      visitor_email:    document.getElementById('bk-visitor-email').value.trim(),
      visitor_phone:    document.getElementById('bk-visitor-phone') ? document.getElementById('bk-visitor-phone').value.trim() : '',
      special_requests: combinedNotes
    };

    try {
      const result = await window.api.createBooking(payload);
      const bookedItem = result.booking;
      if (!this.bookingHistory) this.bookingHistory = [];
      this.bookingHistory.unshift(bookedItem);

      this.showConfirmation(bookedItem);
    } catch (err) {
      window.app.showToast('Booking failed: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-calendar-check"></i> Confirm Booking &amp; Generate E-Ticket';
    }
  }

  // ── 6. BOOKING CONFIRMATION & PRINTABLE PASS MODAL ─────────────────────────
  showConfirmation(booking) {
    document.getElementById('booking-form-section').style.display   = 'none';
    document.getElementById('booking-confirm-section').style.display = 'block';

    const bModal = document.getElementById('booking-modal');
    if (bModal) {
      bModal.scrollTop = 0;
      const bDialog = bModal.querySelector('.modal-dialog, .modal-card');
      if (bDialog) bDialog.scrollTop = 0;
    }

    const cityName = booking.city_name || (this.currentPlace ? this.currentPlace.cityName : 'Destination');
    const totalText = booking.total_amount > 0 ? `₹${parseFloat(booking.total_amount).toFixed(2)}` : 'Free Entry';

    const partyDesc = [
      `${booking.num_adults} Adult${booking.num_adults > 1 ? 's' : ''}`,
      booking.num_children > 0 ? `${booking.num_children} Child${booking.num_children > 1 ? 'ren' : ''}` : null,
      booking.num_seniors > 0 ? `${booking.num_seniors} Senior${booking.num_seniors > 1 ? 's' : ''}` : null
    ].filter(Boolean).join(', ');

    document.getElementById('booking-confirm-section').innerHTML = `
      <div class="booking-success-wrap" style="text-align:center;">
        <div class="booking-success-icon" style="width:68px; height:68px; border-radius:50%; background:rgba(16,185,129,0.18); color:var(--accent-emerald); font-size:2.4rem; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; border:2px solid rgba(16,185,129,0.3);">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h3 class="booking-success-title" style="font-size:1.6rem; font-weight:800; color:#fff; margin-bottom:6px;">Booking Confirmed!</h3>
        <p class="booking-success-sub" style="color:var(--text-secondary); font-size:0.95rem; margin-bottom:20px;">
          Your digital pass for <strong>${booking.place_name}</strong> in <strong style="color:var(--secondary-light);">${cityName}</strong> is verified and issued.
        </p>

        <!-- Ticket Card Receipt -->
        <div class="booking-detail-card" style="text-align:left; background:rgba(0,0,0,0.35); border:1px solid rgba(56,189,248,0.3); border-radius:var(--radius-md); padding:18px; margin-bottom:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:12px; margin-bottom:12px; border-bottom:1px dashed rgba(255,255,255,0.12);">
            <div>
              <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Unique Booking Reference</span>
              <div style="font-family:monospace; font-size:1.25rem; font-weight:800; color:var(--secondary-light); letter-spacing:1.5px;">${booking.booking_ref}</div>
            </div>
            <span class="badge" style="background:rgba(16,185,129,0.2); color:var(--accent-emerald); border:1px solid rgba(16,185,129,0.4); padding:6px 14px; font-weight:800; text-transform:uppercase;">
              ✓ ${booking.status || 'Confirmed'}
            </span>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.88rem; margin-bottom:14px;">
            <div>
              <span style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase;">Destination</span>
              <strong style="color:#fff; display:block;">${booking.place_name}</strong>
              <small style="color:var(--secondary-light);"><i class="fa-solid fa-location-dot"></i> ${cityName}</small>
            </div>
            <div>
              <span style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase;">Visit Date &amp; Slot</span>
              <strong style="color:#fff; display:block;">${this._formatDate(booking.visit_date)}</strong>
              <small style="color:var(--accent-amber);"><i class="fa-regular fa-clock"></i> ${booking.visit_time || 'General Slot'}</small>
            </div>
            <div>
              <span style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase;">Primary Visitor</span>
              <strong style="color:#fff; display:block;">${booking.visitor_name}</strong>
              <small style="color:var(--text-secondary);">${booking.visitor_email}</small>
            </div>
            <div>
              <span style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase;">Party Size</span>
              <strong style="color:#fff; display:block;">${partyDesc}</strong>
              <small style="color:var(--accent-emerald); font-weight:700;">Total: ${totalText}</small>
            </div>
          </div>

          ${booking.special_requests ? `
          <div style="background:rgba(255,255,255,0.03); border-left:3px solid var(--secondary-light); padding:8px 12px; border-radius:4px; font-size:0.8rem; color:#cbd5e1; margin-bottom:10px;">
            <strong style="color:var(--secondary-light);"><i class="fa-solid fa-shield-heart"></i> Inclusions:</strong> ${booking.special_requests}
          </div>` : ''}

          <div style="display:flex; justify-content:center; align-items:center; padding:12px 0 4px;">
            <div style="text-align:center;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(booking.booking_ref)}" alt="QR Pass" style="border-radius:6px; border:2px solid #fff; background:#fff; padding:4px;" />
              <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px;">Scan at venue gate for rapid check-in</div>
            </div>
          </div>
        </div>

        <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
          <button class="btn btn-primary" onclick="window.bookingCtrl.openTicketModal('${booking.booking_ref}')" style="flex:1; min-width:180px;">
            <i class="fa-solid fa-print"></i> Download / Print Ticket
          </button>
          <button class="btn btn-secondary" onclick="window.bookingCtrl.closeBookingModal(); window.app.switchView('bookings');" style="flex:1; min-width:160px;">
            <i class="fa-solid fa-calendar-check"></i> Go to My Bookings
          </button>
          <button class="btn btn-outline" onclick="window.bookingCtrl.closeBookingModal(); window.app.switchView('home');" style="min-width:120px;">
            <i class="fa-solid fa-house"></i> Home
          </button>
        </div>
      </div>
    `;

    window.app.showToast('🎉 Reservation confirmed! Ref: ' + booking.booking_ref, 'success');
  }

  // ── 7. MY BOOKINGS VIEW & CITY FILTER ─────────────────────────────────────
  async renderBookingsView(containerId = 'bookings-list-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div style="text-align:center;padding:40px;color:var(--text-secondary);">
        <i class="fa-solid fa-spinner fa-spin" style="font-size:2rem;color:var(--secondary-light);"></i>
        <p style="margin-top:12px;">Loading your reservations...</p>
      </div>`;

    try {
      const data = await window.api.getMyBookings();
      this.bookingHistory = data.bookings || [];

      if (this.bookingHistory.length === 0) {
        const filterBar = document.getElementById('bookings-city-filter-bar');
        if (filterBar) filterBar.style.display = 'none';

        container.innerHTML = `
          <div class="empty-bookings" style="text-align:center; padding:60px 20px; background:var(--bg-card); border-radius:var(--radius-lg); border:1px dashed var(--border-subtle);">
            <i class="fa-solid fa-calendar-xmark" style="font-size:3rem; color:var(--text-muted); margin-bottom:16px;"></i>
            <h3 style="font-size:1.3rem; margin-bottom:8px; color:#fff;">No Reservations Yet</h3>
            <p style="color:var(--text-secondary); max-width:440px; margin:0 auto 20px;">
              You have not booked any spot tickets yet. Explore destinations across all 12 cities and reserve your tickets online!
            </p>
            <button class="btn btn-primary" onclick="window.app.switchView('tickets')">
              <i class="fa-solid fa-ticket"></i> Explore &amp; Book Tickets
            </button>
          </div>`;
        return;
      }

      this.renderCityFilterBar(this.bookingHistory);
      this.applyCityFilter();
    } catch (err) {
      container.innerHTML = `<p style="color:#ef4444;padding:20px;">Failed to load bookings: ${err.message}</p>`;
    }
  }

  renderCityFilterBar(bookings) {
    const filterContainer = document.getElementById('bookings-city-filter-bar');
    if (!filterContainer) return;
    const cityCounts = {};
    bookings.forEach(b => {
      const c = b.city_name || 'Other';
      cityCounts[c] = (cityCounts[c] || 0) + 1;
    });
    const uniqueCities = Object.keys(cityCounts);

    filterContainer.style.display = 'flex';
    filterContainer.innerHTML = `
      <div style="font-size:0.8rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; display:flex; align-items:center; gap:6px;">
        <i class="fa-solid fa-city"></i> Filter by City:
      </div>
      <button class="filter-chip ${this.activeCityFilter === 'all' ? 'active' : ''}" onclick="window.bookingCtrl.filterByCity('all')">
        All Cities (${bookings.length})
      </button>
      ${uniqueCities.map(c => `
        <button class="filter-chip ${this.activeCityFilter === c ? 'active' : ''}" onclick="window.bookingCtrl.filterByCity('${c}')">
          ${c} (${cityCounts[c]})
        </button>
      `).join('')}
    `;
  }

  filterByCity(cityName) {
    this.activeCityFilter = cityName;
    this.renderCityFilterBar(this.bookingHistory);
    this.applyCityFilter();
  }

  applyCityFilter() {
    const container = document.getElementById('bookings-list-container');
    if (!container) return;
    const filtered = (this.activeCityFilter === 'all')
      ? this.bookingHistory
      : this.bookingHistory.filter(b => b.city_name && b.city_name.toLowerCase() === this.activeCityFilter.toLowerCase());

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:40px; color:var(--text-secondary); background:var(--bg-card); border-radius:var(--radius-lg);">
          <i class="fa-solid fa-filter-circle-xmark" style="font-size:2rem; color:var(--text-muted); margin-bottom:10px;"></i>
          <p>No bookings found for <strong>${this.activeCityFilter}</strong>.</p>
          <button class="btn btn-outline btn-sm" onclick="window.bookingCtrl.filterByCity('all')">View All Cities</button>
        </div>`;
      return;
    }

    container.innerHTML = filtered.map(b => this._bookingCardHtml(b)).join('');
  }

  _bookingCardHtml(b) {
    const statusClass = b.status === 'confirmed' ? 'confirmed' : b.status === 'cancelled' ? 'cancelled' : 'pending';
    const totalText   = b.total_amount > 0 ? `₹${parseFloat(b.total_amount).toFixed(2)}` : 'Free Entry';
    const cityName    = b.city_name || 'Destination';

    const partyDesc = [
      `${b.num_adults} Adult${b.num_adults > 1 ? 's' : ''}`,
      b.num_children > 0 ? `${b.num_children} Child${b.num_children > 1 ? 'ren' : ''}` : null,
      b.num_seniors > 0 ? `${b.num_seniors} Senior${b.num_seniors > 1 ? 's' : ''}` : null
    ].filter(Boolean).join(' • ');

    return `
      <div class="booking-history-card ${statusClass}" id="bk-card-${b.id}" style="display:flex; background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); overflow:hidden; margin-bottom:20px; box-shadow:var(--shadow-md); transition:var(--transition-fast);">
        <img src="${b.image_url || 'assets/places/adiyogi.jpg'}" onerror="this.src='assets/places/adiyogi.jpg'" alt="${b.place_name}" class="bk-card-img" style="width:200px; min-height:160px; object-fit:cover;" />
        <div class="bk-card-body" style="padding:20px; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div class="bk-card-header" style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
              <div>
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                  <span style="background:rgba(2,132,199,0.18); color:var(--secondary-light); font-size:0.78rem; font-weight:800; padding:2px 8px; border-radius:4px; font-family:monospace; letter-spacing:0.5px;">
                    <i class="fa-solid fa-qrcode"></i> ${b.booking_ref}
                  </span>
                  <span style="font-size:0.82rem; color:var(--secondary-light); font-weight:700;"><i class="fa-solid fa-location-dot"></i> ${cityName}</span>
                </div>
                <h3 class="bk-card-title" style="font-size:1.25rem; font-weight:800; color:#fff; margin:0 0 4px;">${b.place_name}</h3>
                <p class="bk-card-city" style="font-size:0.82rem; color:var(--text-secondary); margin:0;"><i class="fa-solid fa-map-pin" style="color:var(--accent-amber);"></i> ${b.address || cityName}</p>
              </div>

              <span class="bk-status-badge ${statusClass}" style="padding:6px 14px; border-radius:20px; font-size:0.75rem; font-weight:700; text-transform:uppercase; background:${b.status === 'confirmed' ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)'}; color:${b.status === 'confirmed' ? 'var(--accent-emerald)' : '#ef4444'}; border:1px solid ${b.status === 'confirmed' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'};">
                <i class="fa-solid ${b.status === 'confirmed' ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> ${b.status}
              </span>
            </div>

            <!-- Confirmed Slot & Date Banner -->
            <div style="background:linear-gradient(90deg, rgba(2,132,199,0.12) 0%, rgba(16,185,129,0.1) 100%); border-left:3px solid var(--secondary-light); padding:10px 14px; border-radius:6px; margin-bottom:14px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
              <div>
                <span style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase; font-weight:700; display:block;">Confirmed Visit Date</span>
                <span style="font-size:1rem; font-weight:800; color:#fff;">
                  <i class="fa-solid fa-calendar-day" style="color:var(--secondary-light); margin-right:6px;"></i>${this._formatDate(b.visit_date)}
                </span>
              </div>
              <div style="text-align:right;">
                <span style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase; font-weight:700; display:block;">Booked Time Slot</span>
                <span style="background:rgba(2,132,199,0.2); color:var(--secondary-light); font-weight:700; padding:4px 12px; border-radius:20px; font-size:0.85rem; display:inline-block; border:1px solid rgba(56,189,248,0.3);">
                  <i class="fa-regular fa-clock" style="margin-right:4px;"></i>${b.visit_time || '09:00 AM – 11:00 AM (Morning Slot 1)'}
                </span>
              </div>
            </div>

            <!-- Booking Highlights Grid -->
            <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px; background:rgba(255,255,255,0.03); padding:12px; border-radius:var(--radius-md); margin-bottom:14px; border:1px solid rgba(255,255,255,0.05);">
              <div>
                <span style="font-size:0.72rem; color:var(--text-muted); display:block; text-transform:uppercase; font-weight:600;">Party Size</span>
                <strong style="font-size:0.88rem; color:#fff;"><i class="fa-solid fa-users" style="color:var(--secondary-light);"></i> ${partyDesc}</strong>
              </div>

              <div>
                <span style="font-size:0.72rem; color:var(--text-muted); display:block; text-transform:uppercase; font-weight:600;">Total Paid</span>
                <strong style="font-size:1rem; color:var(--accent-emerald); font-weight:800;"><i class="fa-solid fa-receipt"></i> ${totalText}</strong>
              </div>

              <div>
                <span style="font-size:0.72rem; color:var(--text-muted); display:block; text-transform:uppercase; font-weight:600;">Visitor Contact</span>
                <strong style="font-size:0.88rem; color:#fff;"><i class="fa-solid fa-user" style="color:var(--secondary-light);"></i> ${b.visitor_name}</strong>
                <div style="font-size:0.76rem; color:var(--text-secondary);">${b.visitor_email}</div>
              </div>

              <div>
                <span style="font-size:0.72rem; color:var(--text-muted); display:block; text-transform:uppercase; font-weight:600;">Mobile Pass</span>
                <strong style="font-size:0.88rem; color:#fff;"><i class="fa-solid fa-phone" style="color:var(--secondary-light);"></i> ${b.visitor_phone || 'Instant E-Pass'}</strong>
                <div style="font-size:0.76rem; color:var(--accent-emerald);"><i class="fa-solid fa-qrcode"></i> Digital Gate Pass</div>
              </div>
            </div>

            ${b.special_requests ? `
            <div style="font-size:0.82rem; color:#cbd5e1; background:rgba(255,255,255,0.03); border-left:3px solid var(--accent-amber); padding:8px 12px; border-radius:4px; margin-bottom:12px; border:1px solid rgba(255,255,255,0.06);">
              <strong style="color:var(--accent-amber);"><i class="fa-solid fa-shield-heart"></i> Inclusions:</strong> ${b.special_requests}
            </div>` : ''}
          </div>

          <!-- Actions Bar -->
          <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid var(--border-subtle); padding-top:12px; margin-top:6px; flex-wrap:wrap; gap:10px;">
            <div style="display:flex; gap:8px;">
              <button class="btn btn-primary btn-sm" onclick="window.bookingCtrl.openTicketModal('${b.booking_ref}')" style="display:inline-flex; align-items:center; gap:6px;">
                <i class="fa-solid fa-ticket"></i> View Digital Pass
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.placesCtrl.openPlaceDetails(${b.place_id})" style="display:inline-flex; align-items:center; gap:6px;">
                <i class="fa-solid fa-circle-info"></i> Place Details
              </button>
            </div>

            ${b.status === 'confirmed' ? `
            <button class="btn btn-sm" style="background:rgba(239,68,68,0.12); color:#ef4444; border:1px solid rgba(239,68,68,0.25); display:inline-flex; align-items:center; gap:6px;"
              onclick="window.bookingCtrl.cancelBooking(${b.id})">
              <i class="fa-solid fa-ban"></i> Cancel Booking
            </button>` : `
            <span style="font-size:0.8rem; color:var(--text-muted);"><i class="fa-solid fa-clock-rotate-left"></i> Cancelled on request</span>
            `}
          </div>
        </div>
      </div>`;
  }

  // ── 8. LOOKUP BOOKING BY REFERENCE NUMBER & EMAIL ─────────────────────────
  async handleLookupSubmit(e) {
    e.preventDefault();
    const ref = (document.getElementById('bk-lookup-ref').value || '').trim().toUpperCase();
    const email = (document.getElementById('bk-lookup-email').value || '').trim();
    const resultContainer = document.getElementById('bk-lookup-result');
    if (!resultContainer) return;

    resultContainer.style.display = 'block';
    resultContainer.innerHTML = `
      <div style="text-align:center; padding:16px; color:var(--text-secondary);">
        <i class="fa-solid fa-spinner fa-spin"></i> Searching reservation record for <strong>${ref}</strong>...
      </div>`;

    try {
      const booking = await window.api.lookupBooking(ref, email);
      if (!booking) {
        resultContainer.innerHTML = `
          <div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25); border-radius:8px; padding:14px; color:#fca5a5; font-size:0.88rem;">
            <i class="fa-solid fa-circle-exclamation"></i> No booking found with reference <strong>${ref}</strong>${email ? ` and email <strong>${email}</strong>` : ''}. Please check the details or book a new ticket.
          </div>`;
        return;
      }

      resultContainer.innerHTML = `
        <div style="background:rgba(2,132,199,0.12); border:1px solid rgba(56,189,248,0.4); border-radius:10px; padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span style="color:var(--accent-emerald); font-weight:700;"><i class="fa-solid fa-circle-check"></i> Reservation Found</span>
            <button class="btn btn-primary btn-sm" onclick="window.bookingCtrl.openTicketModal('${booking.booking_ref}')">
              <i class="fa-solid fa-print"></i> Open E-Ticket Pass
            </button>
          </div>
          ${this._bookingCardHtml(booking)}
        </div>`;
    } catch (err) {
      resultContainer.innerHTML = `<div style="color:#ef4444; padding:10px;">Error finding booking: ${err.message}</div>`;
    }
  }

  // ── 9. PRINTABLE DIGITAL PASS WITH SCANNABLE QR CODE ──────────────────────
  openTicketModal(bookingRef) {
    let booking = (this.bookingHistory || []).find(b => b.booking_ref === bookingRef);
    if (!booking) {
      try {
        const localList = JSON.parse(localStorage.getItem('cm_bookings') || '[]');
        booking = localList.find(b => b.booking_ref === bookingRef);
      } catch (e) {}
    }
    if (!booking) return;

    let modal = document.getElementById('ticket-pass-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'ticket-pass-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const totalText = booking.total_amount > 0 ? `₹${parseFloat(booking.total_amount).toFixed(2)}` : 'Free Entry';
    const cityName = booking.city_name || 'Destination';

    const partyDesc = [
      `${booking.num_adults} Adult${booking.num_adults > 1 ? 's' : ''}`,
      booking.num_children > 0 ? `${booking.num_children} Child${booking.num_children > 1 ? 'ren' : ''}` : null,
      booking.num_seniors > 0 ? `${booking.num_seniors} Senior${booking.num_seniors > 1 ? 's' : ''}` : null
    ].filter(Boolean).join(', ');

    modal.innerHTML = `
      <div class="modal-dialog modal-card printable-ticket-card" style="max-width:480px; width:100%; max-height:90vh; overflow-y:auto; background:#0d1527; border:1px solid rgba(56,189,248,0.4); box-shadow:0 16px 50px rgba(0,0,0,0.7); border-radius:var(--radius-lg);">
        
        <!-- Ticket Header Banner -->
        <div style="background:linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%); padding:22px 24px; position:relative;">
          <button class="modal-close" onclick="document.getElementById('ticket-pass-modal').classList.remove('active')" style="position:absolute; top:14px; right:14px; color:#fff; font-size:1.4rem;">&times;</button>
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
            <div style="width:40px; height:40px; background:rgba(255,255,255,0.2); border-radius:10px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.2rem;">
              <i class="fa-solid fa-ticket"></i>
            </div>
            <div>
              <div style="font-size:0.72rem; text-transform:uppercase; letter-spacing:1.5px; color:rgba(255,255,255,0.85); font-weight:800;">Official CityMate E-Ticket</div>
              <h3 style="font-size:1.25rem; font-weight:800; color:#fff; margin:0; line-height:1.2;">${booking.place_name}</h3>
            </div>
          </div>
          <div style="font-size:0.82rem; color:rgba(255,255,255,0.9);"><i class="fa-solid fa-location-dot"></i> ${booking.address || cityName}</div>
        </div>

        <div style="padding:24px; background:#0d1527;">
          <!-- Scannable QR Code Container -->
          <div style="text-align:center; padding:18px; background:#fff; border-radius:14px; margin-bottom:20px; box-shadow:0 4px 15px rgba(0,0,0,0.2);">
            <div style="font-family:monospace; font-size:1.35rem; font-weight:800; color:#0f172a; letter-spacing:2px; margin-bottom:8px;">${booking.booking_ref}</div>
            <div style="display:flex; justify-content:center; align-items:center; margin:8px 0;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(booking.booking_ref)}" alt="QR Gate Pass" style="width:140px; height:140px; border:1px solid #cbd5e1; border-radius:8px;" />
            </div>
            <span style="font-size:0.75rem; color:#475569; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Official Digital Fast-Track Pass</span>
          </div>

          <!-- Ticket Specifications Grid -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.85rem; margin-bottom:16px;">
            <div>
              <span style="color:var(--text-muted); font-size:0.72rem; text-transform:uppercase;">Primary Visitor</span>
              <div style="color:#fff; font-weight:700;">${booking.visitor_name}</div>
            </div>
            <div>
              <span style="color:var(--text-muted); font-size:0.72rem; text-transform:uppercase;">Visit Date</span>
              <div style="color:#fff; font-weight:700;">${this._formatDate(booking.visit_date)}</div>
            </div>
            <div style="grid-column: 1 / -1; background:rgba(2,132,199,0.12); padding:8px 12px; border-radius:6px; border:1px solid rgba(56,189,248,0.25);">
              <span style="color:var(--text-muted); font-size:0.72rem; display:block; text-transform:uppercase;">Confirmed Slot Window</span>
              <div style="color:var(--accent-amber); font-weight:800; font-size:0.92rem;"><i class="fa-regular fa-clock"></i> ${booking.visit_time || 'General Slot'}</div>
            </div>
            <div>
              <span style="color:var(--text-muted); font-size:0.72rem; text-transform:uppercase;">Party Size</span>
              <div style="color:#fff; font-weight:700;">${partyDesc}</div>
            </div>
            <div>
              <span style="color:var(--text-muted); font-size:0.72rem; text-transform:uppercase;">Total Amount Paid</span>
              <div style="color:var(--accent-emerald); font-weight:800; font-size:1.05rem;">${totalText}</div>
            </div>
          </div>

          ${booking.special_requests ? `
          <div style="background:rgba(255,255,255,0.04); border-radius:6px; padding:8px 12px; font-size:0.78rem; color:#cbd5e1; margin-bottom:16px; border:1px solid rgba(255,255,255,0.08);">
            <strong style="color:var(--secondary-light);"><i class="fa-solid fa-shield-heart"></i> Inclusions:</strong> ${booking.special_requests}
          </div>` : ''}

          <!-- Visitor Guidelines Notice -->
          <div style="font-size:0.74rem; color:var(--text-muted); line-height:1.4; border-top:1px dashed rgba(255,255,255,0.15); padding-top:12px; margin-bottom:16px;">
            <i class="fa-solid fa-circle-info" style="color:var(--secondary-light);"></i>
            Please carry a valid photo ID along with this digital pass. Arrive 15 minutes prior to your confirmed slot.
          </div>

          <!-- Buttons -->
          <div style="display:flex; gap:10px;">
            <button class="btn btn-primary btn-block" onclick="window.print()" style="font-weight:700;">
              <i class="fa-solid fa-print"></i> Print / Download Ticket
            </button>
            <button class="btn btn-secondary btn-block" onclick="document.getElementById('ticket-pass-modal').classList.remove('active')">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  // ── 10. CANCELLATION WITH POLICY ──────────────────────────────────────────
  async cancelBooking(bookingId) {
    const notice = "Cancellation Policy:\nFree cancellation is available up to 24 hours prior to visit date.\n\nAre you sure you want to cancel this booking?";
    if (!confirm(notice)) return;

    try {
      await window.api.cancelBooking(bookingId);
      window.app.showToast('Your booking has been cancelled successfully.', 'info');
      this.renderBookingsView();
    } catch (err) {
      window.app.showToast('Could not cancel: ' + err.message, 'error');
    }
  }

  _formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  }
}

window.bookingCtrl = new BookingController();
