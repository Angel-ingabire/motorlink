// Review JavaScript for MotorLink
// Handles review submission, star ratings, and review display

document.addEventListener('DOMContentLoaded', function() {
    initializeReviewSystem();
});

function initializeReviewSystem() {
    // Check if user is logged in
    if (!checkAuthStatus()) {
        return;
    }
    
    initializeStarRating();
    initializeReviewForm();
    initializeReviewFilters();
    loadRecentRide();
    loadExistingReviews();
}

// Check authentication status
function checkAuthStatus() {
    const isLoggedIn = storage.get('isLoggedIn');
    const user = storage.get('user');
    
    if (!isLoggedIn || !user) {
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// Initialize star rating system
function initializeStarRating() {
    const ratingStars = document.querySelectorAll('#ratingStars .fa-star');
    const ratingInput = document.getElementById('rating');
    
    if (ratingStars.length === 0) return;
    
    ratingStars.forEach((star, index) => {
        star.addEventListener('click', function() {
            const rating = index + 1;
            updateStarRating(rating);
            if (ratingInput) {
                ratingInput.value = rating;
            }
        });
        
        star.addEventListener('mouseover', function() {
            highlightStars(index + 1);
        });
    });
    
    // Reset on mouse leave
    const ratingContainer = document.getElementById('ratingStars');
    if (ratingContainer) {
        ratingContainer.addEventListener('mouseleave', function() {
            const currentRating = ratingInput ? parseInt(ratingInput.value) : 0;
            updateStarRating(currentRating);
        });
    }
}

// Update star rating display
function updateStarRating(rating) {
    const ratingStars = document.querySelectorAll('#ratingStars .fa-star');
    
    ratingStars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far', 'text-gray-300');
            star.classList.add('fas', 'text-yellow-400');
        } else {
            star.classList.remove('fas', 'text-yellow-400');
            star.classList.add('far', 'text-gray-300');
        }
    });
}

// Highlight stars on hover
function highlightStars(rating) {
    const ratingStars = document.querySelectorAll('#ratingStars .fa-star');
    
    ratingStars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far', 'text-gray-300');
            star.classList.add('fas', 'text-yellow-400');
        } else {
            star.classList.remove('fas', 'text-yellow-400');
            star.classList.add('far', 'text-gray-300');
        }
    });
}

// Initialize review form
function initializeReviewForm() {
    const submitReviewForm = document.getElementById('submitReviewForm');
    
    if (submitReviewForm) {
        submitReviewForm.addEventListener('submit', handleReviewSubmission);
    }
}

// Handle review form submission
async function handleReviewSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    loading.show(submitButton, 'Submitting review...');
    
    try {
        // Get form data
        const formData = new FormData(form);
        const reviewData = {
            tripDate: formData.get('tripDate'),
            driverName: formData.get('driverName'),
            rating: parseInt(formData.get('rating')),
            reviewText: formData.get('reviewText')
        };
        
        // Validate form
        const errors = validateReviewForm(reviewData);
        if (errors.length > 0) {
            throw new Error(errors[0]);
        }
        
        // Simulate API call
        await submitReview(reviewData);
        
        // Add review to local storage
        addReviewToStorage(reviewData);
        
        // Show success message
        showNotification('Review submitted successfully!', 'success');
        
        // Reset form and hide it
        form.reset();
        updateStarRating(0);
        hideReviewForm();
        
        // Refresh reviews display
        loadExistingReviews();
        
    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        loading.hide(submitButton, originalText);
    }
}

// Validate review form
function validateReviewForm(data) {
    const errors = [];
    
    if (!data.tripDate) {
        errors.push('Please select the trip date');
    }
    
    if (!data.driverName || data.driverName.trim().length < 2) {
        errors.push('Please enter the driver\'s name');
    }
    
    if (!data.rating || data.rating < 1 || data.rating > 5) {
        errors.push('Please select a rating between 1 and 5 stars');
    }
    
    if (!data.reviewText || data.reviewText.trim().length < 10) {
        errors.push('Please enter a review with at least 10 characters');
    }
    
    // Check if trip date is not in the future
    const tripDate = new Date(data.tripDate);
    const today = new Date();
    if (tripDate > today) {
        errors.push('Trip date cannot be in the future');
    }
    
    return errors;
}

