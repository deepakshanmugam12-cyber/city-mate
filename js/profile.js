/**
 * CITYMATE — User Profile, Saved Favourites & User Reviews Controller
 * Direct Supabase PostgreSQL & Auth Integration
 */

(function () {
  'use strict';

  class CityMateProfileManager {
    constructor() {
      this.user = null;
      this.profile = null;
      this.favourites = [];
      this.reviews = [];
    }

    getClient() {
      return window.citymateSupabase ? window.citymateSupabase.getClient() : null;
    }

    /**
     * Initialize profile page: protect route, load user data, favourites, and reviews
     */
    async init() {
      // 1. Enforce Authentication Requirement
      if (window.authCtrl) {
        this.user = await window.authCtrl.requireAuth('profile.html');
      }

      if (!this.user) {
        // If requireAuth redirected, return
        return;
      }

      // 2. Load user profile details
      await this.loadUserProfile();

      // 3. Load user favourites from Supabase favourites table
      await this.loadUserFavourites();

      // 4. Load user reviews from Supabase reviews table
      await this.loadUserReviews();
    }

    /**
     * Load user profile row from Supabase profiles table
     */
    async loadUserProfile() {
      const client = this.getClient();
      const user = this.user;
      if (!user) return;

      let fullName = (user.user_metadata && user.user_metadata.full_name) ||
                     (user.email ? user.email.split('@')[0] : 'CityMate Traveler');
      let avatarUrl = (user.user_metadata && user.user_metadata.avatar_url) ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

      if (client) {
        try {
          const { data, error } = await client
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (!error && data) {
            this.profile = data;
            fullName = data.full_name || fullName;
            avatarUrl = data.avatar_url || avatarUrl;
          }
        } catch (e) {
          console.warn('[CityMate Profile] Profile table read notice:', e);
        }
      }

      // Update UI Elements
      const nameHeader = document.getElementById('profile-display-name');
      const emailHeader = document.getElementById('profile-display-email');
      const avatarImg = document.getElementById('profile-avatar-img');
      const inputName = document.getElementById('profile-input-name');
      const inputAvatar = document.getElementById('profile-input-avatar');
      const joinedDate = document.getElementById('profile-joined-date');

      if (nameHeader) nameHeader.textContent = fullName;
      if (emailHeader) emailHeader.textContent = user.email || 'traveler@citymate.com';
      if (avatarImg) avatarImg.src = avatarUrl;
      if (inputName) inputName.value = fullName;
      if (inputAvatar) inputAvatar.value = avatarUrl;

      if (joinedDate && user.created_at) {
        const d = new Date(user.created_at);
        joinedDate.textContent = 'Member since ' + d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      }
    }

    /**
     * Update user full name and avatar URL
     */
    async updateProfile(e) {
      e.preventDefault();
      const client = this.getClient();
      const user = this.user;

      if (!user) {
        alert('You must be logged in to update your profile.');
        return;
      }

      const inputName = document.getElementById('profile-input-name').value.trim();
      const inputAvatar = document.getElementById('profile-input-avatar').value.trim();

      if (!inputName) {
        alert('Please enter your full name.');
        return;
      }

      const btn = document.getElementById('btn-save-profile');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving changes...';

      try {
        // 1. Update Supabase Auth User Metadata
        if (client) {
          const { error: authErr } = await client.auth.updateUser({
            data: {
              full_name: inputName,
              avatar_url: inputAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(inputName)}`
            }
          });
          if (authErr) throw authErr;

          // 2. Update Supabase public.profiles table
          const { error: profErr } = await client
            .from('profiles')
            .upsert({
              id: user.id,
              full_name: inputName,
              email: user.email,
              avatar_url: inputAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(inputName)}`,
              updated_at: new Date().toISOString()
            });

          if (profErr) throw profErr;
        }

        // Update UI
        const nameHeader = document.getElementById('profile-display-name');
        const avatarImg = document.getElementById('profile-avatar-img');
        if (nameHeader) nameHeader.textContent = inputName;
        if (avatarImg && inputAvatar) avatarImg.src = inputAvatar;

        const toast = document.getElementById('profile-save-success');
        if (toast) {
          toast.style.display = 'flex';
          setTimeout(() => { toast.style.display = 'none'; }, 4000);
        } else {
          alert('Profile updated successfully!');
        }

        // Update nav
        if (window.authCtrl) {
          user.user_metadata = user.user_metadata || {};
          user.user_metadata.full_name = inputName;
          user.user_metadata.avatar_url = inputAvatar;
          window.authCtrl.updateNavbar(user);
        }

      } catch (err) {
        console.error('[CityMate Profile] Error saving profile:', err);
        alert('Failed to save profile changes: ' + (err.message || 'Please try again.'));
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Profile';
      }
    }

    /**
     * Load user favourites from Supabase favourites table
     */
    async loadUserFavourites() {
      const container = document.getElementById('profile-favourites-grid');
      const countBadge = document.getElementById('profile-favourites-count');
      if (!container) return;

      const client = this.getClient();
      const user = this.user;
      let places = [];

      if (client && user) {
        try {
          const { data, error } = await client
            .from('favourites')
            .select(`
              id,
              place_id,
              created_at,
              places (
                id,
                name,
                description,
                category,
                image_url,
                address,
                latitude,
                longitude,
                entry_fee,
                opening_hours,
                rating,
                cities ( id, name )
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (!error && data) {
            places = data.filter(item => item.places).map(item => ({
              favourite_id: item.id,
              id: item.places.id,
              name: item.places.name,
              description: item.places.description,
              category_name: item.places.category,
              image_url: item.places.image_url,
              address: item.places.address,
              city_name: item.places.cities ? item.places.cities.name : 'Tamil Nadu',
              lat: item.places.latitude,
              lng: item.places.longitude,
              entry_fee: item.places.entry_fee,
              opening_hours: item.places.opening_hours,
              rating: item.places.rating || 4.5
            }));
          }
        } catch (err) {
          console.warn('[CityMate Profile] Error querying favourites from Supabase:', err);
        }
      }

      this.favourites = places;
      if (countBadge) countBadge.textContent = places.length;

      if (places.length === 0) {
        container.innerHTML = `
          <div class="empty-state-box" style="padding:40px 20px;">
            <i class="fa-regular fa-heart empty-state-icon" style="color:var(--accent-rose);"></i>
            <h3 class="empty-state-title" style="font-size:1.15rem;">No Favourites Saved Yet</h3>
            <p class="empty-state-desc" style="font-size:0.88rem;">Explore tourist attractions and click the heart icon on any place to save it to your wishlist!</p>
            <a href="places.html" class="btn btn-primary btn-sm">
              <i class="fa-solid fa-compass"></i> Discover Tourist Places
            </a>
          </div>
        `;
        return;
      }

      container.innerHTML = places.map(p => `
        <div class="place-card" id="fav-card-${p.id}" data-id="${p.id}">
          <div class="place-card-image-wrap">
            <img src="${p.image_url}" alt="${p.name}" class="place-card-image" onerror="this.src='https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800'" />
            <div class="place-card-overlay"></div>
            <div class="place-card-badge">
              <i class="fa-solid fa-landmark"></i> ${p.category_name || 'Attraction'}
            </div>
            <div class="place-card-rating">
              <i class="fa-solid fa-star"></i>
              <span>${Number(p.rating).toFixed(1)}</span>
            </div>
          </div>

          <div class="place-card-body">
            <h3 class="place-card-title">${p.name}</h3>
            <div class="place-card-location">
              <i class="fa-solid fa-location-dot"></i>
              <span>${p.city_name}</span>
            </div>
            <p class="place-card-desc">${p.description}</p>
            
            <div class="place-card-footer" style="display:flex; gap:8px;">
              <button class="btn btn-danger btn-sm" style="flex:1;" onclick="window.profileManager.removeFavourite(${p.id})">
                <i class="fa-solid fa-trash-can"></i> Remove
              </button>
              <a href="map.html?destination=${p.lat},${p.lng}&name=${encodeURIComponent(p.name)}" class="btn btn-secondary btn-icon-only" title="View on Map &amp; Directions">
                <i class="fa-solid fa-diamond-turn-right"></i>
              </a>
            </div>
          </div>
        </div>
      `).join('');
    }

    /**
     * Remove a favourite item from Supabase
     */
    async removeFavourite(placeId) {
      if (!confirm('Remove this destination from your favourites?')) return;
      const client = this.getClient();
      const user = this.user;

      try {
        if (client && user) {
          const { error } = await client
            .from('favourites')
            .delete()
            .eq('user_id', user.id)
            .eq('place_id', Number(placeId));

          if (error) throw error;
        }

        // Animate card removal
        const card = document.getElementById(`fav-card-${placeId}`);
        if (card) {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          card.style.transition = 'all 0.3s ease';
          setTimeout(() => {
            card.remove();
            this.loadUserFavourites();
          }, 300);
        }

      } catch (err) {
        alert('Could not remove favourite: ' + err.message);
      }
    }

    /**
     * Load user reviews from Supabase reviews table
     */
    async loadUserReviews() {
      const container = document.getElementById('profile-reviews-list');
      const countBadge = document.getElementById('profile-reviews-count');
      if (!container) return;

      const client = this.getClient();
      const user = this.user;
      let reviews = [];

      if (client && user) {
        try {
          const { data, error } = await client
            .from('reviews')
            .select(`
              id,
              place_id,
              rating,
              comment,
              created_at,
              places ( id, name, category, image_url )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (!error && data) {
            reviews = data;
          }
        } catch (e) {
          console.warn('[CityMate Profile] Error fetching user reviews:', e);
        }
      }

      this.reviews = reviews;
      if (countBadge) countBadge.textContent = reviews.length;

      if (reviews.length === 0) {
        container.innerHTML = `
          <div class="empty-state-box" style="padding:40px 20px;">
            <i class="fa-regular fa-comment-dots empty-state-icon"></i>
            <h3 class="empty-state-title" style="font-size:1.15rem;">No Reviews Written Yet</h3>
            <p class="empty-state-desc" style="font-size:0.88rem;">Share your travel experiences and help fellow travelers by reviewing tourist places you've visited!</p>
            <a href="places.html" class="btn btn-primary btn-sm">
              <i class="fa-solid fa-mountain-sun"></i> Explore Places to Review
            </a>
          </div>
        `;
        return;
      }

      container.innerHTML = reviews.map(r => {
        const placeName = r.places ? r.places.name : 'Tourist Attraction';
        const dateStr = r.created_at ? new Date(r.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently';

        const starHtml = Array(5).fill(0).map((_, i) =>
          `<i class="fa-solid fa-star" style="color:${i < r.rating ? 'var(--accent-amber)' : 'var(--border-subtle)'}; font-size:0.8rem;"></i>`
        ).join('');

        return `
          <div class="review-item-card" id="user-review-${r.id}">
            <div class="review-item-header">
              <div>
                <strong style="color:#fff; font-size:0.95rem;">${placeName}</strong>
                <span class="review-date" style="margin-left:8px;">${dateStr}</span>
              </div>
              <div style="display:flex; align-items:center; gap:10px;">
                <div style="display:flex; gap:2px;">${starHtml}</div>
                <button type="button" class="btn btn-danger btn-sm" onclick="window.profileManager.deleteReview(${r.id})" style="padding:2px 8px; font-size:0.75rem;" title="Delete Review">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
            <p class="review-comment" style="margin:8px 0 0 0;">${r.comment}</p>
          </div>
        `;
      }).join('');
    }

    /**
     * Delete review
     */
    async deleteReview(reviewId) {
      if (!confirm('Are you sure you want to delete your review?')) return;
      const client = this.getClient();
      const user = this.user;

      try {
        if (client && user) {
          const { error } = await client
            .from('reviews')
            .delete()
            .eq('id', Number(reviewId))
            .eq('user_id', user.id);

          if (error) throw error;
        }

        const el = document.getElementById(`user-review-${reviewId}`);
        if (el) el.remove();
        this.loadUserReviews();

      } catch (err) {
        alert('Could not delete review: ' + err.message);
      }
    }
  }

  // Expose singleton
  window.profileManager = new CityMateProfileManager();
  window.profileCtrl = window.profileManager;

})();
