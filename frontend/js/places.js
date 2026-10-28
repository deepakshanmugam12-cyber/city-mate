/**
 * CITYMATE — Tourist Places, Favourites & Reviews Controller
 * Direct Supabase PostgreSQL Database Integration
 */

(function () {
  'use strict';

  class CityMatePlacesManager {
    constructor() {
      this.places = [];
      this.cities = [];
      this.userFavourites = new Set();
      this.selectedCityId = 'all';
      this.selectedCategory = 'all';
      this.searchQuery = '';
      this.currentSort = 'rating_desc';
      this.activePlaceForReview = null;
    }

    getClient() {
      return window.citymateSupabase ? window.citymateSupabase.getClient() : null;
    }

    getUser() {
      return window.authCtrl ? window.authCtrl.getUser() : null;
    }

    /**
     * Fetch all supported cities from Supabase (or fallback)
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
        } catch (err) {
          console.warn('[CityMate Places] Error loading cities from Supabase:', err);
        }
      }

      // Fallback
      if (typeof SEED_DATA !== 'undefined' && SEED_DATA.cities) {
        this.cities = SEED_DATA.cities;
      }
      return this.cities;
    }

    /**
     * Fetch user's favourite place IDs from Supabase
     */
    async fetchUserFavourites() {
      const client = this.getClient();
      const user = this.getUser();
      this.userFavourites.clear();

      if (!client || !user) {
        return this.userFavourites;
      }

      try {
        const { data, error } = await client
          .from('favourites')
          .select('place_id')
          .eq('user_id', user.id);

        if (!error && data) {
          data.forEach(item => this.userFavourites.add(Number(item.place_id)));
        }
      } catch (err) {
        console.warn('[CityMate Places] Error loading favourites:', err);
      }
      return this.userFavourites;
    }

    /**
     * Fetch places from Supabase with filters
     */
    async fetchPlaces() {
      const client = this.getClient();

      if (client) {
        try {
          let query = client
            .from('places')
            .select(`
              id,
              city_id,
              name,
              description,
              category,
              image_url,
              address,
              latitude,
              longitude,
              opening_hours,
              entry_fee,
              rating,
              created_at,
              cities ( id, name, state )
            `);

          if (this.selectedCityId && this.selectedCityId !== 'all') {
            query = query.eq('city_id', Number(this.selectedCityId));
          }

          if (this.selectedCategory && this.selectedCategory !== 'all') {
            query = query.ilike('category', `%${this.selectedCategory}%`);
          }

          if (this.searchQuery && this.searchQuery.trim()) {
            query = query.ilike('name', `%${this.searchQuery.trim()}%`);
          }

          if (this.currentSort === 'rating_desc') {
            query = query.order('rating', { ascending: false });
          } else if (this.currentSort === 'name_asc') {
            query = query.order('name', { ascending: true });
          }

          const { data, error } = await query;
          if (!error && data && data.length > 0) {
            // Format places
            this.places = data.map(p => ({
              id: p.id,
              city_id: p.city_id,
              city_name: p.cities ? p.cities.name : 'Tamil Nadu',
              name: p.name,
              description: p.description,
              category_name: p.category,
              category_slug: p.category.toLowerCase().replace(/[^a-z0-9]/g, ''),
              image_url: p.image_url,
              address: p.address,
              lat: p.latitude,
              lng: p.longitude,
              opening_hours: p.opening_hours,
              entry_fee: p.entry_fee,
              rating: p.rating || 4.5
            }));
            return this.places;
          }
        } catch (err) {
          console.warn('[CityMate Places] Live Supabase query failed, using fallback:', err);
        }
      }

      // Offline / Seed Fallback
      let list = (typeof SEED_DATA !== 'undefined' && SEED_DATA.places) ? [...SEED_DATA.places] : [];
      if (this.selectedCityId && this.selectedCityId !== 'all') {
        list = list.filter(p => Number(p.city_id) === Number(this.selectedCityId));
      }
      if (this.selectedCategory && this.selectedCategory !== 'all') {
        list = list.filter(p => (p.category_slug || '').toLowerCase().includes(this.selectedCategory.toLowerCase()) ||
                                (p.category_name || '').toLowerCase().includes(this.selectedCategory.toLowerCase()));
      }
      if (this.searchQuery && this.searchQuery.trim()) {
        const q = this.searchQuery.trim().toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
      }
      if (this.currentSort === 'rating_desc') {
        list.sort((a, b) => b.rating - a.rating);
      } else if (this.currentSort === 'name_asc') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      }
      this.places = list;
      return this.places;
    }

    /**
     * Render Places Grid into DOM
     */
    async renderPlacesGrid(containerId = 'places-grid') {
      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-secondary);">
          <i class="fa-solid fa-spinner fa-spin" style="font-size: 2.2rem; color: var(--primary-light);"></i>
          <p style="margin-top: 14px; font-weight: 600;">Connecting to Supabase & retrieving tourist destinations...</p>
        </div>
      `;

      await this.fetchUserFavourites();
      const places = await this.fetchPlaces();

      if (!places || places.length === 0) {
        container.innerHTML = `
          <div class="empty-state-box">
            <i class="fa-solid fa-mountain-sun empty-state-icon"></i>
            <h3 class="empty-state-title">No Tourist Places Found</h3>
            <p class="empty-state-desc">We couldn't find any places matching your criteria. Try changing the category filter or searching with different keywords.</p>
            <button class="btn btn-outline btn-sm" onclick="window.placesManager.resetFilters()">
              <i class="fa-solid fa-rotate-left"></i> Reset All Filters
            </button>
          </div>
        `;
        return;
      }

      container.innerHTML = places.map(p => this.createPlaceCardHtml(p)).join('');
    }

    /**
     * Generate HTML for Place Card
     */
    createPlaceCardHtml(p) {
      const isFav = this.userFavourites.has(Number(p.id));
      const feeText = (!p.entry_fee || p.entry_fee === '0' || p.entry_fee === 0 || p.entry_fee === 'Free') ? 'Free Entry' : p.entry_fee;

      // Category Icon Map
      const iconMap = {
        temple: 'fa-om',
        nature: 'fa-tree',
        historical: 'fa-landmark',
        beach: 'fa-umbrella-beach',
        rural: 'fa-wheat-awn',
        shopping: 'fa-bag-shopping',
        adventure: 'fa-compass',
        museum: 'fa-building-columns',
        entertainment: 'fa-film'
      };
      const catKey = (p.category_slug || p.category_name || '').toLowerCase();
      let icon = 'fa-mountain-sun';
      for (const [k, v] of Object.entries(iconMap)) {
        if (catKey.includes(k)) { icon = v; break; }
      }

      return `
        <div class="place-card" data-id="${p.id}">
          <div class="place-card-image-wrap">
            <img src="${p.image_url}" alt="${p.name}" class="place-card-image" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800'" />
            <div class="place-card-overlay"></div>
            <div class="place-card-badge">
              <i class="fa-solid ${icon}"></i>
              ${p.category_name || 'Attraction'}
            </div>
            <button class="place-fav-btn ${isFav ? 'favorited' : ''}"
                    onclick="window.placesManager.toggleFavourite(${p.id}, this)"
                    title="${isFav ? 'Remove from favourites' : 'Save to favourites'}">
              <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart" style="${isFav ? 'color: #f43f5e;' : ''}"></i>
            </button>
            <div class="place-card-rating">
              <i class="fa-solid fa-star"></i>
              <span>${Number(p.rating).toFixed(1)}</span>
            </div>
          </div>

          <div class="place-card-body">
            <h3 class="place-card-title">${p.name}</h3>
            <div class="place-card-location">
              <i class="fa-solid fa-location-dot"></i>
              <span>${p.city_name || 'CityMate Destination'}</span>
            </div>
            <p class="place-card-desc">${p.description || 'Discover breathtaking sights and rich cultural heritage at this iconic destination.'}</p>
            
            <div class="place-card-meta">
              <div class="place-fee ${feeText === 'Free Entry' ? 'free' : ''}">
                <i class="fa-solid fa-ticket" style="margin-right: 4px;"></i>
                ${feeText}
              </div>
              <div class="place-timing">
                <i class="fa-regular fa-clock" style="margin-right: 4px;"></i>
                ${p.opening_hours || '09:00 AM - 06:00 PM'}
              </div>
            </div>

            <div class="place-card-footer" style="display:flex; gap:8px;">
              <button class="btn btn-primary btn-sm" style="flex:1;" onclick="window.placesManager.openReviewsModal(${p.id})">
                <i class="fa-solid fa-comments"></i> Reviews &amp; Details
              </button>
              <button class="btn btn-secondary btn-icon-only" title="Get Directions on Map" onclick="window.placesManager.openDirections(${p.lat}, ${p.lng}, '${p.name.replace(/'/g, "\\'")}')">
                <i class="fa-solid fa-diamond-turn-right"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    /**
     * Toggle favourite place in Supabase
     */
    async toggleFavourite(placeId, btnElement) {
      const client = this.getClient();
      const user = this.getUser();

      if (!user) {
        if (window.app && window.app.showToast) {
          window.app.showToast('Please sign in to save your favourite places!', 'info');
        } else {
          alert('Please sign in to save your favourite places.');
        }
        window.location.href = `login.html?next=places.html`;
        return;
      }

      const isFav = this.userFavourites.has(Number(placeId));

      try {
        if (client) {
          if (isFav) {
            // Delete from favourites
            const { error } = await client
              .from('favourites')
              .delete()
              .eq('user_id', user.id)
              .eq('place_id', Number(placeId));

            if (error) throw error;
            this.userFavourites.delete(Number(placeId));
          } else {
            // Insert into favourites
            const { error } = await client
              .from('favourites')
              .insert({
                user_id: user.id,
                place_id: Number(placeId)
              });

            if (error) throw error;
            this.userFavourites.add(Number(placeId));
          }
        } else {
          // Fallback toggle
          if (isFav) this.userFavourites.delete(Number(placeId));
          else this.userFavourites.add(Number(placeId));
        }

        // Update button visual
        const nowFav = this.userFavourites.has(Number(placeId));
        if (btnElement) {
          btnElement.classList.toggle('favorited', nowFav);
          const icon = btnElement.querySelector('i');
          if (icon) {
            icon.className = nowFav ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
            icon.style.color = nowFav ? '#f43f5e' : '';
          }
        }

        const msg = nowFav ? 'Added to your favourites wishlist!' : 'Removed from favourites.';
        if (window.app && window.app.showToast) {
          window.app.showToast(msg, 'success');
        } else {
          console.log(msg);
        }

      } catch (err) {
        console.error('[CityMate Places] Error toggling favourite:', err);
        alert('Could not update favourite: ' + (err.message || 'Unknown error'));
      }
    }

    /**
     * Open Reviews & Details Modal for a place
     */
    async openReviewsModal(placeId) {
      const place = this.places.find(p => Number(p.id) === Number(placeId));
      if (!place) return;
      this.activePlaceForReview = place;

      let modal = document.getElementById('place-reviews-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'place-reviews-modal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
      }

      modal.innerHTML = `
        <div class="modal-dialog modal-lg">
          <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center; padding:18px 24px; border-bottom:1px solid var(--border-subtle);">
            <div>
              <h3 style="margin:0; font-size:1.3rem; font-weight:800; color:#fff;">${place.name}</h3>
              <span style="font-size:0.82rem; color:var(--text-secondary);"><i class="fa-solid fa-location-dot"></i> ${place.address || place.city_name}</span>
            </div>
            <button type="button" onclick="document.getElementById('place-reviews-modal').classList.remove('active')" style="background:none; border:none; color:var(--text-muted); font-size:1.4rem; cursor:pointer;">&times;</button>
          </div>

          <div class="modal-body" style="padding:24px; max-height:75vh; overflow-y:auto;">
            <!-- Place Summary Header -->
            <div style="display:flex; gap:20px; margin-bottom:24px; flex-wrap:wrap;">
              <img src="${place.image_url}" alt="${place.name}" style="width:100%; max-width:280px; height:180px; object-fit:cover; border-radius:var(--radius-md);" />
              <div style="flex:1; min-width:260px;">
                <p style="font-size:0.92rem; color:var(--text-secondary); line-height:1.6; margin-bottom:16px;">${place.description}</p>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.85rem;">
                  <div style="background:var(--bg-card); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
                    <strong style="color:var(--text-muted); display:block; font-size:0.75rem;">ENTRY FEE</strong>
                    <span style="color:var(--accent-emerald); font-weight:700;">${place.entry_fee || 'Free Entry'}</span>
                  </div>
                  <div style="background:var(--bg-card); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
                    <strong style="color:var(--text-muted); display:block; font-size:0.75rem;">TIMINGS</strong>
                    <span style="color:#fff; font-weight:600;">${place.opening_hours || 'Open Daily'}</span>
                  </div>
                  <div style="background:var(--bg-card); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
                    <strong style="color:var(--text-muted); display:block; font-size:0.75rem;">CURRENT RATING</strong>
                    <span style="color:var(--accent-amber); font-weight:700;"><i class="fa-solid fa-star"></i> ${Number(place.rating).toFixed(1)} / 5.0</span>
                  </div>
                  <div style="background:var(--bg-card); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
                    <strong style="color:var(--text-muted); display:block; font-size:0.75rem;">LOCATION DIRECTIONS</strong>
                    <a href="map.html?destination=${place.lat},${place.lng}&name=${encodeURIComponent(place.name)}" style="color:var(--secondary-light); text-decoration:none; font-weight:600;"><i class="fa-solid fa-map-location-dot"></i> View on Map &amp; Route</a>
                  </div>
                </div>
              </div>
            </div>

            <hr style="border:none; border-top:1px solid var(--border-subtle); margin:24px 0;" />

            <!-- Add Review Form -->
            <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:20px; margin-bottom:24px;">
              <h4 style="margin:0 0 12px 0; color:#fff; font-size:1.05rem;"><i class="fa-solid fa-pen-to-square" style="color:var(--primary-light);"></i> Leave a Review &amp; Rating</h4>
              
              <div id="review-auth-notice" style="${this.getUser() ? 'display:none;' : 'display:block;'} background:rgba(2,132,199,0.1); border:1px solid rgba(2,132,199,0.3); border-radius:var(--radius-sm); padding:10px 14px; margin-bottom:12px; font-size:0.85rem; color:#bae6fd;">
                <i class="fa-solid fa-circle-info"></i> Please <a href="login.html" style="color:#fff; font-weight:700; text-decoration:underline;">sign in</a> to submit a verified rating and comment.
              </div>

              <form id="submit-review-form" onsubmit="window.placesManager.submitReview(event, ${place.id})">
                <div style="margin-bottom:14px;">
                  <label style="display:block; font-size:0.82rem; font-weight:600; color:var(--text-secondary); margin-bottom:6px;">Your Rating (1 to 5 Stars):</label>
                  <div class="interactive-stars" id="review-stars-picker" style="display:flex; gap:8px; font-size:1.5rem; color:var(--text-muted); cursor:pointer;">
                    <i class="fa-solid fa-star active" data-rating="1" onclick="window.placesManager.setStarRating(1)" style="color:var(--accent-amber);"></i>
                    <i class="fa-solid fa-star active" data-rating="2" onclick="window.placesManager.setStarRating(2)" style="color:var(--accent-amber);"></i>
                    <i class="fa-solid fa-star active" data-rating="3" onclick="window.placesManager.setStarRating(3)" style="color:var(--accent-amber);"></i>
                    <i class="fa-solid fa-star active" data-rating="4" onclick="window.placesManager.setStarRating(4)" style="color:var(--accent-amber);"></i>
                    <i class="fa-solid fa-star active" data-rating="5" onclick="window.placesManager.setStarRating(5)" style="color:var(--accent-amber);"></i>
                  </div>
                  <input type="hidden" id="selected-review-rating" value="5" />
                </div>

                <div style="margin-bottom:14px;">
                  <label style="display:block; font-size:0.82rem; font-weight:600; color:var(--text-secondary); margin-bottom:6px;">Your Review / Travel Tip:</label>
                  <textarea id="review-comment-input" class="form-control" rows="3" placeholder="Share your experience, tips for travelers, best time to visit..." required ${this.getUser() ? '' : 'disabled'}></textarea>
                </div>

                <button type="submit" class="btn btn-primary btn-sm" id="btn-submit-review" ${this.getUser() ? '' : 'disabled'}>
                  <i class="fa-solid fa-paper-plane"></i> Post Review
                </button>
              </form>
            </div>

            <!-- Existing Reviews List -->
            <h4 style="color:#fff; font-size:1.05rem; margin-bottom:16px;">Traveler Reviews</h4>
            <div id="place-reviews-list">
              <div style="text-align:center; padding:30px; color:var(--text-muted);">
                <i class="fa-solid fa-spinner fa-spin"></i> Loading reviews from Supabase...
              </div>
            </div>
          </div>
        </div>
      `;

      modal.classList.add('active');
      this.loadReviewsForPlace(placeId);
    }

    setStarRating(val) {
      document.getElementById('selected-review-rating').value = val;
      const stars = document.querySelectorAll('#review-stars-picker i');
      stars.forEach((star, idx) => {
        if (idx < val) {
          star.className = 'fa-solid fa-star active';
          star.style.color = 'var(--accent-amber)';
        } else {
          star.className = 'fa-regular fa-star';
          star.style.color = 'var(--text-muted)';
        }
      });
    }

    /**
     * Load reviews from Supabase reviews table
     */
    async loadReviewsForPlace(placeId) {
      const container = document.getElementById('place-reviews-list');
      if (!container) return;

      const client = this.getClient();
      const currentUser = this.getUser();
      let reviews = [];

      if (client) {
        try {
          // Query place_reviews_view or reviews joined with profiles
          const { data, error } = await client
            .from('place_reviews_view')
            .select('*')
            .eq('place_id', Number(placeId))
            .order('created_at', { ascending: false });

          if (!error && data) {
            reviews = data;
          } else {
            // Fallback direct query on reviews
            const { data: rawReviews } = await client
              .from('reviews')
              .select('*')
              .eq('place_id', Number(placeId))
              .order('created_at', { ascending: false });
            if (rawReviews) reviews = rawReviews;
          }
        } catch (err) {
          console.warn('[CityMate Places] Error loading reviews from Supabase:', err);
        }
      }

      if (reviews.length === 0) {
        container.innerHTML = `
          <div style="text-align:center; padding:24px; background:var(--bg-card); border-radius:var(--radius-md); border:1px dashed var(--border-subtle); color:var(--text-muted);">
            <i class="fa-regular fa-comment-dots" style="font-size:2rem; margin-bottom:8px; display:block;"></i>
            Be the first traveler to leave a review for this destination!
          </div>
        `;
        return;
      }

      container.innerHTML = reviews.map(r => {
        const isAuthor = currentUser && currentUser.id === r.user_id;
        const starHtml = Array(5).fill(0).map((_, i) =>
          `<i class="fa-solid fa-star" style="color:${i < r.rating ? 'var(--accent-amber)' : 'var(--border-subtle)'}; font-size:0.75rem;"></i>`
        ).join('');

        const dateStr = r.created_at ? new Date(r.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently';

        return `
          <div class="review-item-card" id="review-row-${r.id}">
            <div class="review-item-header">
              <div class="review-user-info">
                <img src="${r.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" alt="Avatar" class="review-user-avatar" />
                <div>
                  <div class="review-user-name">${r.user_name || 'Traveler'}</div>
                  <div class="review-date">${dateStr}</div>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <div style="display:flex; gap:2px;">${starHtml}</div>
                ${isAuthor ? `
                  <button type="button" class="btn btn-danger btn-sm" onclick="window.placesManager.deleteReview(${r.id}, ${placeId})" title="Delete your review" style="padding:2px 8px; font-size:0.75rem;">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                ` : ''}
              </div>
            </div>
            <p class="review-comment">${r.comment}</p>
          </div>
        `;
      }).join('');
    }

    /**
     * Submit review to Supabase reviews table
     */
    async submitReview(e, placeId) {
      e.preventDefault();
      const user = this.getUser();
      if (!user) {
        alert('Please sign in to submit a review.');
        return;
      }

      const client = this.getClient();
      const rating = parseInt(document.getElementById('selected-review-rating').value, 10);
      const comment = document.getElementById('review-comment-input').value.trim();

      if (!comment) {
        alert('Please write a brief comment before submitting.');
        return;
      }

      const submitBtn = document.getElementById('btn-submit-review');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

      try {
        if (client) {
          const { error } = await client
            .from('reviews')
            .insert({
              place_id: Number(placeId),
              user_id: user.id,
              rating: rating,
              comment: comment
            });

          if (error) throw error;
        }

        document.getElementById('review-comment-input').value = '';
        if (window.app && window.app.showToast) {
          window.app.showToast('Your review has been posted successfully!', 'success');
        } else {
          alert('Your review has been posted successfully!');
        }

        // Reload reviews & update list
        await this.loadReviewsForPlace(placeId);

      } catch (err) {
        console.error('[CityMate Places] Review submission failed:', err);
        alert('Failed to submit review: ' + (err.message || 'Please try again.'));
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Post Review';
      }
    }

    /**
     * Delete user's own review
     */
    async deleteReview(reviewId, placeId) {
      if (!confirm('Are you sure you want to delete your review?')) return;
      const client = this.getClient();
      const user = this.getUser();
      if (!client || !user) return;

      try {
        const { error } = await client
          .from('reviews')
          .delete()
          .eq('id', Number(reviewId))
          .eq('user_id', user.id);

        if (error) throw error;
        this.loadReviewsForPlace(placeId);
      } catch (err) {
        alert('Could not delete review: ' + err.message);
      }
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
     * Filter handlers
     */
    setCityFilter(cityId) {
      this.selectedCityId = cityId;
      this.renderPlacesGrid();
    }

    setCategoryFilter(categorySlug, btnElement) {
      this.selectedCategory = categorySlug;
      document.querySelectorAll('.category-pill').forEach(el => el.classList.remove('active'));
      if (btnElement) btnElement.classList.add('active');
      this.renderPlacesGrid();
    }

    setSearchQuery(q) {
      this.searchQuery = q;
      this.renderPlacesGrid();
    }

    setSortBy(sortVal) {
      this.currentSort = sortVal;
      this.renderPlacesGrid();
    }

    resetFilters() {
      this.selectedCityId = 'all';
      this.selectedCategory = 'all';
      this.searchQuery = '';
      this.currentSort = 'rating_desc';

      const searchInput = document.getElementById('places-search-input');
      if (searchInput) searchInput.value = '';

      const citySelect = document.getElementById('places-city-select');
      if (citySelect) citySelect.value = 'all';

      document.querySelectorAll('.category-pill').forEach(el => {
        el.classList.toggle('active', el.dataset.cat === 'all');
      });

      this.renderPlacesGrid();
    }
  }

  // Expose singleton instance
  window.placesManager = new CityMatePlacesManager();
  window.placesCtrl = window.placesManager; // alias for backwards compatibility

})();
