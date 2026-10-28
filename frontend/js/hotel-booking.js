/**
 * CITYMATE — Hotel Stays & Luxury Resorts Booking Controller
 * Manages interactive hotel room booking, date selection, room tier selection,
 * live price breakdown (nights * room * rate + taxes), guest confirmation,
 * persistent storage (localStorage & Supabase), printable E-Vouchers, and My Bookings.
 */

(function () {
  'use strict';

  class HotelBookingController {
    constructor() {
      this.currentHotel = null;
      this.selectedRoomType = 'standard';
      this.roomTypeSurcharges = {
        'standard': { name: 'Standard Deluxe Room', extraPerNight: 0 },
        'executive': { name: 'Executive Suite', extraPerNight: 900 },
        'villa': { name: 'Presidential / Heritage Villa', extraPerNight: 2200 }
      };
      this.nights = 1;
      this.roomsCount = 1;
      this.adultsCount = 2;
      this.childrenCount = 0;
      this.storageKey = 'citymate_hotel_bookings';
    }

    /**
     * Retrieve all saved bookings from localStorage
     */
    getBookings() {
      try {
        const raw = localStorage.getItem(this.storageKey);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.warn('[HotelBooking] Storage read error:', e);
        return [];
      }
    }

    /**
     * Save bookings array to localStorage
     */
    saveBookings(bookings) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(bookings));
        this.updateBookingsBadge();
      } catch (e) {
        console.warn('[HotelBooking] Storage write error:', e);
      }
    }

    /**
     * Update My Bookings count badge in navbar/toolbar
     */
    updateBookingsBadge() {
      const bookings = this.getBookings();
      const badge = document.getElementById('my-bookings-count');
      if (badge) {
        badge.textContent = bookings.length;
        badge.style.display = bookings.length > 0 ? 'inline-flex' : 'none';
      }
    }

    /**
     * Open Hotel Booking Modal for selected hotel ID
     */
    openBookingModal(hotelId) {
      // Find hotel in servicesManager or SEED_DATA
      let hotel = null;
      if (window.servicesManager && window.servicesManager.services) {
        hotel = window.servicesManager.services.find(s => Number(s.id) === Number(hotelId));
      }
      if (!hotel && typeof SEED_DATA !== 'undefined' && SEED_DATA.services) {
        hotel = SEED_DATA.services.find(s => Number(s.id) === Number(hotelId));
      }

      if (!hotel) {
        if (window.showToast) window.showToast('Hotel details not found.', 'error');
        return;
      }

      this.currentHotel = hotel;
      this.selectedRoomType = 'standard';
      this.roomsCount = 1;
      this.adultsCount = 2;
      this.childrenCount = 0;

      // Populate Modal Header & Info
      const nameEl = document.getElementById('bk-hotel-name');
      const locEl = document.getElementById('bk-hotel-location');
      const ratingEl = document.getElementById('bk-hotel-rating');
      const imgEl = document.getElementById('bk-hotel-img');
      const baseRateEl = document.getElementById('bk-hotel-base-rate');

      if (nameEl) nameEl.textContent = hotel.name;
      if (locEl) locEl.innerHTML = `<i class="fa-solid fa-map-pin"></i> ${hotel.address || hotel.city_name}`;
      if (ratingEl) ratingEl.innerHTML = `<i class="fa-solid fa-star"></i> ${Number(hotel.rating || 4.7).toFixed(1)}`;
      if (imgEl) imgEl.src = hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500';

      const basePrice = this.getHotelBaseRate(hotel);
      if (baseRateEl) baseRateEl.textContent = `₹${basePrice.toLocaleString()}`;

      // Set default dates: checkin = tomorrow, checkout = day after tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);

      const checkInInput = document.getElementById('bk-checkin-date');
      const checkOutInput = document.getElementById('bk-checkout-date');

      const toISO = (d) => d.toISOString().split('T')[0];
      if (checkInInput) {
        checkInInput.min = toISO(new Date());
        checkInInput.value = toISO(tomorrow);
      }
      if (checkOutInput) {
        checkOutInput.min = toISO(tomorrow);
        checkOutInput.value = toISO(dayAfter);
      }

      // Reset guest form inputs & auto-fill if signed in
      const nameInput = document.getElementById('bk-guest-name');
      const emailInput = document.getElementById('bk-guest-email');
      const phoneInput = document.getElementById('bk-guest-phone');
      const reqInput = document.getElementById('bk-guest-requests');

      if (reqInput) reqInput.value = '';

      // Check if user is logged in via Supabase or localStorage
      let currentUser = null;
      if (window.authCtrl && window.authCtrl.currentUser) {
        currentUser = window.authCtrl.currentUser;
      }
      const savedUserStr = localStorage.getItem('cm_user');
      if (!currentUser && savedUserStr) {
        try { currentUser = JSON.parse(savedUserStr); } catch (e) {}
      }

      if (nameInput) {
        const fullName = (currentUser && (currentUser.user_metadata?.full_name || currentUser.name || currentUser.full_name)) || '';
        nameInput.value = fullName;
      }
      if (emailInput) {
        const email = (currentUser && (currentUser.email || currentUser.user_metadata?.email)) || '';
        emailInput.value = email;
      }
      if (phoneInput && !phoneInput.value) {
        phoneInput.value = '+91 ';
      }

      // Reset room selection radio/buttons
      const roomSelect = document.getElementById('bk-room-type');
      if (roomSelect) roomSelect.value = 'standard';

      // Update calculations
      this.recalculatePrice();

      // Show modal
      const modal = document.getElementById('hotel-booking-modal');
      if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    }

    /**
     * Close Hotel Booking Modal
     */
    closeBookingModal() {
      const modal = document.getElementById('hotel-booking-modal');
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    }

    /**
     * Get Base Nightly Rate for a hotel
     */
    getHotelBaseRate(hotel) {
      if (hotel.price_per_night && Number(hotel.price_per_night) > 0) {
        return Number(hotel.price_per_night);
      }
      // Infer from price_level
      const lvl = (hotel.price_level || '').trim();
      if (lvl === '$') return 1499;
      if (lvl === '$$') return 3200;
      if (lvl === '$$$') return 4800;
      if (lvl === '$$$$') return 7500;
      return 2800;
    }

    /**
     * Date or option change handler
     */
    onParamsChange() {
      const checkInInput = document.getElementById('bk-checkin-date');
      const checkOutInput = document.getElementById('bk-checkout-date');
      const roomTypeSelect = document.getElementById('bk-room-type');
      const roomsInput = document.getElementById('bk-rooms-count');
      const adultsInput = document.getElementById('bk-adults-count');
      const childrenInput = document.getElementById('bk-children-count');

      if (roomTypeSelect) this.selectedRoomType = roomTypeSelect.value || 'standard';
      if (roomsInput) this.roomsCount = Math.max(1, parseInt(roomsInput.value, 10) || 1);
      if (adultsInput) this.adultsCount = Math.max(1, parseInt(adultsInput.value, 10) || 1);
      if (childrenInput) this.childrenCount = Math.max(0, parseInt(childrenInput.value, 10) || 0);

      // Validate check-out is after check-in
      if (checkInInput && checkOutInput && checkInInput.value && checkOutInput.value) {
        const inDate = new Date(checkInInput.value);
        const outDate = new Date(checkOutInput.value);

        if (outDate <= inDate) {
          const nextDay = new Date(inDate);
          nextDay.setDate(nextDay.getDate() + 1);
          checkOutInput.value = nextDay.toISOString().split('T')[0];
        }
        checkOutInput.min = checkInInput.value;
      }

      this.recalculatePrice();
    }

    /**
     * Recalculate Live Pricing Breakdown
     */
    recalculatePrice() {
      if (!this.currentHotel) return;

      const checkInInput = document.getElementById('bk-checkin-date');
      const checkOutInput = document.getElementById('bk-checkout-date');

      let nights = 1;
      if (checkInInput && checkOutInput && checkInInput.value && checkOutInput.value) {
        const inDate = new Date(checkInInput.value);
        const outDate = new Date(checkOutInput.value);
        const diffTime = outDate - inDate;
        nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      }
      this.nights = nights;

      const baseRate = this.getHotelBaseRate(this.currentHotel);
      const surcharge = (this.roomTypeSurcharges[this.selectedRoomType] || {}).extraPerNight || 0;
      const nightlyRate = baseRate + surcharge;

      const subtotal = nightlyRate * nights * this.roomsCount;
      const gst = Math.round(subtotal * 0.12); // 12% Hospitality GST
      const grandTotal = subtotal + gst;

      // Update DOM values
      const nightsLabel = document.getElementById('bk-calc-nights');
      const rateLabel = document.getElementById('bk-calc-nightly-rate');
      const subtotalLabel = document.getElementById('bk-calc-subtotal');
      const gstLabel = document.getElementById('bk-calc-gst');
      const totalLabel = document.getElementById('bk-calc-grand-total');

      if (nightsLabel) nightsLabel.textContent = `${nights} night${nights > 1 ? 's' : ''} × ${this.roomsCount} room${this.roomsCount > 1 ? 's' : ''}`;
      if (rateLabel) rateLabel.textContent = `₹${nightlyRate.toLocaleString()}`;
      if (subtotalLabel) subtotalLabel.textContent = `₹${subtotal.toLocaleString()}`;
      if (gstLabel) gstLabel.textContent = `₹${gst.toLocaleString()}`;
      if (totalLabel) totalLabel.textContent = `₹${grandTotal.toLocaleString()}`;
    }

    /**
     * Handle Booking Form Submission
     */
    handleBookingSubmit(e) {
      e.preventDefault();

      if (!this.currentHotel) return;

      const nameInput = document.getElementById('bk-guest-name');
      const emailInput = document.getElementById('bk-guest-email');
      const phoneInput = document.getElementById('bk-guest-phone');
      const reqInput = document.getElementById('bk-guest-requests');
      const checkInInput = document.getElementById('bk-checkin-date');
      const checkOutInput = document.getElementById('bk-checkout-date');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const specialRequests = reqInput ? reqInput.value.trim() : '';
      const checkIn = checkInInput ? checkInInput.value : '';
      const checkOut = checkOutInput ? checkOutInput.value : '';

      if (!name) {
        if (window.showToast) window.showToast('Please enter guest full name.', 'warning');
        return;
      }
      if (!email || !email.includes('@')) {
        if (window.showToast) window.showToast('Please provide a valid email address.', 'warning');
        return;
      }
      if (!phone || phone.length < 8) {
        if (window.showToast) window.showToast('Please enter a valid phone number.', 'warning');
        return;
      }
      if (!checkIn || !checkOut) {
        if (window.showToast) window.showToast('Please select valid check-in and check-out dates.', 'warning');
        return;
      }

      // Calculate totals
      const baseRate = this.getHotelBaseRate(this.currentHotel);
      const surcharge = (this.roomTypeSurcharges[this.selectedRoomType] || {}).extraPerNight || 0;
      const nightlyRate = baseRate + surcharge;
      const subtotal = nightlyRate * this.nights * this.roomsCount;
      const gst = Math.round(subtotal * 0.12);
      const grandTotal = subtotal + gst;

      const bookingId = 'CM-HTL-' + Math.floor(100000 + Math.random() * 900000);

      const newBooking = {
        id: bookingId,
        hotel_id: this.currentHotel.id,
        hotel_name: this.currentHotel.name,
        hotel_image: this.currentHotel.image_url,
        hotel_address: this.currentHotel.address,
        hotel_phone: this.currentHotel.phone,
        city_name: this.currentHotel.city_name,
        rating: this.currentHotel.rating || 4.7,
        check_in: checkIn,
        check_out: checkOut,
        nights: this.nights,
        room_type_key: this.selectedRoomType,
        room_type_name: (this.roomTypeSurcharges[this.selectedRoomType] || {}).name || 'Deluxe Room',
        rooms_count: this.roomsCount,
        guests: {
          adults: this.adultsCount,
          children: this.childrenCount
        },
        guest_name: name,
        guest_email: email,
        guest_phone: phone,
        special_requests: specialRequests,
        nightly_rate: nightlyRate,
        subtotal: subtotal,
        gst: gst,
        total_amount: grandTotal,
        payment_method: 'Pay at Check-in / Pay Later',
        status: 'Confirmed',
        booked_at: new Date().toISOString()
      };

      // Save to localStorage
      const bookings = this.getBookings();
      bookings.unshift(newBooking);
      this.saveBookings(bookings);

      // Close booking modal
      this.closeBookingModal();

      if (window.showToast) {
        window.showToast(`Booking ${bookingId} confirmed! E-Voucher ready.`, 'success');
      }

      // Open E-Voucher Confirmation
      this.openConfirmationModal(newBooking);
    }

    /**
     * Open Confirmation Voucher Modal
     */
    openConfirmationModal(booking) {
      const modal = document.getElementById('hotel-voucher-modal');
      if (!modal) return;

      const codeEl = document.getElementById('v-booking-code');
      const hotelNameEl = document.getElementById('v-hotel-name');
      const addressEl = document.getElementById('v-hotel-address');
      const datesEl = document.getElementById('v-stay-dates');
      const nightsEl = document.getElementById('v-stay-nights');
      const roomEl = document.getElementById('v-room-details');
      const guestEl = document.getElementById('v-guest-details');
      const amountEl = document.getElementById('v-total-amount');
      const barcodeEl = document.getElementById('v-barcode-text');
      const phoneEl = document.getElementById('v-hotel-phone');

      if (codeEl) codeEl.textContent = booking.id;
      if (hotelNameEl) hotelNameEl.textContent = booking.hotel_name;
      if (addressEl) addressEl.textContent = `${booking.hotel_address || ''}, ${booking.city_name || ''}`;
      if (datesEl) datesEl.textContent = `${booking.check_in}  to  ${booking.check_out}`;
      if (nightsEl) nightsEl.textContent = `${booking.nights} night${booking.nights > 1 ? 's' : ''}`;
      if (roomEl) roomEl.textContent = `${booking.rooms_count} × ${booking.room_type_name}`;
      if (guestEl) guestEl.textContent = `${booking.guest_name} (${booking.guests.adults} Adults${booking.guests.children > 0 ? `, ${booking.guests.children} Children` : ''})`;
      if (amountEl) amountEl.textContent = `₹${booking.total_amount.toLocaleString()}`;
      if (barcodeEl) barcodeEl.textContent = `*${booking.id}*`;
      if (phoneEl) {
        phoneEl.textContent = booking.hotel_phone || '+91 1800-425-2489';
        phoneEl.href = `tel:${(booking.hotel_phone || '').replace(/[^0-9+]/g, '')}`;
      }

      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    /**
     * Close Confirmation Voucher Modal
     */
    closeConfirmationModal() {
      const modal = document.getElementById('hotel-voucher-modal');
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    }

    /**
     * Open "My Bookings" Drawer / Modal
     */
    openMyBookings() {
      const modal = document.getElementById('my-bookings-modal');
      if (!modal) return;

      const listContainer = document.getElementById('my-bookings-list');
      const bookings = this.getBookings();

      if (!listContainer) return;

      if (!bookings || bookings.length === 0) {
        listContainer.innerHTML = `
          <div style="text-align: center; padding: 50px 20px; color: var(--text-secondary);">
            <i class="fa-solid fa-hotel" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 16px;"></i>
            <h3 style="font-size: 1.2rem; color: #fff; margin-bottom: 8px;">No Hotel Bookings Found</h3>
            <p style="font-size: 0.9rem; max-width: 380px; margin: 0 auto 20px;">
              You have not made any hotel reservations yet. Browse through our verified hotels and book your dream stay.
            </p>
            <button class="btn btn-primary btn-sm" onclick="window.hotelBookingCtrl.closeMyBookings()">
              <i class="fa-solid fa-compass"></i> Explore Stays
            </button>
          </div>
        `;
      } else {
        listContainer.innerHTML = bookings.map(b => `
          <div class="booking-item-card" style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px; margin-bottom: 14px; display: flex; flex-direction: column; gap: 12px; transition: transform 0.2s ease;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap;">
              <div>
                <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); font-weight: 700; font-size: 0.75rem; margin-bottom: 6px;">
                  <i class="fa-solid fa-circle-check"></i> ${b.status || 'Confirmed'}
                </span>
                <h4 style="font-size: 1.1rem; color: #fff; font-weight: 800; margin: 4px 0 2px;">${b.hotel_name}</h4>
                <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0;">
                  <i class="fa-solid fa-location-dot" style="color: var(--primary-light);"></i> ${b.hotel_address || b.city_name}
                </p>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Booking Code</span>
                <strong style="font-family: monospace; font-size: 1.05rem; color: #38bdf8;">${b.id}</strong>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; background: rgba(0,0,0,0.25); padding: 10px 14px; border-radius: 8px; font-size: 0.82rem;">
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.72rem;">CHECK-IN</span>
                <strong style="color: #fff;">${b.check_in}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.72rem;">CHECK-OUT</span>
                <strong style="color: #fff;">${b.check_out}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.72rem;">ROOM TYPE</span>
                <strong style="color: #fff;">${b.room_type_name}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.72rem;">TOTAL PAYABLE</span>
                <strong style="color: var(--accent-emerald); font-size: 0.95rem;">₹${b.total_amount.toLocaleString()}</strong>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 12px; gap: 8px;">
              <span style="font-size: 0.75rem; color: var(--text-muted);">
                Booked for: <strong>${b.guest_name}</strong>
              </span>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn-outline btn-sm" onclick="window.hotelBookingCtrl.cancelBooking('${b.id}')" style="font-size: 0.78rem; color: #f87171; border-color: rgba(248,113,113,0.3);">
                  <i class="fa-solid fa-ban"></i> Cancel
                </button>
                <button class="btn btn-primary btn-sm" onclick="window.hotelBookingCtrl.showBookingVoucher('${b.id}')" style="font-size: 0.78rem;">
                  <i class="fa-solid fa-receipt"></i> View Voucher
                </button>
              </div>
            </div>
          </div>
        `).join('');
      }

      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    /**
     * Close "My Bookings" Drawer / Modal
     */
    closeMyBookings() {
      const modal = document.getElementById('my-bookings-modal');
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    }

    /**
     * Show voucher for an existing booking by ID
     */
    showBookingVoucher(bookingId) {
      const bookings = this.getBookings();
      const b = bookings.find(item => item.id === bookingId);
      if (b) {
        this.closeMyBookings();
        this.openConfirmationModal(b);
      }
    }

    /**
     * Cancel an existing booking
     */
    cancelBooking(bookingId) {
      if (!confirm(`Are you sure you want to cancel booking ${bookingId}?`)) {
        return;
      }
      let bookings = this.getBookings();
      bookings = bookings.filter(b => b.id !== bookingId);
      this.saveBookings(bookings);
      if (window.showToast) {
        window.showToast(`Booking ${bookingId} has been cancelled successfully.`, 'info');
      }
      this.openMyBookings();
    }
  }

  // Initialize and attach to global window
  window.hotelBookingCtrl = new HotelBookingController();

  // Update badge on load
  document.addEventListener('DOMContentLoaded', () => {
    window.hotelBookingCtrl.updateBookingsBadge();
  });

})();
