/**
 * CityMate Admin Dashboard Controller
 */

class AdminController {
  constructor() {
    this.currentTab = 'places';
    this.cachedStats = null;
    this.searchQuery = '';
  }

  async initDashboard() {
    await this.loadStatsAndCharts();
    this.switchTab('places');
    this.bindEvents();
  }

  async loadStatsAndCharts() {
    const data = await window.api.getAdminStats();
    this.cachedStats = data;

    // Render Stats Cards
    const statsContainer = document.getElementById('admin-stats-cards');
    if (statsContainer && data.stats) {
      statsContainer.innerHTML = `
        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(13, 148, 136, 0.15); color: var(--primary-light);">
            <i class="fa-solid fa-users"></i>
          </div>
          <div>
            <div class="stat-val">${data.stats.total_users}</div>
            <div class="stat-label">Total Users</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(2, 132, 199, 0.15); color: var(--secondary-light);">
            <i class="fa-solid fa-mountain-sun"></i>
          </div>
          <div>
            <div class="stat-val">${data.stats.total_places}</div>
            <div class="stat-label">Tourist Places</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(245, 158, 11, 0.15); color: var(--accent-amber);">
            <i class="fa-solid fa-bell-concierge"></i>
          </div>
          <div>
            <div class="stat-val">${data.stats.total_services}</div>
            <div class="stat-label">Services Listed</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(244, 63, 94, 0.15); color: var(--accent-rose);">
            <i class="fa-solid fa-star"></i>
          </div>
          <div>
            <div class="stat-val">${data.stats.total_reviews}</div>
            <div class="stat-label">Total Reviews</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(139, 92, 246, 0.15); color: var(--accent-purple);">
            <i class="fa-solid fa-heart"></i>
          </div>
          <div>
            <div class="stat-val">${data.stats.total_favorites}</div>
            <div class="stat-label">User Favorites</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(13, 148, 136, 0.15); color: var(--primary-light);">
            <i class="fa-solid fa-comments"></i>
          </div>
          <div>
            <div class="stat-val">${data.stats.total_feedbacks || 5} <span style="font-size: 0.8rem; color: var(--accent-amber);">(${data.stats.avg_feedback_rating || 4.8}★)</span></div>
            <div class="stat-label">App Feedbacks</div>
          </div>
        </div>

        <div class="stat-card" style="border: 1px solid rgba(56, 189, 248, 0.3);">
          <div class="stat-icon" style="background: rgba(2, 132, 199, 0.18); color: var(--secondary-light);">
            <i class="fa-solid fa-ticket"></i>
          </div>
          <div>
            <div class="stat-val" style="color: var(--secondary-light);">${data.stats.total_bookings || 10}</div>
            <div class="stat-label">Total Spot Bookings</div>
          </div>
        </div>

        <div class="stat-card" style="border: 1px solid rgba(16, 185, 129, 0.3);">
          <div class="stat-icon" style="background: rgba(16, 185, 129, 0.18); color: var(--accent-emerald);">
            <i class="fa-solid fa-receipt"></i>
          </div>
          <div>
            <div class="stat-val" style="color: var(--accent-emerald);">₹${(data.stats.total_sales_revenue || 0).toLocaleString('en-IN')}</div>
            <div class="stat-label">Ticket Sales Revenue</div>
          </div>
        </div>
      `;
    }

    // Render Visual Charts
    const chartsContainer = document.getElementById('admin-charts-container');
    if (chartsContainer && data.category_breakdown) {
      const maxCat = Math.max(...data.category_breakdown.map(c => c.count), 1);
      const maxSrv = Math.max(...(data.services_breakdown || []).map(s => s.count), 1);

      chartsContainer.innerHTML = `
        <div class="chart-card">
          <div class="chart-title">Tourist Places by Category</div>
          <div class="chart-bars-list">
            ${data.category_breakdown.map(c => `
              <div class="chart-bar-item">
                <div class="chart-bar-header">
                  <span>${c.name}</span>
                  <strong>${c.count} places</strong>
                </div>
                <div class="chart-bar-track">
                  <div class="chart-bar-fill" style="width: ${(c.count / maxCat) * 100}%;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-title">Essential Services Breakdown</div>
          <div class="chart-bars-list">
            ${(data.services_breakdown || []).map(s => {
              const meta = window.servicesCtrl.getServiceIcon(s.service_type);
              return `
                <div class="chart-bar-item">
                  <div class="chart-bar-header">
                    <span>${meta.label}</span>
                    <strong>${s.count} locations</strong>
                  </div>
                  <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width: ${(s.count / maxSrv) * 100}%; background: linear-gradient(90deg, #f59e0b, #f43f5e);"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }
  }

  bindEvents() {
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.switchTab(btn.dataset.tab);
      });
    });

    const searchInput = document.getElementById('admin-table-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderCurrentTable();
      });
    }
  }

  switchTab(tab) {
    this.currentTab = tab;
    this.renderCurrentTable();
  }

  async renderCurrentTable() {
    const tableHeader = document.getElementById('admin-table-header-row');
    const tableBody = document.getElementById('admin-table-body');
    const addBtn = document.getElementById('btn-admin-add-new');
    if (!tableHeader || !tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 30px;"><i class="fa-solid fa-spinner fa-spin"></i> Loading...</td></tr>`;

    if (this.currentTab === 'places') {
      if (addBtn) {
        addBtn.style.display = 'inline-flex';
        addBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add Tourist Place`;
        addBtn.onclick = () => this.openPlaceEditModal();
      }

      tableHeader.innerHTML = `
        <th>Place</th>
        <th>City</th>
        <th>Category</th>
        <th>Rating</th>
        <th>Fee</th>
        <th style="text-align: right;">Actions</th>
      `;

      let places = await window.api.getPlaces({ sort_by: 'name_asc' });
      if (this.searchQuery) {
        places = places.filter(p => p.name.toLowerCase().includes(this.searchQuery) || p.city_name.toLowerCase().includes(this.searchQuery));
      }

      tableBody.innerHTML = places.map(p => `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="${p.image_url}" class="admin-table-thumbnail" />
              <div>
                <strong>${p.name}</strong>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${p.address || ''}</div>
              </div>
            </div>
          </td>
          <td>${p.city_name}</td>
          <td><span class="badge badge-primary">${p.category_name}</span></td>
          <td><i class="fa-solid fa-star" style="color: var(--accent-amber);"></i> ${p.rating} (${p.review_count})</td>
          <td>${p.entry_fee === 0 ? 'Free' : '₹' + p.entry_fee}</td>
          <td style="text-align: right;">
            <div class="action-btn-group" style="justify-content: flex-end;">
              <button class="btn btn-secondary btn-sm" onclick="window.adminCtrl.openPlaceEditModal(${p.id})"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-danger btn-sm" onclick="window.adminCtrl.deletePlace(${p.id}, '${p.name.replace(/'/g, "\\'")}')"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `).join('');

    } else if (this.currentTab === 'bookings') {
      if (addBtn) {
        addBtn.style.display = 'inline-flex';
        addBtn.innerHTML = `<i class="fa-solid fa-ticket"></i> New Spot Booking`;
        addBtn.onclick = () => window.bookingCtrl.openDirectBookingModal();
      }

      tableHeader.innerHTML = `
        <th>Ref &amp; Venue</th>
        <th>City</th>
        <th>Visitor</th>
        <th>Visit Date &amp; Slot</th>
        <th>Tickets &amp; Amount</th>
        <th>Status</th>
        <th style="text-align: right;">Actions</th>
      `;

      const res = await window.api.getAdminBookings();
      let bookings = (res && res.bookings) ? res.bookings : [];
      if (this.searchQuery) {
        bookings = bookings.filter(b => 
          (b.booking_ref && b.booking_ref.toLowerCase().includes(this.searchQuery)) ||
          (b.place_name && b.place_name.toLowerCase().includes(this.searchQuery)) ||
          (b.city_name && b.city_name.toLowerCase().includes(this.searchQuery)) ||
          (b.visitor_name && b.visitor_name.toLowerCase().includes(this.searchQuery)) ||
          (b.visitor_email && b.visitor_email.toLowerCase().includes(this.searchQuery))
        );
      }

      if (bookings.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-secondary);">No customer bookings found matching criteria.</td></tr>`;
        return;
      }

      tableBody.innerHTML = bookings.map(b => {
        const isConfirmed = b.status === 'confirmed';
        const partyDesc = `${b.num_adults} Adult${b.num_adults > 1 ? 's' : ''}${b.num_children ? ' + ' + b.num_children + ' Child' : ''}${b.num_seniors ? ' + ' + b.num_seniors + ' Senior' : ''}`;
        const totalDisplay = b.total_amount > 0 ? `₹${parseFloat(b.total_amount).toFixed(2)}` : 'Free';

        return `
          <tr>
            <td>
              <div style="font-family:monospace; font-weight:800; color:var(--secondary-light); font-size:0.85rem;">
                ${b.booking_ref}
              </div>
              <strong style="color:#fff;">${b.place_name}</strong>
            </td>
            <td><span class="badge" style="background:rgba(2,132,199,0.15); color:var(--secondary-light); font-weight:700;">${b.city_name || 'Destination'}</span></td>
            <td>
              <div style="font-weight:700; color:#fff;">${b.visitor_name}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${b.visitor_email}</div>
              ${b.visitor_phone ? `<div style="font-size:0.75rem; color:var(--text-secondary);">${b.visitor_phone}</div>` : ''}
            </td>
            <td>
              <div style="font-weight:700; color:#fff;">${b.visit_date}</div>
              <div style="font-size:0.75rem; color:var(--accent-amber);">${b.visit_time || 'General Slot'}</div>
            </td>
            <td>
              <div style="font-size:0.8rem; color:var(--text-secondary);">${partyDesc}</div>
              <strong style="color:var(--accent-emerald); font-size:0.95rem;">${totalDisplay}</strong>
            </td>
            <td>
              <span class="badge" style="background:${isConfirmed ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)'}; color:${isConfirmed ? 'var(--accent-emerald)' : '#ef4444'}; text-transform:uppercase; font-size:0.72rem; font-weight:800;">
                ${b.status}
              </span>
            </td>
            <td style="text-align: right;">
              <div class="action-btn-group" style="justify-content: flex-end; gap:6px;">
                <button class="btn btn-secondary btn-sm" onclick="window.bookingCtrl.openTicketModal('${b.booking_ref}')" title="View E-Ticket Pass">
                  <i class="fa-solid fa-qrcode"></i>
                </button>
                ${isConfirmed ? `
                <button class="btn btn-danger btn-sm" onclick="window.adminCtrl.toggleBookingStatus(${b.id}, 'cancelled')" title="Cancel this reservation">
                  <i class="fa-solid fa-ban"></i>
                </button>` : `
                <button class="btn btn-primary btn-sm" onclick="window.adminCtrl.toggleBookingStatus(${b.id}, 'confirmed')" title="Restore / Confirm reservation">
                  <i class="fa-solid fa-check"></i>
                </button>`}
              </div>
            </td>
          </tr>
        `;
      }).join('');

    } else if (this.currentTab === 'services') {
      if (addBtn) {
        addBtn.style.display = 'inline-flex';
        addBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add Service`;
        addBtn.onclick = () => this.openServiceEditModal();
      }

      tableHeader.innerHTML = `
        <th>Service Name</th>
        <th>Type</th>
        <th>Address</th>
        <th>Rating</th>
        <th>Status</th>
        <th style="text-align: right;">Actions</th>
      `;

      let services = await window.api.getServices();
      if (this.searchQuery) {
        services = services.filter(s => s.name.toLowerCase().includes(this.searchQuery) || s.service_type.toLowerCase().includes(this.searchQuery));
      }

      tableBody.innerHTML = services.map(s => {
        const meta = window.servicesCtrl.getServiceIcon(s.service_type);
        return `
          <tr>
            <td><strong>${s.name}</strong></td>
            <td><span class="badge" style="background: rgba(255,255,255,0.06);">${meta.label}</span></td>
            <td style="font-size: 0.85rem; color: var(--text-secondary);">${s.address}</td>
            <td><i class="fa-solid fa-star" style="color: var(--accent-amber);"></i> ${s.rating}</td>
            <td><span class="badge badge-emerald">${s.opening_status}</span></td>
            <td style="text-align: right;">
              <div class="action-btn-group" style="justify-content: flex-end;">
                <button class="btn btn-secondary btn-sm" onclick="window.adminCtrl.openServiceEditModal(${s.id})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-danger btn-sm" onclick="window.adminCtrl.deleteService(${s.id}, '${s.name.replace(/'/g, "\\'")}')"><i class="fa-solid fa-trash"></i></button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

    } else if (this.currentTab === 'users') {
      if (addBtn) addBtn.style.display = 'none';

      tableHeader.innerHTML = `
        <th>User</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Role</th>
        <th>Status</th>
        <th style="text-align: right;">Actions</th>
      `;

      const users = JSON.parse(localStorage.getItem('cm_users') || '[]');
      tableBody.innerHTML = users.map(u => `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="${u.profile_pic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}" class="user-avatar-small" />
              <strong>${u.full_name}</strong>
            </div>
          </td>
          <td>${u.email}</td>
          <td>${u.phone || 'N/A'}</td>
          <td><span class="badge ${u.role === 'admin' ? 'badge-amber' : 'badge-primary'}">${u.role}</span></td>
          <td>
            <span class="badge ${u.is_active ? 'badge-emerald' : 'badge-rose'}">
              ${u.is_active ? 'Active' : 'Deactivated'}
            </span>
          </td>
          <td style="text-align: right;">
            ${u.role !== 'admin' ? `
              <button class="btn ${u.is_active ? 'btn-danger' : 'btn-outline'} btn-sm" onclick="window.adminCtrl.toggleUserStatus(${u.id})">
                ${u.is_active ? 'Deactivate' : 'Activate'}
              </button>
            ` : '<span style="color: var(--text-muted); font-size: 0.8rem;">Protected</span>'}
          </td>
        </tr>
      `).join('');

    } else if (this.currentTab === 'reviews') {
      if (addBtn) addBtn.style.display = 'none';

      tableHeader.innerHTML = `
        <th>Reviewer</th>
        <th>Place ID</th>
        <th>Rating</th>
        <th>Comment</th>
        <th>Date</th>
        <th style="text-align: right;">Actions</th>
      `;

      let reviews = JSON.parse(localStorage.getItem('cm_reviews') || '[]');
      tableBody.innerHTML = reviews.map(r => `
        <tr>
          <td><strong>${r.user_name}</strong></td>
          <td>Place #${r.place_id}</td>
          <td><i class="fa-solid fa-star" style="color: var(--accent-amber);"></i> ${r.rating}★</td>
          <td style="max-width: 300px; color: var(--text-secondary);">${r.comment}</td>
          <td style="font-size: 0.8rem; color: var(--text-muted);">${r.created_at}</td>
          <td style="text-align: right;">
            <button class="btn btn-danger btn-sm" onclick="window.adminCtrl.deleteReview(${r.id})">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </td>
        </tr>
      `).join('');

    } else if (this.currentTab === 'feedbacks') {
      if (addBtn) addBtn.style.display = 'none';

      tableHeader.innerHTML = `
        <th>Traveler</th>
        <th>Category</th>
        <th>Rating</th>
        <th>Subject & Feedback</th>
        <th>Status</th>
        <th style="text-align: right;">Actions</th>
      `;

      let feedbacks = await window.api.adminGetFeedbacks();
      if (this.searchQuery) {
        feedbacks = feedbacks.filter(f => 
          (f.name && f.name.toLowerCase().includes(this.searchQuery)) ||
          (f.message && f.message.toLowerCase().includes(this.searchQuery)) ||
          (f.feedback_type && f.feedback_type.toLowerCase().includes(this.searchQuery))
        );
      }

      if (feedbacks.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted);">No feedback records found.</td></tr>`;
        return;
      }

      tableBody.innerHTML = feedbacks.map(f => {
        let statusBadge = 'badge-amber';
        if (f.status === 'Reviewed') statusBadge = 'badge-primary';
        if (f.status === 'Resolved') statusBadge = 'badge-emerald';

        return `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                <img src="${f.user_pic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}" class="user-avatar-small" />
                <div>
                  <strong>${f.name}</strong>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">${f.email}</div>
                </div>
              </div>
            </td>
            <td><span class="badge" style="background: rgba(255,255,255,0.06);">${f.feedback_type}</span></td>
            <td>
              <span style="color: var(--accent-amber); font-weight: 700;">
                <i class="fa-solid fa-star"></i> ${f.rating}
              </span>
            </td>
            <td style="max-width: 320px;">
              ${f.subject ? `<div style="font-weight: 600; font-size: 0.85rem; color: #fff;">${f.subject}</div>` : ''}
              <div style="font-size: 0.82rem; color: var(--text-secondary);">${f.message}</div>
              ${f.tags ? `<div style="font-size: 0.72rem; color: var(--primary-light); margin-top: 4px;">${f.tags}</div>` : ''}
            </td>
            <td>
              <select class="form-control" style="padding: 4px 8px; font-size: 0.8rem; width: auto;" onchange="window.adminCtrl.changeFeedbackStatus(${f.id}, this.value)">
                <option value="Pending" ${f.status === 'Pending' ? 'selected' : ''}>⏳ Pending</option>
                <option value="Reviewed" ${f.status === 'Reviewed' ? 'selected' : ''}>✓ Reviewed</option>
                <option value="Resolved" ${f.status === 'Resolved' ? 'selected' : ''}>★ Resolved</option>
              </select>
            </td>
            <td style="text-align: right;">
              <button class="btn btn-danger btn-sm" onclick="window.adminCtrl.deleteFeedback(${f.id}, '${(f.name || 'User').replace(/'/g, "\\'")}')" title="Delete Feedback">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // --- CRUD Modals & Actions ---
  async changeFeedbackStatus(id, newStatus) {
    try {
      await window.api.adminUpdateFeedbackStatus(id, newStatus);
      window.app.showToast(`Feedback #${id} marked as ${newStatus}.`, 'success');
      if (window.feedbackCtrl) window.feedbackCtrl.renderFeedbackWall();
    } catch (err) {
      window.app.showToast(err.message, 'error');
    }
  }

  async deleteFeedback(id, name) {
    if (!confirm(`Are you sure you want to delete feedback from "${name}"?`)) return;
    try {
      await window.api.adminDeleteFeedback(id);
      window.app.showToast(`Feedback from "${name}" deleted.`, 'success');
      this.loadStatsAndCharts();
      this.renderCurrentTable();
      if (window.feedbackCtrl) window.feedbackCtrl.renderFeedbackWall();
    } catch (err) {
      window.app.showToast(err.message, 'error');
    }
  }

  async deletePlace(id, name) {
    if (!confirm(`Are you sure you want to delete tourist place "${name}"?`)) return;
    try {
      await window.api.adminDeletePlace(id);
      window.app.showToast(`Place "${name}" deleted.`, 'success');
      this.loadStatsAndCharts();
      this.renderCurrentTable();
    } catch (err) {
      window.app.showToast(err.message, 'error');
    }
  }

  async deleteService(id, name) {
    if (!confirm(`Are you sure you want to delete service "${name}"?`)) return;
    try {
      await window.api.adminDeleteService(id);
      window.app.showToast(`Service "${name}" deleted.`, 'success');
      this.loadStatsAndCharts();
      this.renderCurrentTable();
    } catch (err) {
      window.app.showToast(err.message, 'error');
    }
  }

  async deleteReview(id) {
    if (!confirm(`Delete this review?`)) return;
    try {
      await window.api.deleteReview(id);
      window.app.showToast(`Review deleted.`, 'success');
      this.loadStatsAndCharts();
      this.renderCurrentTable();
    } catch (err) {
      window.app.showToast(err.message, 'error');
    }
  }

  async toggleUserStatus(id) {
    try {
      await window.api.adminToggleUser(id);
      window.app.showToast(`User status updated.`, 'success');
      this.renderCurrentTable();
    } catch (err) {
      window.app.showToast(err.message, 'error');
    }
  }

  async openPlaceEditModal(placeId = null) {
    const modal = document.getElementById('admin-edit-place-modal');
    if (!modal) return;

    let place = null;
    if (placeId) {
      place = await window.api.getPlaceById(placeId);
    }

    document.getElementById('admin-place-id').value = place ? place.id : '';
    document.getElementById('admin-place-name').value = place ? place.name : '';
    document.getElementById('admin-place-desc').value = place ? place.description : '';
    document.getElementById('admin-place-addr').value = place ? place.address : '';
    document.getElementById('admin-place-city').value = place ? place.city_id : 1;
    document.getElementById('admin-place-cat').value = place ? place.category_id : 1;
    document.getElementById('admin-place-fee').value = place ? place.entry_fee : 0;
    document.getElementById('admin-place-hours').value = place ? place.opening_hours : '9:00 AM - 6:00 PM';
    document.getElementById('admin-place-img').value = place ? place.image_url : 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800';

    modal.classList.add('active');
  }

  async savePlaceForm(e) {
    e.preventDefault();
    const id = document.getElementById('admin-place-id').value;
    const name = document.getElementById('admin-place-name').value.trim();
    const description = document.getElementById('admin-place-desc').value.trim();
    const address = document.getElementById('admin-place-addr').value.trim();
    const city_id = Number(document.getElementById('admin-place-city').value);
    const category_id = Number(document.getElementById('admin-place-cat').value);
    const entry_fee = Number(document.getElementById('admin-place-fee').value);
    const opening_hours = document.getElementById('admin-place-hours').value.trim();
    const image_url = document.getElementById('admin-place-img').value.trim();

    const cities = JSON.parse(localStorage.getItem('cm_cities') || '[]');
    const categories = JSON.parse(localStorage.getItem('cm_categories') || '[]');
    const city = cities.find(c => c.id === city_id) || cities[0];
    const cat = categories.find(c => c.id === category_id) || categories[0];

    const placeData = {
      id: id ? Number(id) : null,
      name,
      description,
      address,
      city_id,
      city_name: city.name,
      category_id,
      category_name: cat.name,
      category_slug: cat.slug,
      category_icon: cat.icon,
      entry_fee,
      opening_hours,
      image_url,
      lat: city.lat,
      lng: city.lng,
      distance_km: 3.5
    };

    try {
      await window.api.adminSavePlace(placeData);
      window.app.showToast('Tourist place saved successfully!', 'success');
      document.getElementById('admin-edit-place-modal').classList.remove('active');
      this.loadStatsAndCharts();
      this.renderCurrentTable();
      // If user is currently looking at places, refresh
      window.placesCtrl.renderPlacesGrid();
    } catch (err) {
      window.app.showToast(err.message, 'error');
    }
  }

  openServiceEditModal(serviceId = null) {
    const modal = document.getElementById('admin-edit-service-modal');
    if (!modal) return;

    let srv = null;
    if (serviceId) {
      const allSrvs = JSON.parse(localStorage.getItem('cm_services') || '[]');
      srv = allSrvs.find(s => s.id === Number(serviceId));
    }

    document.getElementById('admin-srv-id').value = srv ? srv.id : '';
    document.getElementById('admin-srv-name').value = srv ? srv.name : '';
    document.getElementById('admin-srv-type').value = srv ? srv.service_type : 'hotel';
    document.getElementById('admin-srv-addr').value = srv ? srv.address : '';
    document.getElementById('admin-srv-city').value = srv ? srv.city_id : 1;
    document.getElementById('admin-srv-phone').value = srv ? srv.phone : '+91 98400 12345';
    document.getElementById('admin-srv-status').value = srv ? srv.opening_status : 'Open Now';

    modal.classList.add('active');
  }

  async saveServiceForm(e) {
    e.preventDefault();
    const id = document.getElementById('admin-srv-id').value;
    const name = document.getElementById('admin-srv-name').value.trim();
    const service_type = document.getElementById('admin-srv-type').value;
    const address = document.getElementById('admin-srv-addr').value.trim();
    const city_id = Number(document.getElementById('admin-srv-city').value);
    const phone = document.getElementById('admin-srv-phone').value.trim();
    const opening_status = document.getElementById('admin-srv-status').value.trim();

    const cities = JSON.parse(localStorage.getItem('cm_cities') || '[]');
    const city = cities.find(c => c.id === city_id) || cities[0];

    const srvData = {
      id: id ? Number(id) : null,
      name,
      service_type,
      address,
      city_id,
      phone,
      opening_status,
      lat: city.lat,
      lng: city.lng,
      distance_km: 1.5
    };

    try {
      await window.api.adminSaveService(srvData);
      window.app.showToast('Essential service saved successfully!', 'success');
      document.getElementById('admin-edit-service-modal').classList.remove('active');
      this.loadStatsAndCharts();
      this.renderCurrentTable();
      window.servicesCtrl.renderServicesGrid();
    } catch (err) {
      window.app.showToast(err.message, 'error');
    }
  }

  async toggleBookingStatus(bookingId, newStatus) {
    if (!confirm(`Are you sure you want to mark booking #${bookingId} as ${newStatus}?`)) return;
    try {
      await window.api.updateAdminBookingStatus(bookingId, newStatus);
      window.app.showToast(`Booking #${bookingId} is now ${newStatus}.`, 'success');
      this.loadStatsAndCharts();
      this.renderCurrentTable();
    } catch (err) {
      window.app.showToast('Failed to update booking status: ' + err.message, 'error');
    }
  }
}

window.adminCtrl = new AdminController();
