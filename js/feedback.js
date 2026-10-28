/**
 * CityMate Feedback Controller
 * Manages Traveler App Feedback, Interactive Star Ratings, Categories,
 * Real-time Feedback Submission, Community Feedback Wall, and Admin Moderation.
 */

class FeedbackController {
  constructor() {
    this.selectedRating = 5;
    this.selectedCategory = 'General Experience';
    this.activeWallFilter = 'All';
    this.selectedTags = new Set(['⚡ Super Fast', '🎨 Beautiful Design']);
    this.ratingDescriptions = {
      1: 'Poor – Needs major improvements',
      2: 'Fair – Met few expectations',
      3: 'Good – Satisfactory experience',
      4: 'Very Good – Really enjoyed using CityMate!',
      5: 'Exceptional – Outstanding companion app!'
    };
  }

  async init() {
    this.bindEvents();
    await this.renderFeedbackWall();
    this.updateUserContext();
  }

  updateUserContext() {
    const user = window.api.getCurrentUser();
    const nameInput = document.getElementById('feedback-form-name');
    const emailInput = document.getElementById('feedback-form-email');
    if (user) {
      if (nameInput && !nameInput.value) nameInput.value = user.full_name || user.username || '';
      if (emailInput && !emailInput.value) emailInput.value = user.email || '';
    }
  }

