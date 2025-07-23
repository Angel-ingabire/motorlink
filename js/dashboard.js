// Dashboard JavaScript for MotorLink with API integration

// Base API URL
const API_BASE_URL = 'http://localhost:8000'; // Update with your actual API URL

// Helper function for API calls
async function makeApiRequest(endpoint, method = 'GET', data = null, authToken = null) {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const config = {
        method,
        headers,
    };
    
    if (data) {
        config.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (!response.ok) {
            const errorData = await response.json();
            
            // Handle validation errors specifically
            if (response.status === 422 && errorData.detail) {
                const validationErrors = errorData.detail.map(err => 
                    `${err.loc[1]}: ${err.msg}`
                ).join(', ');
                throw new Error(validationErrors);
            }
            
            throw new Error(errorData.detail || 'API request failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Main Dashboard Initialization
async function initializeDashboard() {
    try {
        // Check authentication
        const authToken = localStorage.getItem('motorlink_auth_token');
        if (!authToken) {
            window.location.href = 'login.html';
            return;
        }
        
        // Verify token is still valid by making an API call
        try {
            await makeApiRequest('/users/me/', 'GET', null, authToken);
        } catch (error) {
            // Token is invalid, clear it and redirect
            localStorage.removeItem('motorlink_auth_token');
            localStorage.removeItem('motorlink_current_user');
            window.location.href = 'login.html';
            return;
        }
        
        // Load user data - this will update the UI
        const user = await loadUserData(authToken);
        
        // Initialize components in parallel for better performance
        await Promise.allSettled([
            initializeStats(user.id, authToken),
            initializeRecentRides(user.id, authToken)
        ]);
        
        // Initialize components with real data
        await initializeStats(user.id, authToken);
        await initializeRecentRides(user.id, authToken);

        initializeRideBookingForm(authToken);
        initializeLocationServices();
        initializeLocationInputs();
        initializeRideTypeSelector();
        
        // Update UI elements
        setupEventListeners();
        
        // Mark initialization complete
        document.documentElement.setAttribute('data-init-complete', 'true');
        
    } catch (error) {
        console.error('Dashboard initialization failed:', error);
        showNotification(
            error.message || 'Failed to load dashboard', 
            'error',
            5000
        );
        
        // If it's an auth error, redirect to login
        if (error.message.includes('401') || error.message.includes('403')) {
            clearAuthData();
            redirectToLogin();
        }
    }
}

// Helper Functions
function redirectToLogin() {
    sessionStorage.setItem('redirect_after_login', window.location.pathname);
    window.location.href = 'login.html';
}

function clearAuthData() {
    localStorage.removeItem('motorlink_auth_token');
    localStorage.removeItem('motorlink_current_user');
    localStorage.removeItem('motorlink_current_user_id');
}

function setupEventListeners() {
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        clearAuthData();
        redirectToLogin();
    });
}

// User Functions
async function loadUserData(authToken) {
    try {
        const user = await makeApiRequest('/users/me/', 'GET', null, authToken);
        
        // Debug: Log the received user data
        console.log("User data received:", user);
        
        // Update the welcome message
        const welcomeMessage = document.querySelector('.text-2xl.font-bold.text-gray-900.mb-2');
        if (welcomeMessage && user?.full_name) {
            const firstName = user.full_name.split(' ')[0] || 'User';
            welcomeMessage.textContent = `Welcome back, ${firstName}!`;
        }
        
        // Update the profile name in the navigation
        const profileName = document.querySelector('#profile-menu span.hidden.md\\:block');
        if (profileName && user?.full_name) {
            profileName.textContent = user.full_name.split(' ')[0] || 'User';
        }
        
        // Update the profile image (if available)
        const profileImage = document.querySelector('#profile-menu img');
        if (profileImage && user?.profile_image_url) {
            profileImage.src = user.profile_image_url;
        } else if (profileImage) {
            // Fallback to generated avatar if no image
            const firstName = user?.full_name?.split(' ')[0] || 'User';
            profileImage.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&background=3B82F6&color=ffffff&rounded=true`;
        }
        
        return user;
    } catch (error) {
        console.error('Failed to load user data:', error);
        throw error;
    }
}

// Stats Functions
async function initializeStats(userId, authToken) {
    try {
        const stats = await makeApiRequest(`/stats/?user_id=${userId}`, 'GET', null, authToken);
        displayStats(stats);
    } catch (error) {
        console.error('Failed to load stats:', error);
        throw error;
    }
}

function displayStats(stats) {
    const totalTripsElement = document.querySelector('.stat-total-trips');
    const totalSpentElement = document.querySelector('.stat-total-spent');
    const avgRatingElement = document.querySelector('.stat-avg-rating');
    
    if (totalTripsElement) totalTripsElement.textContent = stats.total_rides || 0;
    if (totalSpentElement) totalSpentElement.textContent = `RWF ${(stats.total_spent || 0).toLocaleString()}`;
    if (avgRatingElement) avgRatingElement.textContent = (stats.avg_rating || 0).toFixed(1);
}

// Ride Functions
async function initializeRecentRides(userId, authToken) {
    try {
        const rides = await makeApiRequest(`/rides/?user_id=${userId}&limit=3`, 'GET', null, authToken);
        displayRecentRides(rides);
    } catch (error) {
        console.error('Failed to load recent rides:', error);
        throw error;
    }
}

function displayRecentRides(rides) {
    const container = document.querySelector('.recent-rides-container');
    if (!container) return;
    
    if (!rides || rides.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-route text-4xl mb-4"></i>
                <p>No recent rides yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = rides.map(ride => `
        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div class="flex items-center space-x-4">
                <div class="bg-blue-100 p-2 rounded-full">
                    <i class="fas fa-car text-blue-600"></i>
                </div>
                <div>
                    <p class="font-medium text-gray-900">${ride.start_location} → ${ride.end_location}</p>
                    <p class="text-sm text-gray-500">${formatDate(ride.requested_at)} • ${formatTime(ride.requested_at)}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="font-medium text-gray-900">RWF ${ride.fare.toLocaleString()}</p>
                <div class="flex items-center">
                    ${generateStarRating(ride.rating || 0)}
                    <span class="ml-1 text-sm text-gray-500">${(ride.rating || 0).toFixed(1)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Location Services
function initializeLocationServices() {
    if (!navigator.geolocation) {
        console.warn("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            localStorage.setItem('last_known_location', 
                JSON.stringify({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            );
        },
        (error) => {
            console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true, timeout: 5000 }
    );
}

function initializeLocationInputs() {
    const pickupInput = document.getElementById('pickup');
    const destinationInput = document.getElementById('destination');
    const useCurrentLocationBtn = document.getElementById('useCurrentLocation');
    
    if (pickupInput) setupLocationInput(pickupInput, 'pickup');
    if (destinationInput) setupLocationInput(destinationInput, 'destination');
    if (useCurrentLocationBtn) useCurrentLocationBtn.addEventListener('click', handleCurrentLocation);
}

function setupLocationInput(input, type) {
    let timeout;
    
    input.addEventListener('input', function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (this.value.length > 2) {
                showLocationSuggestions(this, this.value, type);
            } else {
                hideLocationSuggestions(this);
            }
        }, 300);
    });
    
    input.addEventListener('blur', function() {
        setTimeout(() => {
            hideLocationSuggestions(this);
        }, 200);
    });
    
    input.addEventListener('focus', function() {
        if (this.value.length > 2) {
            showLocationSuggestions(this, this.value, type);
        }
    });
}

async function handleCurrentLocation() {
    const pickupInput = document.getElementById('pickup');
    
    if (!pickupInput) return;
    
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const address = await reverseGeocode(position.coords.latitude, position.coords.longitude);
        
        pickupInput.value = address;
        pickupInput.dataset.lat = position.coords.latitude;
        pickupInput.dataset.lng = position.coords.longitude;
        
        showNotification('Current location set successfully', 'success');
        
    } catch (error) {
        console.error("Error getting location:", error);
        showNotification('Unable to get your location. Please enter manually.', 'error');
    }
}

async function reverseGeocode(lat, lng) {
    // In a real implementation, you would call a geocoding API here
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('Current Location, Kigali');
        }, 500);
    });
}

