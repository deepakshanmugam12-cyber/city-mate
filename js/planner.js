/**
 * CityMate Smart Trip Planner Module
 * Features:
 * - Personalized criteria: Budget, Duration (1-7 days), Destination City (12 iconic cities)
 * - Curated 3 to 4 spots per day organized from morning sunrise to sunset twilight
 * - Distinct, varied restaurant suggestions for Breakfast, Lunch, and Dinner for every day
 * - Personalized budget breakdowns & travel mode recommendations
 */

class TripPlannerController {
  constructor() {
    this.selectedDays = 2;
    this.selectedBudget = 'moderate';
    this.selectedInterests = ['nature', 'historical', 'temple', 'shopping'];
    this.eventsBound = false;
  }

  escapeJs(str) {
    if (!str) return '';
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '&quot;');
  }

  navigateToLocation(lat, lng, name, cat = 'place') {
    if (window.mapCtrl && typeof window.mapCtrl.navigateToLocation === 'function') {
      window.mapCtrl.navigateToLocation(lat, lng, name, cat);
    } else if (window.app && typeof window.app.showToast === 'function') {
      window.app.showToast(`Locating ${name} on map...`, 'info');
    }
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
    if (window.app && window.app.selectedCity) {
      citySelect.value = window.app.selectedCity.id;
    }
  }

  bindEvents() {
    // Duration buttons (1, 2, 3, 4, 5, 7 days)
    document.querySelectorAll('.planner-day-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.planner-day-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedDays = Number(btn.dataset.days);
      });
    });

    // Budget cards (budget, moderate, luxury)
    document.querySelectorAll('.budget-toggle-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.budget-toggle-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.selectedBudget = card.dataset.budget;
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
    const cityId = citySelect ? Number(citySelect.value) : (window.app.selectedCity ? window.app.selectedCity.id : 1);

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
      const user = window.api.getCurrentUser();
      const params = {
        city_id: cityId,
        days: this.selectedDays,
        interests: this.selectedInterests,
        budget: this.selectedBudget,
        user_id: user ? user.id : null
      };

      const plan = await window.api.generateTripPlan(params);

      if (!plan || !plan.itinerary || !plan.itinerary.length) {
        resultsContainer.innerHTML = `
          <div style="text-align: center; padding: 40px; color: #ef4444; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 2.5rem; margin-bottom: 12px;"></i>
            <h4 style="color: #fff; font-size: 1.2rem;">Could Not Generate Itinerary</h4>
            <p style="color: var(--text-secondary); margin-top: 6px;">Please choose another destination city or adjust your criteria.</p>
          </div>
        `;
        return;
      }

      this.renderItinerary(plan, resultsContainer);
    } catch (err) {
      console.error('Error generating trip plan:', err);
      resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #ef4444; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
          <i class="fa-solid fa-circle-exclamation" style="font-size: 2.5rem; margin-bottom: 12px;"></i>
          <h4 style="color: #fff; font-size: 1.2rem;">An Unexpected Error Occurred</h4>
          <p style="color: var(--text-secondary); margin-top: 6px;">Please try again in a few moments.</p>
        </div>
      `;
    } finally {
      this.isGenerating = false;
      if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Smart Itinerary';
      }
    }
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
              <i class="fa-solid fa-location-dot" style="color: var(--primary-light); margin-right: 4px;"></i> ${plan.city.name}, ${plan.city.state}
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
                      <i class="fa-solid fa-star"></i> ${day.meals.breakfast.restaurant.rating} (${day.meals.breakfast.restaurant.price_level || '$$'})
                    </span>
                    <button class="btn btn-outline btn-xs" onclick="window.plannerCtrl.navigateToLocation(${day.meals.breakfast.restaurant.lat || 0}, ${day.meals.breakfast.restaurant.lng || 0}, '${this.escapeJs(day.meals.breakfast.restaurant.name)}', 'restaurant')">
                      <i class="fa-solid fa-map-location-dot"></i> Map
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
                      <i class="fa-solid fa-star"></i> ${day.meals.lunch.restaurant.rating} (${day.meals.lunch.restaurant.price_level || '$$'})
                    </span>
                    <button class="btn btn-outline btn-xs" onclick="window.plannerCtrl.navigateToLocation(${day.meals.lunch.restaurant.lat || 0}, ${day.meals.lunch.restaurant.lng || 0}, '${this.escapeJs(day.meals.lunch.restaurant.name)}', 'restaurant')">
                      <i class="fa-solid fa-map-location-dot"></i> Map
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
                      <i class="fa-solid fa-star"></i> ${day.meals.dinner.restaurant.rating} (${day.meals.dinner.restaurant.price_level || '$$$'})
                    </span>
                    <button class="btn btn-outline btn-xs" onclick="window.plannerCtrl.navigateToLocation(${day.meals.dinner.restaurant.lat || 0}, ${day.meals.dinner.restaurant.lng || 0}, '${this.escapeJs(day.meals.dinner.restaurant.name)}', 'restaurant')">
                      <i class="fa-solid fa-map-location-dot"></i> Map
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
                      <img src="${spot.place.image_url}" alt="${spot.place.name}" class="spot-thumb" />
                    ` : ''}

                    <div style="flex: 1;">
                      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                        <h5 style="font-size: 1.12rem; font-weight: 700; color: #fff; margin: 0;">
                          ${spot.place ? spot.place.name : spot.slot_name}
                        </h5>
                        ${spot.place ? `
                          <button class="btn btn-primary btn-xs" onclick="window.plannerCtrl.navigateToLocation(${spot.place.lat || 0}, ${spot.place.lng || 0}, '${this.escapeJs(spot.place.name)}', '${this.escapeJs(spot.place.category_slug || 'temple')}')" title="Locate on Map">
                            <i class="fa-solid fa-location-arrow"></i> View on Map
                          </button>
                        ` : ''}
                      </div>

                      <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 6px 0 0; line-height: 1.45;">
                        ${spot.place ? spot.place.description : spot.activity}
                      </p>

                      <div class="spot-meta-row">
                        ${spot.place ? `
                          <span><i class="fa-solid fa-tag" style="color: var(--primary-light);"></i> ${spot.place.category_name || 'Landmark'}</span>
                          <span><i class="fa-solid fa-star" style="color: var(--accent-amber);"></i> ${spot.place.rating} (${spot.place.review_count || 120} reviews)</span>
                          <span><i class="fa-solid fa-door-open" style="color: var(--secondary-light);"></i> ${spot.place.opening_hours || 'Open Daily'}</span>
                        ` : ''}
                      </div>

                      <div class="spot-tip-box">
                        <i class="fa-solid fa-lightbulb" style="color: var(--primary-light); margin-right: 4px;"></i>
                        <strong>Traveler Tip:</strong> ${spot.tip}
                      </div>
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
                  <div>
                    <strong>Suggested Stay (${day.suggested_hotel.price_level})</strong>
                    <span>${day.suggested_hotel.name} • ${day.suggested_hotel.address}</span>
                  </div>
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
