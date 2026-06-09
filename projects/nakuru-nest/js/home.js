/* ===== RENDER FEATURED LISTINGS ===== */
(function () {
  const container = document.getElementById('featuredListings');
  if (!container || typeof listingsData === 'undefined') return;

  const badgeClass = { 'Top Rated': 'top', 'New': 'new', 'Featured': '' };

  container.innerHTML = listingsData.map(l => `
    <div class="listing-card">
      <div class="listing-img">
        <img src="${l.image}" alt="${l.name}" loading="lazy">
        ${l.badge ? `<span class="listing-badge ${badgeClass[l.badge] || ''}">${l.badge}</span>` : ''}
        <button class="wishlist-btn" aria-label="Save to wishlist">♡</button>
      </div>
      <div class="listing-body">
        <div class="listing-location">${l.location}</div>
        <h3 class="listing-name">${l.name}</h3>
        <div class="listing-amenities">
          ${l.amenities.map(a => `<span>${a}</span>`).join('')}
        </div>
        <div class="listing-footer">
          <div class="listing-price">
            KES ${l.priceNight.toLocaleString()}<span>/night</span>
          </div>
          <div class="listing-rating">${l.rating} (${l.reviews})</div>
        </div>
      </div>
    </div>
  `).join('');

  /* Wishlist toggle */
  container.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      btn.textContent = btn.textContent === '♡' ? '♥' : '♡';
      btn.style.color = btn.textContent === '♥' ? '#ef4444' : '';
    });
  });
})();