function showLocationSuggestions(input, query, type) {
    const suggestions = getLocationSuggestions(query);
    
    hideLocationSuggestions(input);
    
    if (suggestions.length === 0) return;
    
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto location-suggestions';
    
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center';
        item.innerHTML = `
            <i class="fas fa-map-marker-alt text-gray-400 mr-2"></i>
            <div>
                <div class="font-medium">${suggestion.name}</div>
                <div class="text-sm text-gray-500">${suggestion.address}</div>
            </div>
        `;
        
        item.addEventListener('click', function() {
            input.value = suggestion.name;
            input.dataset.lat = suggestion.lat;
            input.dataset.lng = suggestion.lng;
            hideLocationSuggestions(input);
        });
        
        suggestionsDiv.appendChild(item);
    });
    
    input.parentElement.style.position = 'relative';
    input.parentElement.appendChild(suggestionsDiv);
}

function hideLocationSuggestions(input) {
    const existing = input.parentElement.querySelector('.location-suggestions');
    if (existing) {
        existing.remove();
    }
}

function getLocationSuggestions(query) {
    const locations = [
        { name: 'Kigali Convention Centre', address: 'Kimisagara, Kigali', lat: -1.9441, lng: 30.0619 },
        { name: 'Kigali International Airport', address: 'Bugesera, Kigali', lat: -2.1785, lng: 30.1391 },
        { name: 'Kimisagara Market', address: 'Kimisagara, Nyarugenge', lat: -1.9536, lng: 30.0606 },
        { name: 'Kacyiru', address: 'Kacyiru, Gasabo', lat: -1.9355, lng: 30.0735 },
        { name: 'Remera', address: 'Remera, Gasabo', lat: -1.9449, lng: 30.0758 },
        { name: 'Nyamirambo', address: 'Nyamirambo, Nyarugenge', lat: -1.9667, lng: 30.0445 },
        { name: 'Kimihurura', address: 'Kimihurura, Gasabo', lat: -1.9302, lng: 30.0991 },
        { name: 'Gikondo', address: 'Gikondo, Kicukiro', lat: -1.9884, lng: 30.0726 },
        { name: 'Kicukiro Centre', address: 'Kicukiro, Kicukiro', lat: -1.9886, lng: 30.0946 },
        { name: 'Kibagabaga', address: 'Kibagabaga, Gasabo', lat: -1.9156, lng: 30.0875 }
    ];
    
    return locations.filter(location => 
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.address.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
}

// Ride Booking
function initializeRideBookingForm(authToken) {
    const form = document.getElementById('rideBookingForm');
    if (!form) return;

    form.addEventListener('submit', (e) => handleRideBooking(e, authToken));
}

async function handleRideBooking(e, authToken) {
    e.preventDefault();
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
        
        const user = JSON.parse(localStorage.getItem('motorlink_current_user'));
        if (!user?.id) throw new Error('User not authenticated');

        const formData = new FormData(form);
        
        // Validate form
        const errors = validateBookingForm(formData);
        if (errors.length > 0) {
            throw new Error(errors[0]);
        }
        
        // Get coordinates from selected locations or use defaults
        const pickupLat = parseFloat(document.getElementById('pickup').dataset.lat) || -1.9441;
        const pickupLng = parseFloat(document.getElementById('pickup').dataset.lng) || 30.0606;
        const destLat = parseFloat(document.getElementById('destination').dataset.lat) || -1.9441;
        const destLng = parseFloat(document.getElementById('destination').dataset.lng) || 30.0606;

        const rideType = formData.get('rideType');
        
        // Create payload that matches the RideCreate schema
        const rideRequest = {
            passenger_id: user.id,
            pickup_location_name: formData.get('pickup'),
            pickup_address: formData.get('pickup'),
            pickup_latitude: pickupLat,
            pickup_longitude: pickupLng,
            destination_location_name: formData.get('destination'),
            destination_address: formData.get('destination'),
            destination_latitude: destLat,
            destination_longitude: destLng,
            ride_type: rideType,
            estimated_fare: calculateEstimatedFare(formData.get('rideType'), formData.get('passengers')),
            requested_at: new Date().toISOString()
        };
        
        const response = await makeApiRequest('/rides/', 'POST', rideRequest, authToken);
        showNotification('Ride booked successfully!', 'success');
        
        localStorage.setItem('current_ride', JSON.stringify(response));
        setTimeout(() => window.location.href = 'tracking.html', 1500);
        
    } catch (error) {
        console.error('Ride booking failed:', error);
        showNotification(error.message || 'Failed to book ride', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
}

function validateBookingForm(formData) {
    const errors = [];
    
    if (!formData.get('pickup') || formData.get('pickup').trim().length < 2) {
        errors.push('Please enter a pickup location');
    }
    
    if (!formData.get('destination') || formData.get('destination').trim().length < 2) {
        errors.push('Please enter a destination');
    }
    
    if (formData.get('pickup') === formData.get('destination')) {
        errors.push('Pickup and destination cannot be the same');
    }
    
    if (!formData.get('rideType')) {
        errors.push('Please select a ride type');
    }
    
    return errors;
}

function calculateEstimatedFare(rideType, passengers) {
    const basePrices = {
        'motorbike': 2500,
        'car': 4000,
        'shared': 1800
    };
    let price = basePrices[rideType] || 2500;
    if (rideType === 'car') price += (parseInt(passengers) - 1) * 500;
    return price;
}

// Ride Type Selector
function initializeRideTypeSelector() {
    const rideTypeSelect = document.getElementById('rideType');
    if (!rideTypeSelect) return;

    rideTypeSelect.addEventListener('change', function() {
        updatePassengerOptions(this.value);
        updateEstimatedPrice();
    });
}

function updatePassengerOptions(rideType) {
    const passengersSelect = document.getElementById('passengers');
    if (!passengersSelect) return;
    
    passengersSelect.innerHTML = '';
    
    const maxPassengers = rideType === 'motorbike' ? 1 : 
                         rideType === 'car' ? 4 : 
                         3; // for shared rides
    
    for (let i = 1; i <= maxPassengers; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i === 1 ? '1 Passenger' : `${i} Passengers`;
        passengersSelect.appendChild(option);
    }
}

function updateEstimatedPrice() {
    const rideType = document.getElementById('rideType').value;
    const passengers = parseInt(document.getElementById('passengers').value) || 1;
    const priceElement = document.getElementById('estimatedPrice');
    
    if (!priceElement) return;
    
    const basePrices = {
        'motorbike': 2500,
        'car': 4000,
        'shared': 1800
    };
    
    let price = basePrices[rideType] || 2500;
    
    // Adjust for passengers (for cars)
    if (rideType === 'car' && passengers > 1) {
        price += (passengers - 1) * 500;
    }
    
    priceElement.textContent = `RWF ${price.toLocaleString()}`;
}

// UI Helpers
function showNotification(message, type = 'info', duration = 3000) {
    // In a real implementation, you would show a proper notification UI
    console.log(`${type.toUpperCase()}: ${message}`);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star text-yellow-400"></i>';
    }
    
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star text-yellow-400"></i>';
    }
    
    return starsHTML;
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});