// Review JavaScript for MotorLink
// Handles review submission, star ratings, and review display with FastAPI backend

document.addEventListener('DOMContentLoaded', function() {
    initializeReviewSystem();
});

// Base API configuration
const API_BASE_URL = 'http://localhost:8000'; // Update with your production URL
const AUTH_TOKEN_KEY = 'motorlink_auth_token';

// Simple notification function
function showNotification(message, type = 'success') {
    alert(`${type.toUpperCase()}: ${message}`);
}

// Simple loading state
const loading = {
    show: function(element, text) {
        element.disabled = true;
        const originalHTML = element.innerHTML;
        element.dataset.originalHtml = originalHTML;
        element.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    },
    hide: function(element) {
        element.disabled = false;
        if (element.dataset.originalHtml) {
            element.innerHTML = element.dataset.originalHtml;
        }
    }
};

function initializeReviewSystem() {
    if (!checkAuthStatus()) return;
    initializeStarRating();
    initializeReviewForm();
    loadRecentRide();
    loadExistingReviews();
}


// Check authentication status with JWT
function checkAuthStatus() {
    const token = localStorage.getItem('motorlink_auth_token');
    const user = localStorage.getItem('motorlink_current_user');
    
    if (!token || !user) {
        sessionStorage.setItem('redirect_after_login', window.location.pathname);
        window.location.href = 'login.html';
        return false;
    }
    
    try {
        JSON.parse(user);
        return true;
    } catch {
        return false;
    }
}

// API request helper
async function makeApiRequest(endpoint, method = 'GET', data = null) {
    const token = localStorage.getItem('motorlink_auth_token');
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        method,
        headers
    };
    
    if (data) {
        config.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { detail: response.statusText };
            }
            throw new Error(errorData.detail || 'Request failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', {
            endpoint,
            error: error.message,
            config
        });
        throw error;
    }
}

function showReviewForm() {
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.classList.remove('hidden');
        reviewForm.scrollIntoView({ behavior: 'smooth' });
    }
}

function hideReviewForm() {
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.classList.add('hidden');
    }
}

function initializeStarRating() {
  const stars = document.querySelectorAll('#ratingStars i');
  const ratingInput = document.getElementById('rating');

  // Set initial state
  const currentRating = parseInt(ratingInput.value) || 0;
  highlightStars(currentRating);

  stars.forEach(star => {
    star.addEventListener('click', (e) => {
      e.preventDefault();
      const ratingValue = parseInt(star.getAttribute('data-rating'));
      ratingInput.value = ratingValue;
      highlightStars(ratingValue);
    });

    star.addEventListener('mouseover', (e) => {
      const hoverValue = parseInt(star.getAttribute('data-rating'));
      highlightStars(hoverValue);
    });

    star.addEventListener('mouseout', () => {
      const currentRating = parseInt(ratingInput.value) || 0;
      highlightStars(currentRating);
    });
  });
}

function highlightStars(rating) {
  const stars = document.querySelectorAll('#ratingStars i');
  stars.forEach(star => {
    const starValue = parseInt(star.getAttribute('data-rating'));
    if (starValue <= rating) {
      star.classList.remove('far');
      star.classList.add('fas', 'text-yellow-400');
    } else {
      star.classList.remove('fas', 'text-yellow-400');
      star.classList.add('far', 'text-gray-300');
    }
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeStarRating();
});

// Helper function to generate star rating HTML
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  let starsHTML = '';

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }
  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }

  return starsHTML;
}

// Initialize review form with API integration
function initializeReviewForm() {
    const submitReviewForm = document.getElementById('submitReviewForm');
    
    if (submitReviewForm) {
        submitReviewForm.addEventListener('submit', handleReviewSubmission);
    }
}

// Handle review submission with API
async function handleReviewSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
        loading.show(submitButton, 'Submitting review...');
        
        // Get form data
        const formData = new FormData(form);
        const reviewData = {
            ride_id: formData.get('rideId'),
            rating: parseInt(formData.get('rating')),
            comment: formData.get('reviewText')
        };
        
        // Validate form
        const errors = validateReviewForm(reviewData);
        if (errors.length > 0) {
            throw new Error(errors[0]);
        }
        
        // Submit to API
        const response = await makeApiRequest('/feedback/', 'POST', reviewData);
        
        showNotification('Review submitted successfully!', 'success');
        
        // Reset form
        form.reset();
        updateStarRating(0);
        hideReviewForm();
        
        // Refresh reviews
        loadExistingReviews();
        
    } catch (error) {
        showNotification(error.message || 'Failed to submit review', 'error');
    } finally {
        loading.hide(submitButton);
    }
}

