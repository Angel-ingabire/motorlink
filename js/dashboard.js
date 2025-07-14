// Dashboard JavaScript for MotorLink
// Handles ride booking, search, and dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Check if user is logged in
    if (!checkAuthStatus()) {
        return;
    }
    
    initializeRideBookingForm();
    initializeLocationServices();
    initializeRecentRides();
    initializeStats();
    loadUserData();
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

// Initialize ride booking form
function initializeRideBookingForm() {
    const rideBookingForm = document.getElementById('rideBookingForm');
    
    if (rideBookingForm) {
        rideBookingForm.addEventListener('submit', handleRideBooking);
        
        // Initialize form inputs
        initializeLocationInputs();
        initializeRideTypeSelector();
        initializeScheduleToggle();
    }
}

// Initialize location inputs with suggestions
function initializeLocationInputs() {
    const pickupInput = document.getElementById('pickup');
    const destinationInput = document.getElementById('destination');
    
    if (pickupInput) {
        initializeLocationInput(pickupInput, 'pickup');
    }
    
    if (destinationInput) {
        initializeLocationInput(destinationInput, 'destination');
    }
}

// Initialize individual location input
function initializeLocationInput(input, type) {
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
        // Hide suggestions after a delay to allow for selection
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

// Show location suggestions
function showLocationSuggestions(input, query, type) {
    const suggestions = getLocationSuggestions(query);
    
    // Remove existing suggestions
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
            hideLocationSuggestions(input);
            
            // Store selected location data
            input.dataset.lat = suggestion.lat;
            input.dataset.lng = suggestion.lng;
        });
        
        suggestionsDiv.appendChild(item);
    });
    
    // Position suggestions
    const inputRect = input.getBoundingClientRect();
    suggestionsDiv.style.top = '100%';
    suggestionsDiv.style.left = '0';
    suggestionsDiv.style.right = '0';
    
    input.parentElement.style.position = 'relative';
    input.parentElement.appendChild(suggestionsDiv);
}

// Hide location suggestions
function hideLocationSuggestions(input) {
    const existing = input.parentElement.querySelector('.location-suggestions');
    if (existing) {
        existing.remove();
    }
}

// Get location suggestions (mock data)
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

// Initialize ride type selector
function initializeRideTypeSelector() {
    const rideTypeSelect = document.getElementById('rideType');
    
    if (rideTypeSelect) {
        rideTypeSelect.addEventListener('change', function() {
            updatePassengerOptions(this.value);
            updateEstimatedPrice();
        });
    }
}

// Update passenger options based on ride type
function updatePassengerOptions(rideType) {
    const passengersSelect = document.getElementById('passengers');
    
    if (!passengersSelect) return;
    
    const options = {
        'motorbike': [
            { value: '1', text: '1 Passenger' }
        ],
        'car': [
            { value: '1', text: '1 Passenger' },
            { value: '2', text: '2 Passengers' },
            { value: '3', text: '3 Passengers' },
            { value: '4', text: '4 Passengers' }
        ],
        'shared': [
            { value: '1', text: '1 Passenger' },
            { value: '2', text: '2 Passengers' }
        ]
    };
    
    const availableOptions = options[rideType] || options['motorbike'];
    
    passengersSelect.innerHTML = '';
    availableOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        passengersSelect.appendChild(optionElement);
    });
}

// Initialize schedule toggle
function initializeScheduleToggle() {
    const rideTimeSelect = document.getElementById('rideTime');
    
    if (rideTimeSelect) {
        rideTimeSelect.addEventListener('change', function() {
            if (this.value === 'scheduled') {
                showScheduleOptions();
            } else {
                hideScheduleOptions();
            }
        });
    }
}

// Show schedule options
function showScheduleOptions() {
    const form = document.getElementById('rideBookingForm');
    const existingSchedule = form.querySelector('.schedule-options');
    
    if (existingSchedule) return;
    
    const scheduleDiv = document.createElement('div');
    scheduleDiv.className = 'schedule-options grid grid-cols-1 md:grid-cols-2 gap-4 mt-4';
    scheduleDiv.innerHTML = `
        <div>
            <label for="scheduleDate" class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-calendar text-blue-600 mr-2"></i>
                Date
            </label>
            <input type="date" id="scheduleDate" name="scheduleDate" required
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   min="${new Date().toISOString().split('T')[0]}">
        </div>
        <div>
            <label for="scheduleTime" class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-clock text-blue-600 mr-2"></i>
                Time
            </label>
            <input type="time" id="scheduleTime" name="scheduleTime" required
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
    `;
    
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.parentElement.insertBefore(scheduleDiv, submitButton.parentElement);
}

