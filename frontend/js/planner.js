/**
 * CityMate Smart Trip Planner Module
 * Features:
 * - Personalized criteria: Budget, Duration (1-7 days), Destination City (12 iconic cities)
 * - Curated 3 to 4 spots per day organized from morning sunrise to sunset twilight
 * - Distinct, varied restaurant suggestions for Breakfast, Lunch, and Dinner for every day
 * - Personalized budget breakdowns & travel mode recommendations
 * - Direct in-project routing: "View on Map" opens Leaflet map navigation directly inside CityMate
 */

class TripPlannerController {
  constructor() {
    this.selectedDays = 2;
    this.selectedBudget = 'moderate';
    this.selectedInterests = ['nature', 'historical', 'temple', 'shopping'];
    this.eventsBound = false;
    this.isGenerating = false;
  }

  escapeJs(str) {
    if (!str) return '';
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '&quot;');
  }

  /**
   * Navigate to spot on in-project Leaflet map
   */
  navigateToLocation(lat, lng, name, cat = 'place', cityId = null) {
    let url = '';
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      url = `map.html?destination=${lat},${lng}&name=${encodeURIComponent(name || '')}`;
    } else {
      url = `map.html?search=${encodeURIComponent(name || '')}`;
    }
    if (cityId) {
      url += `&cityId=${cityId}`;
    }
    window.location.href = url;
  }

  init() {
    this.syncCitySelect();
    if (!this.eventsBound) {
      this.bindEvents();
      this.eventsBound = true;
    }
  }

  syncCitySelect() {
    const citySelect = document.getElementById('planner-city-select');
    if (!citySelect) return;

    // If current selected city in app exists, sync dropdown value
    if (window.app && window.app.selectedCity && window.app.selectedCity.id) {
      citySelect.value = String(window.app.selectedCity.id);
    }
  }

  bindEvents() {
    // Duration buttons (1, 2, 3, 4, 5, 7 days)
    document.querySelectorAll('.planner-day-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.planner-day-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedDays = Number(btn.dataset.days) || 2;
      });
    });

    // Budget cards (budget, moderate, luxury)
    document.querySelectorAll('.budget-toggle-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.budget-toggle-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.selectedBudget = card.dataset.budget || 'moderate';
      });
    });

    // Interest checkboxes
    document.querySelectorAll('.interest-checkbox-label').forEach(label => {
      const checkbox = label.querySelector('input');
      if (!checkbox) return;
      checkbox.addEventListener('change', () => {
        label.classList.toggle('checked', checkbox.checked);
        const val = checkbox.value;
        if (checkbox.checked) {
          if (!this.selectedInterests.includes(val)) this.selectedInterests.push(val);
        } else {
          this.selectedInterests = this.selectedInterests.filter(i => i !== val);
        }
      });
    });

    // Generate button
    const generateBtn = document.getElementById('btn-generate-plan');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generatePlan());
    }
  }

  async generatePlan() {
    const generateBtn = document.getElementById('btn-generate-plan');
    if (this.isGenerating) return;
    this.isGenerating = true;
    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating Itinerary...';
    }

    const citySelect = document.getElementById('planner-city-select');
    const cityId = citySelect ? Number(citySelect.value) : (window.app && window.app.selectedCity ? window.app.selectedCity.id : 1);

    const resultsContainer = document.getElementById('planner-results-container');
    if (!resultsContainer) {
      this.isGenerating = false;
      if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Smart Itinerary';
      }
      return;
    }

    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
        <i class="fa-solid fa-route fa-spin" style="font-size: 2.8rem; color: var(--primary-light);"></i>
        <h3 style="margin-top: 18px; color: #fff; font-size: 1.4rem;">Personalizing Your Smart Itinerary...</h3>
        <p style="font-size: 0.95rem; margin-top: 6px; max-width: 500px; margin-left: auto; margin-right: auto;">
          Curating 3 to 4 daily attractions, distinct breakfast, lunch & dinner eateries, and budget-tailored stays.
        </p>
      </div>
    `;

    try {
      if (!window.api && typeof ApiService !== 'undefined') {
        window.api = new ApiService();
      }

      const user = window.api && typeof window.api.getCurrentUser === 'function' ? window.api.getCurrentUser() : null;
      const params = {
        city_id: cityId,
        days: this.selectedDays,
        interests: this.selectedInterests,
        budget: this.selectedBudget,
        user_id: user ? user.id : null
      };

      let plan = null;
      if (window.api && typeof window.api.generateTripPlan === 'function') {
        plan = await window.api.generateTripPlan(params);
      }

      if (!plan || !plan.itinerary || !plan.itinerary.length) {
        plan = this.generateEmergencyPlan(cityId, this.selectedDays, this.selectedBudget);
      }

      this.renderItinerary(plan, resultsContainer);
    } catch (err) {
      console.warn('Trip planner error, using resilient fallback:', err);
      const plan = this.generateEmergencyPlan(cityId, this.selectedDays, this.selectedBudget);
      this.renderItinerary(plan, resultsContainer);
    } finally {
      this.isGenerating = false;
      if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Smart Itinerary';
      }
    }
  }

  /**
   * Resilient local emergency plan builder so user is never left without an itinerary
   */
  generateEmergencyPlan(cityId, days, budget) {
    const cities = (typeof SEED_DATA !== 'undefined' && SEED_DATA.cities) ? SEED_DATA.cities : [
      { id: 1, name: 'Coimbatore', state: 'Tamil Nadu' },
      { id: 2, name: 'Chennai', state: 'Tamil Nadu' },
      { id: 3, name: 'Ooty', state: 'Tamil Nadu' },
      { id: 4, name: 'Madurai', state: 'Tamil Nadu' },
      { id: 5, name: 'Salem', state: 'Tamil Nadu' },
      { id: 6, name: 'Bengaluru', state: 'Karnataka' },
      { id: 7, name: 'Kodaikanal', state: 'Tamil Nadu' },
      { id: 8, name: 'Pondicherry', state: 'Puducherry' },
      { id: 9, name: 'Kanyakumari', state: 'Tamil Nadu' },
      { id: 10, name: 'Thanjavur', state: 'Tamil Nadu' },
      { id: 11, name: 'Mysuru', state: 'Karnataka' },
      { id: 12, name: 'Munnar', state: 'Kerala' }
    ];

    const city = cities.find(c => Number(c.id) === Number(cityId)) || cities[0];
    const places = (typeof SEED_DATA !== 'undefined' && SEED_DATA.places) 
      ? SEED_DATA.places.filter(p => Number(p.city_id) === Number(city.id))
      : [];
    const allPlaces = places.length ? places : (typeof SEED_DATA !== 'undefined' && SEED_DATA.places ? SEED_DATA.places.slice(0, 10) : []);

    const services = (typeof SEED_DATA !== 'undefined' && SEED_DATA.services)
      ? SEED_DATA.services.filter(s => Number(s.city_id) === Number(city.id))
      : [];

    const hotels = services.filter(s => (s.service_type || '').includes('hotel'));
    const restaurants = services.filter(s => (s.service_type || '').includes('restaurant'));

    const dailyRate = budget === 'budget' ? 1600 : (budget === 'luxury' ? 8500 : 3800);
    const itinerary = [];

    const slotConfigs = [
      { slot_number: 1, slot_name: 'Morning Spotlight', time: '08:30 AM - 10:45 AM', badge: 'Spot 1 • Morning Exploration', actPrefix: 'Iconic morning exploration & scenic photography' },
      { slot_number: 2, slot_name: 'Mid-Day Cultural Visit', time: '11:15 AM - 01:00 PM', badge: 'Spot 2 • Cultural & Heritage Stop', actPrefix: 'Architectural tour, exhibits & historical immersion' },
      { slot_number: 3, slot_name: 'Afternoon Scenic Leisure', time: '03:00 PM - 05:00 PM', badge: 'Spot 3 • Afternoon Leisure & Nature', actPrefix: 'Lush garden strolling, craft shopping & boat rides' },
      { slot_number: 4, slot_name: 'Golden Hour Sunset Finale', time: '05:30 PM - 07:30 PM', badge: 'Spot 4 • Sunset View & Twilight Leisure', actPrefix: 'Breathtaking twilight vista, light show & evening breeze' }
    ];

    for (let d = 1; d <= days; d++) {
      const daySpots = slotConfigs.map((cfg, idx) => {
        const place = allPlaces.length ? allPlaces[((d - 1) * 4 + idx) % allPlaces.length] : {
          name: `${city.name} Iconic Landmark ${idx + 1}`,
          category: 'Attraction',
          rating: 4.8,
          entry_fee: 50,
          lat: 11.0168,
          lng: 76.9558,
          image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600'
        };

        return {
          spot_number: cfg.slot_number,
          slot_name: cfg.slot_name,
          badge: cfg.badge,
          time: cfg.time,
          place: place,
          activity: `${cfg.actPrefix} at ${place.name}`,
          tip: 'Arrive early to avoid queues and enjoy the best ambient photography.'
        };
      });

      const bRest = restaurants.length ? restaurants[(d - 1) % restaurants.length] : { name: `${city.name} Morning Tiffin & Coffee Center`, address: 'Central Heritage Road', rating: 4.6, lat: 11.0168, lng: 76.9558 };
      const lRest = restaurants.length ? restaurants[(d * 2) % restaurants.length] : { name: `${city.name} Traditional Banana Leaf Feast`, address: 'Town Promenade', rating: 4.7, lat: 11.0168, lng: 76.9558 };
      const dRest = restaurants.length ? restaurants[(d * 3) % restaurants.length] : { name: `${city.name} Rooftop Garden & Barbecue`, address: 'Panoramic Viewpoint', rating: 4.8, lat: 11.0168, lng: 76.9558 };
      const hotel = hotels.length ? hotels[(d - 1) % hotels.length] : { name: `${city.name} Comfort Suites & Heritage Inn`, address: 'Central City', price_level: '$$', rating: 4.5 };

      itinerary.push({
        day: d,
        title: `Day ${d}: Highlights & Cultural Wonders of ${city.name}`,
        expected_amount_day: `₹${dailyRate.toLocaleString()}`,
        day_amount_numeric: dailyRate,
        estimated_travel_km: (10.0 + d * 3).toFixed(1),
        spots: daySpots,
        suggested_hotel: hotel,
        meals: {
          breakfast: { time: '07:30 AM - 09:00 AM', restaurant: bRest, recommendation: 'Authentic morning filter kaapi and warm ghee roast dosas' },
          lunch: { time: '01:00 PM - 02:30 PM', restaurant: lRest, recommendation: 'Specialty banana leaf meals and regional delicacies' },
          dinner: { time: '08:00 PM - 10:00 PM', restaurant: dRest, recommendation: 'Scenic evening dining and relaxing barbecue' }
        }
      });
    }

    return {
      city,
      days,
      budget,
      daily_rate: dailyRate,
      total_estimated_budget: `₹${(dailyRate * days).toLocaleString()}`,
      budget_breakdown: {
        stay_per_day: budget === 'budget' ? '₹800' : (budget === 'luxury' ? '₹5,200' : '₹2,100'),
        food_per_day: budget === 'budget' ? '₹450' : (budget === 'luxury' ? '₹2,100' : '₹1,000'),
        sightseeing_per_day: budget === 'budget' ? '₹150' : (budget === 'luxury' ? '₹500' : '₹300'),
        transit_per_day: budget === 'budget' ? '₹200' : (budget === 'luxury' ? '₹700' : '₹400'),
        recommended_stay_tier: budget === 'budget' ? 'Budget Lodges & Hostels' : (budget === 'luxury' ? '5-Star Luxury Resorts' : 'Comfort 3-Star Hotels'),
        recommended_transit: budget === 'budget' ? 'Public Transit & Shared Auto' : (budget === 'luxury' ? 'Chauffeur Luxury Sedan' : 'App Cabs & Rentals')
      },
      itinerary
    };
  }

  renderItinerary(plan, container) {
    const budgetTitle = plan.budget === 'budget' ? 'Budget-Friendly' : plan.budget === 'luxury' ? 'Luxury & Comfort' : 'Moderate (Comfort)';
    const bd = plan.budget_breakdown || {
      stay_per_day: '₹2,100',
      food_per_day: '₹1,000',
      sightseeing_per_day: '₹300',
      transit_per_day: '₹400',
      recommended_stay_tier: 'Comfort 3-Star Hotels / Boutique Stays',
      recommended_transit: 'App Cabs / Self-Drive Rentals / Dedicated Taxis'
    };

    container.innerHTML = `
      <!-- Itinerary Summary Bar -->
      <div class="itinerary-header-bar">
        <div>
          <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
            <span class="badge badge-primary">Smart Trip Planner</span>
            <span class="badge" style="background: rgba(255,255,255,0.08); color: #fff;">
              <i class="fa-solid fa-location-dot" style="color: var(--primary-light); margin-right: 4px;"></i> ${plan.city.name}, ${plan.city.state || 'India'}
            </span>
          </div>
          <h3 style="font-size: 1.55rem; font-weight: 800; color: #fff;">
            ${plan.days}-Day Personalized Exploration of ${plan.city.name}
          </h3>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">
            Tailored for <strong>${budgetTitle}</strong> tier • 3 to 4 spots planned daily with verified dining & transit
          </p>
        </div>

        <div class="itinerary-stats">
          <div class="itinerary-stat-pill">
            <i class="fa-solid fa-wallet" style="color: var(--accent-emerald); font-size: 1.3rem;"></i>
            <div>
              <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Total Budget</div>
              <strong style="font-size: 1.15rem; color: #fff;">${plan.total_estimated_budget}</strong>
            </div>
          </div>
          <div class="itinerary-stat-pill">
            <i class="fa-solid fa-coins" style="color: var(--accent-amber); font-size: 1.3rem;"></i>
            <div>
              <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Daily Est.</div>
              <strong style="font-size: 1.15rem; color: #fff;">${plan.daily_rate ? '₹' + plan.daily_rate.toLocaleString() : (plan.itinerary && plan.itinerary[0] ? plan.itinerary[0].expected_amount_day : '₹3,800')}</strong>
            </div>
          </div>
          <div class="itinerary-stat-pill">
            <i class="fa-solid fa-calendar-days" style="color: var(--secondary-light); font-size: 1.3rem;"></i>
            <div>
              <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Trip Length</div>
              <strong style="font-size: 1.15rem; color: #fff;">${plan.days} Full Days</strong>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.print()" title="Print or Save PDF">
            <i class="fa-solid fa-print"></i> Print Plan
          </button>
        </div>
      </div>

      <!-- Personalized Budget Breakdown Banner -->
      <div class="budget-breakdown-banner">
        <div class="budget-breakdown-card">
          <div class="budget-breakdown-icon stay"><i class="fa-solid fa-hotel"></i></div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Stay Est.</div>
            <strong style="font-size: 1.05rem; color: #fff;">${bd.stay_per_day} <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">/day</span></strong>
            <div style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 2px;">${bd.recommended_stay_tier}</div>
          </div>
        </div>

        <div class="budget-breakdown-card">
          <div class="budget-breakdown-icon food"><i class="fa-solid fa-utensils"></i></div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Food Est.</div>
            <strong style="font-size: 1.05rem; color: #fff;">${bd.food_per_day} <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">/day</span></strong>
            <div style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 2px;">3 Curated Meals (Breakfast, Lunch & Dinner)</div>
          </div>
        </div>

        <div class="budget-breakdown-card">
          <div class="budget-breakdown-icon sight"><i class="fa-solid fa-ticket"></i></div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Sightseeing</div>
            <strong style="font-size: 1.05rem; color: #fff;">${bd.sightseeing_per_day} <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">/day</span></strong>
            <div style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 2px;">Entry passes, boatings & museum audio</div>
          </div>
        </div>

        <div class="budget-breakdown-card">
          <div class="budget-breakdown-icon transit"><i class="fa-solid fa-car-side"></i></div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Local Transit</div>
            <strong style="font-size: 1.05rem; color: #fff;">${bd.transit_per_day} <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">/day</span></strong>
            <div style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 2px;">${bd.recommended_transit}</div>
          </div>
        </div>
      </div>

      <!-- Day by Day Timetable -->
      <div class="itinerary-days-list">
        ${plan.itinerary.map(day => `
          <div class="day-card">
            <!-- Day Header -->
            <div class="day-header">
              <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
                <span class="day-badge">DAY ${day.day}</span>
                <h4 style="font-size: 1.25rem; font-weight: 700; color: #fff;">${day.title}</h4>
              </div>
              <div class="day-header-meta">
                <div class="day-expected-cost-badge">
                  <span class="cost-badge-label"><i class="fa-solid fa-coins"></i> Expected Amount for Day ${day.day}</span>
                  <span class="cost-badge-val">${day.expected_amount_day || '₹3,800'}</span>
                </div>
                <span class="badge" style="background: rgba(20, 184, 166, 0.12); color: var(--primary-light);">
                  <i class="fa-solid fa-compass"></i> ${day.spots ? day.spots.length : 4} Curated Spots
                </span>
                <span style="font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
                  <i class="fa-solid fa-car" style="color: var(--primary-light);"></i>
                  ~${day.estimated_travel_km} km travel
                </span>
              </div>
            </div>

            <!-- Day Expected Cost Breakdown Pill Bar -->
            <div class="day-cost-bar">
              <div class="day-cost-pill">
                <span class="pill-lbl"><i class="fa-solid fa-hotel"></i> Stay</span>
                <span class="pill-val">${day.day_cost_breakdown ? day.day_cost_breakdown.stay : bd.stay_per_day}</span>
              </div>
              <div class="day-cost-pill">
                <span class="pill-lbl"><i class="fa-solid fa-utensils"></i> Food (3 Meals)</span>
                <span class="pill-val">${day.day_cost_breakdown ? day.day_cost_breakdown.food : bd.food_per_day}</span>
              </div>
              <div class="day-cost-pill">
                <span class="pill-lbl"><i class="fa-solid fa-ticket"></i> Sightseeing Passes</span>
                <span class="pill-val">${day.day_cost_breakdown ? day.day_cost_breakdown.sightseeing : bd.sightseeing_per_day}</span>
              </div>
              <div class="day-cost-pill">
                <span class="pill-lbl"><i class="fa-solid fa-car-side"></i> Local Transit</span>
                <span class="pill-val">${day.day_cost_breakdown ? day.day_cost_breakdown.transit : bd.transit_per_day}</span>
              </div>
              <div class="day-cost-pill total">
                <span class="pill-lbl"><i class="fa-solid fa-wallet"></i> Day ${day.day} Total</span>
                <span class="pill-val highlight">${day.expected_amount_day || '₹3,800'}</span>
              </div>
            </div>

            <!-- 1. Curated Dining Journey (Breakfast, Lunch & Dinner) -->
            <div class="day-section-header">
              <span class="day-section-title" style="color: var(--accent-amber);">
                <i class="fa-solid fa-utensils"></i> Curated Dining Journey (Breakfast, Lunch & Dinner)
              </span>
              <span style="font-size: 0.78rem; color: var(--text-muted);">Varying authentic eateries across trip duration</span>
            </div>

            <div class="meals-grid">
              <!-- Breakfast -->
              ${day.meals && day.meals.breakfast && day.meals.breakfast.restaurant ? `
                <div class="meal-card breakfast">
                  <div>
                    <div class="meal-header">
                      <span class="meal-badge"><i class="fa-solid fa-mug-saucer"></i> Breakfast</span>
                      <span class="meal-time">${day.meals.breakfast.time}</span>
                    </div>
                    <div class="meal-name">${day.meals.breakfast.restaurant.name}</div>
                    <div class="meal-address">
                      <i class="fa-solid fa-location-dot" style="margin-top: 3px; color: #fbbf24;"></i>
                      <span>${day.meals.breakfast.restaurant.address || 'Central location'}</span>
                    </div>
                    <div class="meal-spec">
                      <i class="fa-solid fa-sparkles"></i> ${day.meals.breakfast.recommendation}
                    </div>
                  </div>
                  <div class="meal-footer">
                    <span style="color: var(--accent-amber); font-weight: 700;">
                      <i class="fa-solid fa-star"></i> ${day.meals.breakfast.restaurant.rating || '4.5'}
                    </span>
                    <button class="btn btn-outline btn-xs" onclick="window.plannerCtrl.navigateToLocation(${day.meals.breakfast.restaurant.lat || 0}, ${day.meals.breakfast.restaurant.lng || 0}, '${this.escapeJs(day.meals.breakfast.restaurant.name)}', 'restaurant', ${plan.city.id})">
                      <i class="fa-solid fa-map-location-dot"></i> View on Map
                    </button>
                  </div>
                </div>
              ` : `
                <div class="meal-card breakfast">
                  <div class="meal-header"><span class="meal-badge">Breakfast</span></div>
                  <div class="meal-name">Local Tiffin & Morning Coffee Center</div>
                  <div class="meal-address">Near Morning Landmark</div>
                </div>
              `}

              <!-- Lunch -->
              ${day.meals && day.meals.lunch && day.meals.lunch.restaurant ? `
                <div class="meal-card lunch">
                  <div>
                    <div class="meal-header">
                      <span class="meal-badge"><i class="fa-solid fa-bowl-food"></i> Lunch</span>
                      <span class="meal-time">${day.meals.lunch.time}</span>
                    </div>
                    <div class="meal-name">${day.meals.lunch.restaurant.name}</div>
                    <div class="meal-address">
                      <i class="fa-solid fa-location-dot" style="margin-top: 3px; color: #34d399;"></i>
                      <span>${day.meals.lunch.restaurant.address || 'Near mid-day stop'}</span>
                    </div>
                    <div class="meal-spec">
                      <i class="fa-solid fa-sparkles"></i> ${day.meals.lunch.recommendation}
                    </div>
                  </div>
                  <div class="meal-footer">
                    <span style="color: var(--accent-amber); font-weight: 700;">
                      <i class="fa-solid fa-star"></i> ${day.meals.lunch.restaurant.rating || '4.6'}
                    </span>
                    <button class="btn btn-outline btn-xs" onclick="window.plannerCtrl.navigateToLocation(${day.meals.lunch.restaurant.lat || 0}, ${day.meals.lunch.restaurant.lng || 0}, '${this.escapeJs(day.meals.lunch.restaurant.name)}', 'restaurant', ${plan.city.id})">
                      <i class="fa-solid fa-map-location-dot"></i> View on Map
                    </button>
                  </div>
                </div>
              ` : `
                <div class="meal-card lunch">
                  <div class="meal-header"><span class="meal-badge">Lunch</span></div>
                  <div class="meal-name">Authentic South Indian Thali Meals</div>
                  <div class="meal-address">Near Sightseeing Hub</div>
                </div>
              `}

              <!-- Dinner -->
              ${day.meals && day.meals.dinner && day.meals.dinner.restaurant ? `
                <div class="meal-card dinner">
                  <div>
                    <div class="meal-header">
                      <span class="meal-badge"><i class="fa-solid fa-wine-glass"></i> Dinner</span>
                      <span class="meal-time">${day.meals.dinner.time}</span>
                    </div>
                    <div class="meal-name">${day.meals.dinner.restaurant.name}</div>
                    <div class="meal-address">
                      <i class="fa-solid fa-location-dot" style="margin-top: 3px; color: #a5b4fc;"></i>
                      <span>${day.meals.dinner.restaurant.address || 'Scenic Evening Hub'}</span>
                    </div>
                    <div class="meal-spec">
                      <i class="fa-solid fa-sparkles"></i> ${day.meals.dinner.recommendation}
                    </div>
                  </div>
                  <div class="meal-footer">
                    <span style="color: var(--accent-amber); font-weight: 700;">
                      <i class="fa-solid fa-star"></i> ${day.meals.dinner.restaurant.rating || '4.7'}
                    </span>
                    <button class="btn btn-outline btn-xs" onclick="window.plannerCtrl.navigateToLocation(${day.meals.dinner.restaurant.lat || 0}, ${day.meals.dinner.restaurant.lng || 0}, '${this.escapeJs(day.meals.dinner.restaurant.name)}', 'restaurant', ${plan.city.id})">
                      <i class="fa-solid fa-map-location-dot"></i> View on Map
                    </button>
                  </div>
                </div>
              ` : `
                <div class="meal-card dinner">
                  <div class="meal-header"><span class="meal-badge">Dinner</span></div>
                  <div class="meal-name">Rooftop Garden Dinner & Grill</div>
                  <div class="meal-address">Central Promenade</div>
                </div>
              `}
            </div>

            <!-- 2. Daily Sightseeing Itinerary (3 to 4 Curated Spots) -->
            <div class="day-section-header">
              <span class="day-section-title" style="color: var(--primary-light);">
                <i class="fa-solid fa-map-marked-alt"></i> Daily Sightseeing Itinerary (3 to 4 Curated Spots)
              </span>
              <span style="font-size: 0.78rem; color: var(--text-muted);">Sequenced for optimal timing & comfortable pace</span>
            </div>

            <div class="spots-timeline">
              ${(day.spots || []).map((spot, idx) => `
                <div class="spot-timeline-card">
                  <div class="spot-card-top">
                    <span class="spot-badge">
                      <i class="fa-solid fa-clock"></i> ${spot.time} • ${spot.badge || `Spot ${idx + 1}`}
                    </span>
                    ${spot.place ? `
                      <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-emerald);">
                        ${spot.place.entry_fee > 0 ? `Entry: ₹${spot.place.entry_fee}` : 'Free Entry'}
                      </span>
                    ` : ''}
                  </div>

                  <div class="spot-main-content">
                    ${spot.place && spot.place.image_url ? `
                      <img src="${spot.place.image_url}" alt="${spot.place.name}" class="spot-thumb" onerror="this.src='https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400'" />
                    ` : ''}

                    <div style="flex: 1;">
                      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                        <h5 style="font-size: 1.12rem; font-weight: 700; color: #fff; margin: 0;">
                          ${spot.place ? spot.place.name : spot.slot_name}
                        </h5>
                        ${spot.place ? `
                          <button class="btn btn-primary btn-xs" onclick="window.plannerCtrl.navigateToLocation(${spot.place.lat || 0}, ${spot.place.lng || 0}, '${this.escapeJs(spot.place.name)}', '${this.escapeJs(spot.place.category_slug || 'temple')}', ${plan.city.id})" title="Locate on Map">
                            <i class="fa-solid fa-location-arrow"></i> View on Map
                          </button>
                        ` : ''}
                      </div>

                      <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 6px 0 8px; line-height: 1.45;">
                        ${spot.activity}
                      </p>

                      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; font-size: 0.78rem;">
                        ${spot.place && spot.place.address ? `
                          <span style="color: var(--text-muted);"><i class="fa-solid fa-location-dot"></i> ${spot.place.address}</span>
                        ` : ''}
                        ${spot.place && spot.place.rating ? `
                          <span style="color: var(--accent-amber); font-weight: 700;"><i class="fa-solid fa-star"></i> ${spot.place.rating}</span>
                        ` : ''}
                      </div>

                      ${spot.tip ? `
                        <div style="margin-top: 8px; font-size: 0.76rem; background: rgba(255,255,255,0.03); border-left: 3px solid var(--primary-light); padding: 5px 10px; border-radius: 0 4px 4px 0; color: var(--text-secondary);">
                          <strong style="color: #fff;"><i class="fa-solid fa-lightbulb" style="color: #fbbf24;"></i> Insider Tip:</strong> ${spot.tip}
                        </div>
                      ` : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- 3. Suggested Add-ons (Stay, Fuel, Emergency Care & Police) -->
            <div class="suggested-addons">
              ${day.suggested_hotel ? `
                <div class="addon-pill">
                  <i class="fa-solid fa-hotel" style="color: var(--accent-amber); font-size: 1.3rem;"></i>
                  <div style="flex: 1;">
                    <strong>Suggested Stay (${day.suggested_hotel.price_level || '$$'})</strong>
                    <span>${day.suggested_hotel.name} • ${day.suggested_hotel.address || 'Central'}</span>
                  </div>
                  <a href="hotels.html" class="btn btn-secondary btn-xs" style="text-decoration:none;">Book Stay</a>
                </div>
              ` : ''}

              ${day.nearest_petrol ? `
                <div class="addon-pill">
                  <i class="fa-solid fa-gas-pump" style="color: var(--accent-purple); font-size: 1.3rem;"></i>
                  <div>
                    <strong>Fuelling & EV Station</strong>
                    <span>${day.nearest_petrol.name}</span>
                  </div>
                </div>
              ` : ''}

              ${day.nearest_hospital ? `
                <div class="addon-pill">
                  <i class="fa-solid fa-hospital" style="color: #ef4444; font-size: 1.3rem;"></i>
                  <div>
                    <strong>24x7 Emergency Care</strong>
                    <span>${day.nearest_hospital.name} (${day.nearest_hospital.phone || '24x7'})</span>
                  </div>
                </div>
              ` : ''}

              ${day.police_assistance ? `
                <div class="addon-pill">
                  <i class="fa-solid fa-shield-halved" style="color: var(--primary-light); font-size: 1.3rem;"></i>
                  <div>
                    <strong>Tourist Police Safety</strong>
                    <span>${day.police_assistance.name} (Dial 100)</span>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Scroll smoothly to results
    container.scrollIntoView({ behavior: 'smooth' });
  }
}

window.plannerCtrl = new TripPlannerController();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (window.plannerCtrl) {
    window.plannerCtrl.init();
  }
});
