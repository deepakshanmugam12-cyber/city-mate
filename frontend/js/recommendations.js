/**
 * CityMate Personalized Tourist Recommendation Module
 */

class RecommendationsController {
  constructor() {
    this.selectedInterests = ['nature', 'temple'];
    this.selectedBudget = 'medium';
    this.selectedTime = 'full-day';
    this.selectedDistance = 25;
  }

  init() {
    this.bindEvents();
    this.fetchAndRenderRecommendations();
  }

  bindEvents() {
    // Interest badges toggle
    document.querySelectorAll('.recom-interest-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.dataset.val;
        if (this.selectedInterests.includes(val)) {
          if (this.selectedInterests.length > 1) {
            this.selectedInterests = this.selectedInterests.filter(i => i !== val);
            chip.classList.remove('active');
          } else {
            window.app.showToast('Please keep at least one interest selected.', 'info');
          }
        } else {
          this.selectedInterests.push(val);
          chip.classList.add('active');
        }
      });
    });

    // Budget selector
    document.querySelectorAll('.recom-budget-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.recom-budget-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedBudget = btn.dataset.val;
      });
    });

    // Time selector
    const timeSelect = document.getElementById('recom-time-select');
    if (timeSelect) {
      timeSelect.addEventListener('change', (e) => {
        this.selectedTime = e.target.value;
      });
    }

    // Distance slider
    const distSlider = document.getElementById('recom-distance-slider');
    const distValue = document.getElementById('recom-distance-val');
    if (distSlider && distValue) {
      distSlider.addEventListener('input', (e) => {
        distValue.textContent = `${e.target.value} km`;
        this.selectedDistance = Number(e.target.value);
      });
    }

    // Submit button
    const submitBtn = document.getElementById('btn-get-recommendations');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this.fetchAndRenderRecommendations();
      });
    }
  }

  async fetchAndRenderRecommendations() {
    const container = document.getElementById('recommendations-grid');
    if (!container) return;

    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">
        <i class="fa-solid fa-wand-magic-sparkles fa-spin" style="font-size: 2.2rem; color: var(--primary-light);"></i>
        <p style="margin-top: 14px; font-weight: 600;">Personalizing destinations tailored to your preferences...</p>
      </div>
    `;

    const city = window.app ? window.app.selectedCity : null;
    const params = {
      city_id: city ? city.id : 'all',
      interests: this.selectedInterests,
      budget: this.selectedBudget,
      available_time: this.selectedTime,
      max_distance: this.selectedDistance
    };

    const recs = await window.api.getRecommendations(params);

    if (!recs || recs.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 50px; background: var(--bg-card); border-radius: var(--radius-lg);">
          <p style="color: var(--text-secondary);">No direct matches found. Try broadening your interests or increasing your distance slider.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = recs.map(place => this.createRecommendationCardHtml(place)).join('');
  }

  createRecommendationCardHtml(place) {
    const isFav = window.api.isFavorite(place.id);
    const feeText = place.entry_fee === 0 ? 'Free Entry' : `₹${place.entry_fee}`;

    return `
      <div class="place-card recom-card" data-id="${place.id}">
        <!-- AI/Match Rationale Banner -->
        <div style="background: linear-gradient(90deg, rgba(13, 148, 136, 0.25) 0%, rgba(2, 132, 199, 0.2) 100%); border-bottom: 1px solid rgba(13, 148, 136, 0.35); padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--primary-light); display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-sparkles"></i>
            <span>${place.match_percentage || 95}% Match for You</span>
          </div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">AI Scored</span>
        </div>

        <div class="place-card-image-wrap">
          <img src="${place.image_url}" alt="${place.name}" class="place-card-image" loading="lazy" />
          <div class="place-card-overlay"></div>
          <div class="place-card-badge">
            <i class="fa-solid ${place.category_icon || 'fa-landmark'}"></i>
            ${place.category_name}
          </div>
          <button class="place-fav-btn ${isFav ? 'favorited' : ''}" 
                  onclick="event.stopPropagation(); window.placesCtrl.handleFavoriteToggle(${place.id}, this)">
            <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
          <div class="place-card-rating">
            <i class="fa-solid fa-star"></i>
            <span>${place.rating}</span>
          </div>
        </div>

        <div class="place-card-body">
          <h3 class="place-card-title">${place.name}</h3>
          
          <!-- Recommendation Reason Quote -->
          <div style="background: rgba(10, 15, 29, 0.7); border-left: 3px solid var(--primary-light); padding: 8px 12px; border-radius: 4px; font-size: 0.84rem; color: #cbd5e1; margin-bottom: 12px; font-style: italic;">
            "${place.recommendation_reason}"
          </div>

          <div class="place-card-location">
            <i class="fa-solid fa-location-dot"></i>
            <span>${place.city_name} • ${place.distance_km} km away</span>
          </div>
          
          <div class="place-card-meta">
            <div class="place-fee ${place.entry_fee === 0 ? 'free' : ''}">
              ${feeText}
            </div>
            <div class="place-timing">
              ${place.opening_hours || 'Open Daily'}
            </div>
          </div>

          <div class="place-card-footer" style="display: flex; gap: 8px; align-items: center;">
            <button class="btn btn-primary" style="flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px;" 
                    onclick="event.stopPropagation(); window.bookingCtrl.openBookingModal(${place.id})">
              <i class="fa-solid fa-calendar-check"></i>
              <span>Book Now</span>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.placesCtrl.openPlaceDetails(${place.id})" title="View Details">
              <span>Details</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button class="btn btn-secondary btn-icon-only" onclick="window.mapCtrl.navigateToLocation(${place.lat}, ${place.lng}, '${place.name.replace(/'/g, "\\'")}')" title="Directions">
              <i class="fa-solid fa-diamond-turn-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

window.recomCtrl = new RecommendationsController();