// Hide schedule options
function hideScheduleOptions() {
    const scheduleOptions = document.querySelector('.schedule-options');
    if (scheduleOptions) {
        scheduleOptions.remove();
    }
}

// Handle ride booking form submission
async function handleRideBooking(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    loading.show(submitButton, 'Searching for rides...');
    
    try {
        // Get form data
        const formData = new FormData(form);
        const bookingData = {
            pickup: formData.get('pickup'),
            destination: formData.get('destination'),
            rideType: formData.get('rideType'),
            passengers: formData.get('passengers'),
            rideTime: formData.get('rideTime'),
            scheduleDate: formData.get('scheduleDate'),
            scheduleTime: formData.get('scheduleTime')
        };
        
        // Validate form
        const errors = validateBookingForm(bookingData);
        if (errors.length > 0) {
            throw new Error(errors[0]);
        }
        
        // Store booking data for results page
        storage.set('currentBooking', bookingData);
        
        // Simulate API call
        await simulateRideSearch(bookingData);
        
        // Show success message
        showNotification('Finding available rides...', 'success');
        
        // Redirect to results page
        setTimeout(() => {
            window.location.href = 'results.html';
        }, 1000);
        
    } catch (error) {
        showNotification(error.message, 'error');
        loading.hide(submitButton, originalText);
    }
}

// Validate booking form
function validateBookingForm(data) {
    const errors = [];
    
    if (!data.pickup || data.pickup.trim().length < 2) {
        errors.push('Please enter a pickup location');
    }
    
    if (!data.destination || data.destination.trim().length < 2) {
        errors.push('Please enter a destination');
    }
    
    if (data.pickup === data.destination) {
        errors.push('Pickup and destination cannot be the same');
    }
    
    if (!data.rideType) {
        errors.push('Please select a ride type');
    }
    
    if (data.rideTime === 'scheduled') {
        if (!data.scheduleDate || !data.scheduleTime) {
            errors.push('Please select date and time for scheduled ride');
        }
        
        const scheduledDateTime = new Date(`${data.scheduleDate}T${data.scheduleTime}`);
        if (scheduledDateTime <= new Date()) {
            errors.push('Scheduled time must be in the future');
        }
    }
    
    return errors;
}

// Simulate ride search API call
async function simulateRideSearch(bookingData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, availableRides: 4 });
        }, 1500);
    });
}

// Initialize location services
function initializeLocationServices() {
    const useCurrentLocationBtn = document.getElementById('useCurrentLocation');
    
    if (useCurrentLocationBtn) {
        useCurrentLocationBtn.addEventListener('click', handleCurrentLocation);
    }
}

// Handle current location
async function handleCurrentLocation() {
    const pickupInput = document.getElementById('pickup');
    
    if (!pickupInput) return;
    
    try {
        const position = await utils.getCurrentLocation();
        
        // Reverse geocode to get address
        const address = await reverseGeocode(position.latitude, position.longitude);
        
        pickupInput.value = address;
        pickupInput.dataset.lat = position.latitude;
        pickupInput.dataset.lng = position.longitude;
        
        showNotification('Current location set successfully', 'success');
        
    } catch (error) {
        showNotification('Unable to get your location. Please enter manually.', 'error');
    }
}

// Reverse geocode coordinates to address (mock implementation)
async function reverseGeocode(lat, lng) {
    // This would typically call a geocoding API
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('Current Location, Kigali');
        }, 500);
    });
}

// Initialize recent rides
function initializeRecentRides() {
    const recentRides = getRecentRides();
    displayRecentRides(recentRides);
}

// Get recent rides from storage
function getRecentRides() {
    const rides = storage.get('recentRides') || [];
    return rides.slice(0, 3); // Show only last 3 rides
}

