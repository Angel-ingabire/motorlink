// Dashboard: Ride Search & Display
document.addEventListener('DOMContentLoaded', () => {
  const rides = [
    { rider: "Jean Bosco", from: "Kimironko", to: "Kacyiru", price: 2000 },
    { rider: "Alice", from: "Kigali City", to: "Nyamirambo", price: 1500 },
    { rider: "Mike", from: "Remera", to: "Gisozi", price: 1800 }
  ];

  const ridesList = document.getElementById('ridesList');
  const searchForm = document.getElementById('searchForm');

  if(searchForm){
    searchForm.addEventListener('submit', function(e){
      e.preventDefault();
      const current = document.getElementById('currentLoc').value.trim();
      const destination = document.getElementById('destination').value.trim();

      ridesList.innerHTML = '';

      // Filter can be expanded; currently shows all rides
      rides.forEach(ride => {
        const card = document.createElement('div');
        card.className = 'ride-card';
        card.innerHTML = `
          <p><strong>Rider:</strong> ${ride.rider}</p>
          <p>From ${ride.from} to ${ride.to}</p>
          <p><strong>Price:</strong> ${ride.price} RWF</p>
          <div class="btn-group">
            <a href="track.html" class="btn-sm">Track</a>
            <a href="review.html" class="btn-sm btn-yellow">Review</a>
            <a href="profile.html" class="btn-sm btn-gray">Profile</a>
          </div>
        `;
        ridesList.appendChild(card);
      });
    });
  }

  // Review: Star Rating
  const stars = document.querySelectorAll('.star');
  const ratingInput = document.getElementById('rating');

  if(stars.length > 0){
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = star.getAttribute('data-value');
        ratingInput.value = rating;
        updateStars(rating);
      });
      star.addEventListener('mouseover', () => {
        const rating = star.getAttribute('data-value');
        updateStars(rating);
      });
      star.addEventListener('mouseout', () => {
        updateStars(ratingInput.value);
      });
    });
  }

  function updateStars(rating) {
    stars.forEach(star => {
      star.innerHTML = star.getAttribute('data-value') <= rating ? '★' : '☆';
    });
  }
});