// Updated validation for API requirements
function validateReviewForm(data) {
    const errors = [];
    
    if (!data.ride_id) {
        errors.push('Please select a ride to review');
    }
    
    if (!data.rating || data.rating < 1 || data.rating > 5) {
        errors.push('Please select a rating between 1 and 5 stars');
    }
    
    if (!data.comment || data.comment.trim().length < 10) {
        errors.push('Please enter a review with at least 10 characters');
    }
    
    return errors;
}

async function loadRecentRide() {
    try {
        // Get user's recent completed rides
        const user = JSON.parse(localStorage.getItem('motorlink_current_user'));
        if (!user) return;

        const rides = await makeApiRequest(`/rides/?passenger_id=${user.id}&status=completed&limit=1`);
        if (rides.length > 0) {
            const recentRide = rides[0];
            
            // Populate form fields
            const tripDateInput = document.getElementById('tripDate');
            const driverNameInput = document.getElementById('driverName');
            const rideIdInput = document.getElementById('rideId');
            
            if (tripDateInput) {
                tripDateInput.value = new Date(recentRide.requested_at).toISOString().split('T')[0];
            }
            
            if (driverNameInput && recentRide.driver) {
                driverNameInput.value = recentRide.driver.user?.full_name || 'Driver';
            }
            
            if (rideIdInput) {
                rideIdInput.value = recentRide.id;
            }
        }
    } catch (error) {
        console.error('Failed to load recent ride:', error);
    }
}

async function loadExistingReviews() {
    const reviewsList = document.getElementById('reviewsList');
    
    if (!reviewsList) return;
    
    try {
        // Show loading state
        reviewsList.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-spinner fa-spin text-2xl text-blue-500"></i>
                <p class="mt-2 text-gray-600">Loading reviews...</p>
            </div>
        `;
        
        // Get user ID
        const user = JSON.parse(localStorage.getItem('motorlink_current_user'));
        if (!user) return;
        
        // Fetch user's reviews
        const userReviews = await makeApiRequest(`/feedback/?reviewer_id=${user.id}`);
        
        if (userReviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-star text-4xl mb-4"></i>
                    <p>No reviews yet</p>
                    <p class="text-sm">Be the first to leave a review!</p>
                </div>
            `;
            return;
        }
        
        // Display reviews
        reviewsList.innerHTML = userReviews
            .map(review => createReviewCard(review))
            .join('');
        
    } catch (error) {
        console.error('Failed to load reviews:', error);
        reviewsList.innerHTML = `
            <div class="text-center py-8 text-red-500">
                <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
                <p>Failed to load reviews</p>
                <p class="text-sm">${error.message || 'Please try again later'}</p>
            </div>
        `;
    }
}

// Create review card HTML
function createReviewCard(review) {
    // Generate initials for avatar
    const name = review.user?.full_name || 'Anonymous';
    const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'US';
    
    // Generate avatar color
    const colors = ['blue', 'green', 'purple', 'red', 'yellow'];
    const colorIndex = initials.charCodeAt(0) % colors.length;
    const avatarColor = colors[colorIndex];
    
    // Safely handle potentially missing data
    const driverName = review.ride?.driver?.user?.full_name || 'Driver';
    const vehicleType = review.ride?.vehicle_type || 'Ride';
    const comment = review.comment || 'No comment provided';
    const rating = review.rating || 0;
    const reviewDate = review.created_at ? new Date(review.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }) : 'Date not available';

    return `
        <div class="border-b border-gray-200 pb-6">
            <div class="flex items-start space-x-4">
                <div class="avatar avatar-${avatarColor}">${initials}</div>
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                        <div>
                            <h3 class="font-semibold text-gray-900">${name}</h3>
                            <p class="text-sm text-gray-600">${reviewDate}</p>
                        </div>
                        <div class="flex text-yellow-400">
                            ${generateStarRating(rating)}
                        </div>
                    </div>
                    <p class="text-gray-700 mb-2">${comment}</p>
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Driver: ${driverName}</span>
                        <span>•</span>
                        <span>${vehicleType}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Export functions for global use
window.showReviewForm = showReviewForm;
window.hideReviewForm = hideReviewForm;