// Simulate review submission API call
async function submitReview(reviewData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate successful submission
            resolve({ success: true, reviewId: utils.generateId() });
        }, 1000);
    });
}

// Add review to local storage
function addReviewToStorage(reviewData) {
    const user = storage.get('user');
    const reviews = storage.get('userReviews') || [];
    
    const newReview = {
        id: utils.generateId(),
        ...reviewData,
        userName: user.name,
        userEmail: user.email,
        submittedAt: new Date().toISOString(),
        helpful: 0,
        reported: false
    };
    
    reviews.unshift(newReview);
    storage.set('userReviews', reviews);
}

// Load recent ride data for review form
function loadRecentRide() {
    const recentRides = storage.get('recentRides') || [];
    const trackingData = storage.get('trackingData');
    
    let lastRide = null;
    
    if (trackingData && trackingData.driver) {
        lastRide = {
            date: new Date().toISOString().split('T')[0],
            driver: trackingData.driver.name
        };
    } else if (recentRides.length > 0) {
        const mostRecentRide = recentRides[0];
        lastRide = {
            date: new Date(mostRecentRide.date).toISOString().split('T')[0],
            driver: mostRecentRide.driver
        };
    }
    
    if (lastRide) {
        const tripDateInput = document.getElementById('tripDate');
        const driverNameInput = document.getElementById('driverName');
        
        if (tripDateInput) {
            tripDateInput.value = lastRide.date;
        }
        
        if (driverNameInput) {
            driverNameInput.value = lastRide.driver;
        }
    }
}