// Display recent rides
function displayRecentRides(rides) {
    const container = document.querySelector('.recent-rides-container');
    if (!container) return;
    
    if (rides.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-route text-4xl mb-4"></i>
                <p>No recent rides yet</p>
                <p class="text-sm">Your ride history will appear here</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = rides.map(ride => `
        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div class="flex items-center space-x-4">
                <div class="bg-${getVehicleColor(ride.vehicleType)}-100 p-2 rounded-full">
                    <i class="fas fa-${getVehicleIcon(ride.vehicleType)} text-${getVehicleColor(ride.vehicleType)}-600"></i>
                </div>
                <div>
                    <p class="font-medium text-gray-900">${ride.route}</p>
                    <p class="text-sm text-gray-500">${utils.formatDate(ride.date)} • ${utils.formatTime(ride.date)}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="font-medium text-gray-900">${utils.formatCurrency(ride.fare)}</p>
                <div class="flex items-center">
                    ${generateStarRating(ride.rating)}
                    <span class="ml-1 text-sm text-gray-500">${ride.rating}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize stats
function initializeStats() {
    const stats = getUserStats();
    displayStats(stats);
}

// Get user stats
function getUserStats() {
    const user = storage.get('user');
    const rides = storage.get('recentRides') || [];
    
    return {
        totalTrips: rides.length,
        totalSpent: rides.reduce((sum, ride) => sum + ride.fare, 0),
        averageRating: rides.length > 0 ? rides.reduce((sum, ride) => sum + ride.rating, 0) / rides.length : 0,
        favoriteRoute: getMostFrequentRoute(rides)
    };
}

// Display stats
function displayStats(stats) {
    const statsElements = {
        totalTrips: document.querySelector('.stat-total-trips'),
        totalSpent: document.querySelector('.stat-total-spent'),
        averageRating: document.querySelector('.stat-rating'),
        favoriteRoute: document.querySelector('.stat-favorite-route')
    };
    
    if (statsElements.totalTrips) {
        statsElements.totalTrips.textContent = stats.totalTrips;
    }
    
    if (statsElements.totalSpent) {
        statsElements.totalSpent.textContent = utils.formatCurrency(stats.totalSpent);
    }
    
    if (statsElements.averageRating) {
        statsElements.averageRating.textContent = stats.averageRating.toFixed(1);
    }
    
    if (statsElements.favoriteRoute) {
        statsElements.favoriteRoute.textContent = stats.favoriteRoute || 'No data yet';
    }
}

// Load user data
function loadUserData() {
    const user = storage.get('user');
    if (!user) return;
    
    // Update user name in navigation
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        userNameElement.textContent = user.name;
    }
    
    // Update welcome message
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${user.name.split(' ')[0]}!`;
    }
}

// Utility functions
function getVehicleIcon(type) {
    const icons = {
        'motorbike': 'motorcycle',
        'car': 'car',
        'shared': 'users'
    };
    return icons[type] || 'car';
}

function getVehicleColor(type) {
    const colors = {
        'motorbike': 'blue',
        'car': 'green',
        'shared': 'purple'
    };
    return colors[type] || 'gray';
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

function getMostFrequentRoute(rides) {
    if (rides.length === 0) return null;
    
    const routeCount = {};
    rides.forEach(ride => {
        routeCount[ride.route] = (routeCount[ride.route] || 0) + 1;
    });
    
    return Object.keys(routeCount).reduce((a, b) => routeCount[a] > routeCount[b] ? a : b);
}

// Update estimated price based on selections
function updateEstimatedPrice() {
    const rideType = document.getElementById('rideType').value;
    const passengers = document.getElementById('passengers').value;
    
    if (!rideType) return;
    
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
    
    const estimatedPriceElement = document.getElementById('estimatedPrice');
    if (estimatedPriceElement) {
        estimatedPriceElement.textContent = utils.formatCurrency(price);
    }
}

// Add sample data for demo purposes
function addSampleData() {
    const sampleRides = [
        {
            id: '1',
            route: 'Kimisagara → Kigali City',
            date: new Date('2025-01-10T14:30:00'),
            fare: 2500,
            rating: 5.0,
            vehicleType: 'motorbike',
            driver: 'Jean-Claude Uwimana'
        },
        {
            id: '2',
            route: 'Kacyiru → Remera',
            date: new Date('2025-01-08T09:15:00'),
            fare: 3200,
            rating: 4.0,
            vehicleType: 'car',
            driver: 'Alice Mukamana'
        },
        {
            id: '3',
            route: 'Nyamirambo → Airport',
            date: new Date('2025-01-05T06:00:00'),
            fare: 4800,
            rating: 5.0,
            vehicleType: 'shared',
            driver: 'Pierre Kamanzi'
        }
    ];
    
    if (!storage.get('recentRides')) {
        storage.set('recentRides', sampleRides);
    }
}

// Initialize sample data on first load
if (!storage.get('dataInitialized')) {
    addSampleData();
    storage.set('dataInitialized', true);
}