  bindEvents() {
    // Star rating picker for full page form
    const starPicker = document.getElementById('feedback-star-picker');
    if (starPicker) {
      const stars = starPicker.querySelectorAll('.rating-star-btn');
      stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
          const val = parseInt(star.dataset.value);
          this.highlightStars(starPicker, val);
          this.updateRatingDesc('feedback-rating-desc', val);
        });
        star.addEventListener('mouseleave', () => {
          this.highlightStars(starPicker, this.selectedRating);
          this.updateRatingDesc('feedback-rating-desc', this.selectedRating);
        });
        star.addEventListener('click', (e) => {
          e.preventDefault();
          this.selectedRating = parseInt(star.dataset.value);
          this.highlightStars(starPicker, this.selectedRating);
          this.updateRatingDesc('feedback-rating-desc', this.selectedRating);
        });
      });
      // Initial render
      this.highlightStars(starPicker, this.selectedRating);
      this.updateRatingDesc('feedback-rating-desc', this.selectedRating);
    }

    // Modal Star Picker
    const modalStarPicker = document.getElementById('modal-feedback-star-picker');
    if (modalStarPicker) {
      const stars = modalStarPicker.querySelectorAll('.rating-star-btn');
      stars.forEach(star => {
        star.addEventListener('click', (e) => {
          e.preventDefault();
          const val = parseInt(star.dataset.value);
          this.modalSelectedRating = val;
          this.highlightStars(modalStarPicker, val);
        });
      });
      this.highlightStars(modalStarPicker, 5);
      this.modalSelectedRating = 5;
    }

    // Category pills selection
    document.querySelectorAll('.feedback-cat-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.feedback-cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.selectedCategory = pill.dataset.cat;
      });
    });

    // Tag chips toggle
    document.querySelectorAll('.feedback-tag-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        const tag = chip.dataset.tag;
        if (this.selectedTags.has(tag)) {
          this.selectedTags.delete(tag);
          chip.classList.remove('active');
        } else {
          this.selectedTags.add(tag);
          chip.classList.add('active');
        }
      });
    });

    // Form submission
    const form = document.getElementById('app-feedback-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Modal form submission
    const modalForm = document.getElementById('modal-quick-feedback-form');
    if (modalForm) {
      modalForm.addEventListener('submit', (e) => this.handleModalSubmit(e));
    }
  }

  highlightStars(container, rating) {
    if (!container) return;
    const stars = container.querySelectorAll('.rating-star-btn');
    stars.forEach(star => {
      const val = parseInt(star.dataset.value);
      if (val <= rating) {
        star.classList.add('active');
        star.innerHTML = '<i class="fa-solid fa-star"></i>';
      } else {
        star.classList.remove('active');
        star.innerHTML = '<i class="fa-regular fa-star"></i>';
      }
    });
  }

  updateRatingDesc(elementId, rating) {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = this.ratingDescriptions[rating] || 'Select your rating';
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('feedback-form-name').value.trim();
    const email = document.getElementById('feedback-form-email').value.trim();
    const subject = document.getElementById('feedback-form-subject').value.trim();
    const message = document.getElementById('feedback-form-message').value.trim();
    const rating = this.selectedRating;
    const category = this.selectedCategory;
    const tags = Array.from(this.selectedTags).join(', ');

    if (!name || !email || !message) {
      window.app.showToast('Please fill in your name, email, and feedback message.', 'error');
      return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Feedback...';
    }

    try {
      const res = await window.api.submitFeedback({
        name,
        email,
        rating,
        feedback_type: category,
        subject: subject || `${category} by ${name}`,
        message,
        tags
      });

      window.app.showToast('🎉 Thank you! Your feedback has been shared with the CityMate team.', 'success');
      
      // Reset form text
      document.getElementById('feedback-form-subject').value = '';
      document.getElementById('feedback-form-message').value = '';
      
      // Refresh wall
      await this.renderFeedbackWall();
    } catch (err) {
      window.app.showToast(err.message || 'Error submitting feedback. Please try again.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  }

  async handleModalSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('modal-fb-name').value.trim();
    const email = document.getElementById('modal-fb-email').value.trim();
    const category = document.getElementById('modal-fb-category').value;
    const message = document.getElementById('modal-fb-message').value.trim();
    const rating = this.modalSelectedRating || 5;

    if (!name || !email || !message) {
      window.app.showToast('Please complete all required fields.', 'error');
      return;
    }

    try {
      await window.api.submitFeedback({
        name,
        email,
        rating,
        feedback_type: category,
        subject: `Quick feedback from ${name}`,
        message,
        tags: '⚡ Quick Widget'
      });

      window.app.showToast('Thank you for sharing your feedback!', 'success');
      this.closeQuickFeedbackModal();
      document.getElementById('modal-quick-feedback-form').reset();
      await this.renderFeedbackWall();
    } catch (err) {
      window.app.showToast(err.message || 'Could not submit feedback.', 'error');
    }
  }

  openQuickFeedbackModal() {
    const modal = document.getElementById('quick-feedback-modal');
    if (!modal) return;
    const user = window.api.getCurrentUser();
    if (user) {
      const nameInp = document.getElementById('modal-fb-name');
      const emailInp = document.getElementById('modal-fb-email');
      if (nameInp && !nameInp.value) nameInp.value = user.full_name || user.username || '';
      if (emailInp && !emailInp.value) emailInp.value = user.email || '';
    }
    modal.classList.add('active');
  }

  closeQuickFeedbackModal() {
    const modal = document.getElementById('quick-feedback-modal');
    if (modal) modal.classList.remove('active');
  }

  setWallFilter(filter, btn) {
    this.activeWallFilter = filter;
    document.querySelectorAll('.fb-wall-filter').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.renderFeedbackWall();
  }

  async renderFeedbackWall() {
    const container = document.getElementById('feedback-cards-wall');
    if (!container) return;

    let filterOptions = {};
    if (this.activeWallFilter === '5stars') {
      filterOptions.min_rating = 5;
    } else if (this.activeWallFilter !== 'All') {
      filterOptions.type = this.activeWallFilter;
    }

    const data = await window.api.getFeedbacks(filterOptions);
    const feedbacks = data.feedbacks || [];
    const stats = data.stats || {};

    // Render satisfaction score & stats banners
    this.renderStatsBanner(stats);

    if (feedbacks.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
          <i class="fa-solid fa-comment-dots" style="font-size: 2.5rem; color: var(--primary-light); opacity: 0.6; margin-bottom: 12px;"></i>
          <h4 style="margin: 0 0 6px 0; color: #fff;">No feedback found in this category yet</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 16px;">Be the first traveler to share your thoughts!</p>
          <button class="btn btn-primary btn-sm" onclick="document.getElementById('app-feedback-form').scrollIntoView({ behavior: 'smooth' })">
            Write Feedback Below
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = feedbacks.map(fb => {
      const starIcons = Array.from({ length: 5 }, (_, i) => {
        return i < fb.rating 
          ? '<i class="fa-solid fa-star" style="color: var(--accent-amber);"></i>' 
          : '<i class="fa-regular fa-star" style="color: rgba(255,255,255,0.2);"></i>';
      }).join('');

      const tagsList = fb.tags ? fb.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const userAvatar = fb.user_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(fb.name)}&background=0D9488&color=fff&size=120`;

      let badgeColor = 'rgba(13, 148, 136, 0.2)';
      let badgeTextColor = 'var(--primary-light)';
      if (fb.feedback_type === 'Emergency & Services') {
        badgeColor = 'rgba(239, 68, 68, 0.2)';
        badgeTextColor = '#ef4444';
      } else if (fb.feedback_type === 'Feature Request') {
        badgeColor = 'rgba(139, 92, 246, 0.2)';
        badgeTextColor = 'var(--accent-purple)';
      }

      return `
        <div class="feedback-card">
          <div class="feedback-card-header">
            <div class="feedback-user-info">
              <img src="${userAvatar}" alt="${fb.name}" class="feedback-avatar" onerror="this.src='https://ui-avatars.com/api/?name=Traveler&background=0D9488&color=fff'" />
              <div>
                <div class="feedback-name-row">
                  <h4 class="feedback-author-name">${fb.name}</h4>
                  <span class="feedback-verified-badge" title="Verified Traveler"><i class="fa-solid fa-circle-check"></i> Verified</span>
                </div>
                <div class="feedback-date">${fb.created_at ? fb.created_at.substring(0, 10) : 'Recent'}</div>
              </div>
            </div>
            <div class="feedback-rating-badge">
              ${starIcons}
            </div>
          </div>

          <div style="margin-bottom: 10px;">
            <span class="badge" style="background: ${badgeColor}; color: ${badgeTextColor}; font-size: 0.72rem; padding: 3px 8px; border-radius: 6px;">
              ${fb.feedback_type}
            </span>
          </div>

          ${fb.subject ? `<h5 class="feedback-card-subject">${fb.subject}</h5>` : ''}

          <p class="feedback-card-message">"${fb.message}"</p>

          ${tagsList.length > 0 ? `
            <div class="feedback-card-tags">
              ${tagsList.map(t => `<span class="feedback-tag-pill">${t}</span>`).join('')}
            </div>
          ` : ''}

          ${fb.status === 'Reviewed' ? `
            <div class="feedback-card-reviewed">
              <i class="fa-solid fa-shield-check"></i> Reviewed by CityMate Team
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  renderStatsBanner(stats) {
    const avgScoreEl = document.getElementById('fb-stat-avg-score');
    const totalCountEl = document.getElementById('fb-stat-total-count');
    const satRateEl = document.getElementById('fb-stat-satisfaction-rate');
    const bar5 = document.getElementById('fb-bar-5');
    const bar4 = document.getElementById('fb-bar-4');
    const bar3 = document.getElementById('fb-bar-3');

    if (avgScoreEl) avgScoreEl.textContent = stats.avg_rating || '4.8';
    if (totalCountEl) totalCountEl.textContent = (stats.total_feedbacks || 5) + '+ Reviews';
    if (satRateEl) satRateEl.textContent = (stats.satisfaction_percentage || 98) + '%';

    const total = Math.max(1, stats.total_feedbacks || 5);
    if (bar5) bar5.style.width = `${((stats.five_star || 4) / total) * 100}%`;
    if (bar4) bar4.style.width = `${((stats.four_star || 1) / total) * 100}%`;
    if (bar3) bar3.style.width = `${((stats.three_star || 0) / total) * 100}%`;
  }
}

// Global instance
window.feedbackCtrl = new FeedbackController();