// Load existing reviews
function loadExistingReviews() {
    const userReviews = storage.get('userReviews') || [];
    const reviewsList = document.getElementById('reviewsList');
    
    if (!reviewsList) return;
    
    if (userReviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-star text-4xl mb-4"></i>
                <p>No reviews yet</p>
                <p class="text-sm">Your reviews will appear here after you submit them</p>
            </div>
        `;
        return;
    }
    
    // Display user reviews first, then sample reviews
    const allReviews = [...userReviews, ...getSampleReviews()];
    
    reviewsList.innerHTML = allReviews.map(review => `
        <div class="border-b border-gray-200 pb-6 ${userReviews.includes(review) ? 'bg-blue-50 p-4 rounded-lg mb-4' : ''}">
            <div class="flex items-start space-x-4">
                <img src="${getUserAvatar(review.userName || review.userEmail)}" alt="User" class="w-12 h-12 rounded-full">
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                        <div>
                            <h3 class="font-semibold text-gray-900">${review.userName || getNameFromEmail(review.userEmail)}</h3>
                            <p class="text-sm text-gray-600">${utils.formatDate(review.submittedAt || review.date)}</p>
                            ${userReviews.includes(review) ? '<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Your Review</span>' : ''}
                        </div>
                        <div class="flex text-yellow-400">
                            ${generateStarRating(review.rating)}
                        </div>
                    </div>
                    <p class="text-gray-700 mb-2">${review.reviewText}</p>
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Driver: ${review.driverName}</span>
                        <span>•</span>
                        <span>${getVehicleTypeFromContext(review) || 'Ride'}</span>
                        ${review.helpful ? `<span>•</span><span>${review.helpful} found helpful</span>` : ''}
                    </div>
                    ${userReviews.includes(review) ? `
                        <div class="mt-3 flex space-x-2">
                            <button onclick="editReview('${review.id}')" class="text-blue-600 hover:text-blue-700 text-sm">
                                <i class="fas fa-edit mr-1"></i>Edit
                            </button>
                            <button onclick="deleteReview('${review.id}')" class="text-red-600 hover:text-red-700 text-sm">
                                <i class="fas fa-trash mr-1"></i>Delete
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Get user avatar
function getUserAvatar(identifier) {
    const colors = ['3B82F6', '10B981', '8B5CF6', 'EF4444', 'F59E0B', '06B6D4'];
    const colorIndex = identifier.length % colors.length;
    const color = colors[colorIndex];
    const initial = identifier.charAt(0).toUpperCase();
    
    return `https://via.placeholder.com/48x48/${color}/FFFFFF?text=${initial}`;
}

// Get name from email
function getNameFromEmail(email) {
    return email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Get vehicle type from context
function getVehicleTypeFromContext(review) {
    // Try to determine vehicle type from review context
    const recentRides = storage.get('recentRides') || [];
    const matchingRide = recentRides.find(ride => 
        ride.driver === review.driverName && 
        Math.abs(new Date(ride.date) - new Date(review.submittedAt || review.date)) < 24 * 60 * 60 * 1000
    );
    
    if (matchingRide) {
        return matchingRide.vehicleType;
    }
    
    return null;
}

// Get sample reviews for demo
function getSampleReviews() {
    return [
        {
            userName: 'Alice Mukamana',
            date: '2025-01-10',
            rating: 5,
            reviewText: 'Excellent service! The driver was very professional and arrived on time. The ride was smooth and comfortable. Highly recommend MotorLink!',
            driverName: 'Jean-Claude Uwimana',
            vehicleType: 'Motorbike'
        },
        {
            userName: 'Pierre Kamanzi',
            date: '2025-01-09',
            rating: 4,
            reviewText: 'Good service overall. The app is easy to use and the fare was reasonable. Only minor issue was the driver took a slightly longer route than expected.',
            driverName: 'Eric Mutabazi',
            vehicleType: 'Car'
        },
        {
            userName: 'Marie Nyiramana',
            date: '2025-01-08',
            rating: 5,
            reviewText: 'Amazing experience! The shared ride option is perfect for saving money. The driver was friendly and the other passengers were respectful. Will definitely use again!',
            driverName: 'Alice Mukamana',
            vehicleType: 'Shared Ride'
        },
        {
            userName: 'David Mugabo',
            date: '2025-01-07',
            rating: 5,
            reviewText: 'Perfect for my daily commute! The tracking feature is very helpful and I always know when my ride will arrive. Great job MotorLink team!',
            driverName: 'Pierre Kamanzi',
            vehicleType: 'Motorbike'
        },
        {
            userName: 'Sarah Uwimana',
            date: '2025-01-06',
            rating: 4,
            reviewText: 'Very reliable service. I\'ve been using MotorLink for months now and it\'s consistently good. The prices are fair and the drivers are professional.',
            driverName: 'Jean-Claude Uwimana',
            vehicleType: 'Car'
        }
    ];
}

// Show review form
function showReviewForm() {
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.classList.remove('hidden');
        reviewForm.scrollIntoView({ behavior: 'smooth' });
    }
}

// Hide review form
function hideReviewForm() {
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.classList.add('hidden');
    }
}

// Edit review
function editReview(reviewId) {
    const userReviews = storage.get('userReviews') || [];
    const review = userReviews.find(r => r.id === reviewId);
    
    if (!review) return;
    
    // Show review form
    showReviewForm();
    
    // Populate form with existing data
    const tripDateInput = document.getElementById('tripDate');
    const driverNameInput = document.getElementById('driverName');
    const reviewTextInput = document.getElementById('reviewText');
    const ratingInput = document.getElementById('rating');
    
    if (tripDateInput) tripDateInput.value = review.tripDate;
    if (driverNameInput) driverNameInput.value = review.driverName;
    if (reviewTextInput) reviewTextInput.value = review.reviewText;
    if (ratingInput) ratingInput.value = review.rating;
    
    updateStarRating(review.rating);
    
    // Update form to edit mode
    const form = document.getElementById('submitReviewForm');
    const submitButton = form.querySelector('button[type="submit"]');
    
    submitButton.textContent = 'Update Review';
    form.dataset.editingId = reviewId;
    
    // Add cancel button
    if (!form.querySelector('.cancel-edit-btn')) {
        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.className = 'cancel-edit-btn flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors';
        cancelButton.textContent = 'Cancel';
        cancelButton.onclick = cancelEditReview;
        
        const buttonContainer = submitButton.parentElement;
        buttonContainer.insertBefore(cancelButton, submitButton);
        buttonContainer.classList.add('flex', 'space-x-4');
    }
    
    // Modify form submit handler
    form.onsubmit = handleReviewEdit;
}

// Handle review edit
async function handleReviewEdit(e) {
    e.preventDefault();
    
    const form = e.target;
    const editingId = form.dataset.editingId;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    loading.show(submitButton, 'Updating review...');
    
    try {
        // Get form data
        const formData = new FormData(form);
        const reviewData = {
            tripDate: formData.get('tripDate'),
            driverName: formData.get('driverName'),
            rating: parseInt(formData.get('rating')),
            reviewText: formData.get('reviewText')
        };
        
        // Validate form
        const errors = validateReviewForm(reviewData);
        if (errors.length > 0) {
            throw new Error(errors[0]);
        }
        
        // Update review in storage
        const userReviews = storage.get('userReviews') || [];
        const reviewIndex = userReviews.findIndex(r => r.id === editingId);
        
        if (reviewIndex !== -1) {
            userReviews[reviewIndex] = {
                ...userReviews[reviewIndex],
                ...reviewData,
                updatedAt: new Date().toISOString()
            };
            
            storage.set('userReviews', userReviews);
        }
        
        // Show success message
        showNotification('Review updated successfully!', 'success');
        
        // Reset form
        cancelEditReview();
        
        // Refresh reviews display
        loadExistingReviews();
        
    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        loading.hide(submitButton, originalText);
    }
}

// Cancel edit review
function cancelEditReview() {
    const form = document.getElementById('submitReviewForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const cancelButton = form.querySelector('.cancel-edit-btn');
    
    // Reset form
    form.reset();
    updateStarRating(0);
    
    // Remove edit mode
    delete form.dataset.editingId;
    submitButton.textContent = 'Submit Review';
    
    // Remove cancel button
    if (cancelButton) {
        cancelButton.remove();
        submitButton.parentElement.classList.remove('flex', 'space-x-4');
    }
    
    // Restore original submit handler
    form.onsubmit = handleReviewSubmission;
    
    // Hide form
    hideReviewForm();
}

// Delete review
function deleteReview(reviewId) {
    const confirmed = confirm('Are you sure you want to delete this review?');
    if (!confirmed) return;
    
    const userReviews = storage.get('userReviews') || [];
    const updatedReviews = userReviews.filter(r => r.id !== reviewId);
    
    storage.set('userReviews', updatedReviews);
    
    showNotification('Review deleted successfully', 'info');
    loadExistingReviews();
}

// Initialize review filters
function initializeReviewFilters() {
    // Add filter functionality if needed
    const filterButtons = document.querySelectorAll('.review-filter');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            filterReviews(filterType);
        });
    });
}

// Filter reviews
function filterReviews(filterType) {
    const reviewItems = document.querySelectorAll('#reviewsList > div');
    
    reviewItems.forEach(item => {
        let show = true;
        
        switch (filterType) {
            case 'my-reviews':
                show = item.classList.contains('bg-blue-50');
                break;
            case 'high-rating':
                const stars = item.querySelectorAll('.fas.fa-star').length;
                show = stars >= 4;
                break;
            case 'recent':
                const dateText = item.querySelector('.text-gray-600').textContent;
                const reviewDate = new Date(dateText);
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                show = reviewDate > weekAgo;
                break;
            default:
                show = true;
        }
        
        item.style.display = show ? 'block' : 'none';
    });
}

// Export functions for global use
window.showReviewForm = showReviewForm;
window.hideReviewForm = hideReviewForm;
window.editReview = editReview;
window.deleteReview = deleteReview;
window.cancelEditReview = cancelEditReview;
