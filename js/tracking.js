// Tracking JavaScript for MotorLink
// Handles real-time ride tracking and updates

const storage = {
    get: (key) => localStorage.getItem(key),
    set: (key, value) => localStorage.setItem(key, value),
    remove: (key) => localStorage.removeItem(key)
};

function updateMap() {
    // First ensure the map container exists
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }

    // Clear any existing map
    if (window.map) {
        window.map.remove();
    }

    // Initialize the map with either pickup location or default Kigali view
    const initialView = rideData.pickup?.coordinates || [-1.9441, 30.0619];
    window.map = L.map('map').setView(initialView, 15);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(window.map);

    // Add pickup marker if coordinates exist
    if (rideData.pickup?.coordinates) {
        L.marker(rideData.pickup.coordinates)
            .addTo(window.map)
            .bindPopup(`<b>Pickup</b><br>${rideData.pickup.address || 'Location'}`);
    }

    // Add destination marker if coordinates exist
    if (rideData.destination?.coordinates) {
        L.marker(rideData.destination.coordinates)
            .addTo(window.map)
            .bindPopup(`<b>Destination</b><br>${rideData.destination.address || 'Location'}`);
    }

    // Fit bounds to show both markers if available
    if (rideData.pickup?.coordinates && rideData.destination?.coordinates) {
        window.map.fitBounds([
            rideData.pickup.coordinates,
            rideData.destination.coordinates
        ], { padding: [50, 50] });
    }
}

// Update map indicators
function updateMapIndicators() {
    const indicators = {
        pickup: document.querySelector('.map-pickup'),
        destination: document.querySelector('.map-destination'),
        driver: document.querySelector('.map-driver')
    };

    // Update pickup indicator
    if (indicators.pickup) {
        indicators.pickup.textContent = `Pickup: ${rideData.pickup}`;
    }

    // Update destination indicator
    if (indicators.destination) {
        indicators.destination.textContent = `Destination: ${rideData.destination}`;
    }

    // Update driver indicator (simulate movement)
    if (indicators.driver) {
        indicators.driver.textContent = `Driver: ${getDriverLocationText()}`;
    }
}

// Global tracking variables
let trackingInterval;
let rideData = {};
let trackingState = 'searching'; // searching, confirmed, enroute, arrived, inprogress, completed

function initializeTracking() {
    if (!checkAuthStatus()) {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
        return;
    }

    // Try to load ride data
    const dataLoaded = loadRideData();

    if (!dataLoaded) {
        showNotification('No active ride found', 'error');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        return;
    }

    // Only proceed with tracking if we have data
    initializeTrackingUI();
    initializeTrackingMap();
    startTracking();
    initializeCancelRide();
    initializeDriverContact();
}


// Check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('motorlink_auth_token');
    const user = localStorage.getItem('motorlink_current_user');

    if (!token || !user) {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
        return false;
    }

    return true;
}

// Load ride data
function loadRideData() {
    // First try to get from localStorage
    try {
        const trackingData = JSON.parse(localStorage.getItem('trackingData'));
        if (trackingData) {
            rideData = trackingData;

            // If coordinates exist in URL params, override them
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('pickup') && urlParams.has('destination')) {
                rideData.pickup.coordinates = formatLocationFromURL(urlParams.get('pickup'));
                rideData.destination.coordinates = formatLocationFromURL(urlParams.get('destination'));
            }

            formatCoordinates(rideData);
            return true; // Successfully loaded data
        }
    } catch (e) {
        console.error('Error parsing trackingData:', e);
    }

    // Fallback to URL parameters only
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('pickup') && urlParams.has('destination')) {
        rideData = {
            pickup: {
                address: "Pickup Location",
                coordinates: formatLocationFromURL(urlParams.get('pickup'))
            },
            destination: {
                address: "Destination",
                coordinates: formatLocationFromURL(urlParams.get('destination'))
            },
            rideType: urlParams.get('rideType') || 'motorbike',
            fare: parseInt(urlParams.get('fare')) || 0,
            distance: parseFloat(urlParams.get('distance')) || 0,
            status: 'confirmed',
            driver: {
                name: "Driver",
                rating: 4.5,
                vehicle: "Vehicle"
            }
        };

        formatCoordinates(rideData);
        return true; // Successfully loaded data
    }

    // If no data found
    console.error('No ride data found');
    return false;
}

function formatLocationFromURL(param) {
    if (!param) return null;

    try {
        // Split and reverse to get [lat, lng] from "lng,lat"
        const [lng, lat] = param.split(',').map(Number);
        if (isNaN(lat) || isNaN(lng)) throw new Error('Invalid coordinates');
        return [lat, lng]; // Return as [lat, lng] for Leaflet
    } catch (e) {
        console.error('Error parsing coordinates:', e);
        return null;
    }
}

function formatCoordinates(rideData) {
    // Ensure coordinates are properly formatted arrays
    if (rideData.pickup?.coordinates && !Array.isArray(rideData.pickup.coordinates)) {
        rideData.pickup.coordinates = formatLocationFromURL(rideData.pickup.coordinates);
    }
    if (rideData.destination?.coordinates && !Array.isArray(rideData.destination.coordinates)) {
        rideData.destination.coordinates = formatLocationFromURL(rideData.destination.coordinates);
    }
}

// Calculate fare based on booking data
function calculateFare(booking) {
    const baseFares = {
        'motorbike': 2500,
        'car': 4000,
        'shared': 1800
    };

    return baseFares[booking.rideType] || 2500;
}

// Initialize tracking UI
function initializeTrackingUI() {
    updateRideStatus();
    updateDriverInfo();
    updateTripDetails();
    document.addEventListener("DOMContentLoaded", () => {
        updateMap();
    });

}

// Update ride status
function updateRideStatus() {
    const statusElement = document.getElementById('rideStatus');
    const etaElement = document.getElementById('eta');

    if (!statusElement || !etaElement) return;

    const statuses = {
        'searching': { text: 'Searching for driver...', color: 'yellow' },
        'confirmed': { text: 'Driver confirmed', color: 'green' },
        'enroute': { text: 'Driver en route', color: 'blue' },
        'arrived': { text: 'Driver has arrived', color: 'green' },
        'inprogress': { text: 'Trip in progress', color: 'blue' },
        'completed': { text: 'Trip completed', color: 'green' }
    };

    const currentStatus = statuses[trackingState] || statuses['searching'];
    statusElement.textContent = currentStatus.text;
    statusElement.className = `text-sm font-medium text-${currentStatus.color}-600`;

    // Update ETA
    if (rideData.estimatedArrival) {
        const eta = new Date(rideData.estimatedArrival);
        const now = new Date();
        const diff = Math.ceil((eta - now) / (1000 * 60));

        if (diff > 0) {
            etaElement.textContent = `${diff} minute${diff > 1 ? 's' : ''}`;
        } else {
            etaElement.textContent = 'Arriving now';
        }
    }
}

// Update driver info
function updateDriverInfo() {
    if (!rideData.driver) return;

    const elements = {
        name: document.querySelector('.driver-name'),
        rating: document.querySelector('.driver-rating'),
        reviews: document.querySelector('.driver-reviews'),
        vehicle: document.querySelector('.driver-vehicle'),
        plate: document.querySelector('.driver-plate'),
        color: document.querySelector('.driver-color'),
        photo: document.querySelector('.driver-photo')
    };

    if (elements.name) elements.name.textContent = rideData.driver.name;
    if (elements.rating) elements.rating.textContent = rideData.driver.rating;
    if (elements.reviews) elements.reviews.textContent = `(${rideData.driver.reviews} reviews)`;
    if (elements.vehicle) elements.vehicle.textContent = rideData.driver.vehicle.type;
    if (elements.plate) elements.plate.textContent = rideData.driver.vehicle.plate;
    if (elements.color) elements.color.textContent = rideData.driver.vehicle.color;
    if (elements.photo) elements.photo.src = rideData.driver.photo;
}

// Replace your current updateTripDetails() function with this:
function updateTripDetails() {
    if (!rideData) return;

    // Format fare as whole RWF (no decimals)
    const formattedFare = rideData.fare ?
        `RWF ${Math.round(rideData.fare)}` :
        'N/A';

    // Update UI elements
    const pickupLocation = document.getElementById('pickupLocation');
    if (pickupLocation) {
        pickupLocation.textContent = rideData.pickup?.address || 'Pickup location not available';
    }

    const destinationLocation = document.getElementById('destinationLocation');
    if (destinationLocation) {
        destinationLocation.textContent = rideData.destination?.address || 'Destination not available';
    }

    document.getElementById('fareAmount').textContent = formattedFare;
    document.getElementById('tripDistance').textContent = rideData.distance ? `${rideData.distance} km` : 'N/A';
    document.getElementById('rideTypeDisplay').textContent = rideData.rideType || 'N/A';
}

// Get driver location text based on tracking state
function getDriverLocationText() {
    const locations = {
        'searching': 'Searching...',
        'confirmed': 'On the way',
        'enroute': 'En route to you',
        'arrived': 'At pickup location',
        'inprogress': 'En route to destination',
        'completed': 'Trip completed'
    };

    return locations[trackingState] || 'Unknown';
}

// Start tracking
function startTracking() {
    // Clear any existing interval
    if (trackingInterval) {
        clearInterval(trackingInterval);
    }

    // Start tracking updates every 5 seconds
    trackingInterval = setInterval(() => {
        updateTrackingState();
        updateLiveUpdates();
        updateTrackingUI();
    }, 5000);
}

// Update tracking state (simulate ride progress)
function updateTrackingState() {
    const now = new Date();
    const bookingTime = new Date(rideData.bookingTime);
    const elapsed = (now - bookingTime) / 1000; // seconds

    let newTrackingState;

    if (elapsed < 30) newTrackingState = 'searching';
    else if (elapsed < 60) newTrackingState = 'confirmed';
    else if (elapsed < 180) newTrackingState = 'enroute';
    else if (elapsed < 210) newTrackingState = 'arrived';
    else if (elapsed < 600) newTrackingState = 'inprogress';
    else newTrackingState = 'completed';

    trackingState = newTrackingState;
    rideData.status = trackingState;
    localStorage.setItem('trackingData', JSON.stringify(rideData));

    if (trackingState === 'completed') {
        completeRide();
    }
}

// Update live updates
function updateLiveUpdates() {
    const updatesContainer = document.getElementById('liveUpdates');
    if (!updatesContainer) return;

    const updates = [
        {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            message: 'Driver en route to destination',
            icon: 'car',
            color: 'blue'
        },
        {
            time: new Date(Date.now() - 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            message: 'Driver arrived at pickup',
            icon: 'map-marker-alt',
            color: 'green'
        }
    ];

    updatesContainer.innerHTML = updates.map(update => `
        <div class="flex items-start space-x-3 mb-3">
            <div class="bg-${update.color}-100 p-2 rounded-full">
                <i class="fas fa-${update.icon} text-${update.color}-600"></i>
            </div>
            <div>
                <p class="text-sm text-gray-600">${update.time}</p>
                <p class="font-medium text-gray-900">${update.message}</p>
            </div>
        </div>
    `).join('');
}

function startRealTimeUpdates() {
    setInterval(() => {
        fetchRideUpdate();
    }, 5000); // Update every 5 seconds
}

async function fetchRideUpdate() {
    try {
        const response = await fetch(`/api/rides/${rideData.id}/status`);
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error('Update failed:', error);
    }
}
// Get live updates based on tracking state
function getLiveUpdates() {
    const now = new Date();
    const updates = [];

    if (trackingState === 'completed' || trackingState === 'inprogress') {
        updates.push({
            time: utils.formatTime(new Date(now - 300000)),
            message: 'Trip started',
            icon: 'play',
            color: 'green'
        });
    }

    if (trackingState === 'inprogress' || trackingState === 'arrived' || trackingState === 'enroute') {
        updates.push({
            time: utils.formatTime(new Date(now - 120000)),
            message: 'Driver arrived at pickup',
            icon: 'map-marker-alt',
            color: 'blue'
        });
    }

    if (trackingState !== 'searching') {
        updates.push({
            time: utils.formatTime(new Date(now - 180000)),
            message: 'Driver is on the way',
            icon: 'clock',
            color: 'blue'
        });

        updates.push({
            time: utils.formatTime(new Date(now - 300000)),
            message: 'Ride confirmed',
            icon: 'check',
            color: 'green'
        });
    }

    updates.push({
        time: utils.formatTime(new Date(rideData.bookingTime)),
        message: 'Finding driver...',
        icon: 'search',
        color: 'yellow'
    });

    return updates;
}

// Complete ride
function completeRide() {
    if (trackingInterval) {
        clearInterval(trackingInterval);
    }

    // Add to recent rides
    const recentRides = storage.get('recentRides') || [];
    recentRides.unshift({
        id: rideData.id,
        route: `${rideData.pickup} → ${rideData.destination}`,
        date: new Date(),
        fare: rideData.fare,
        rating: 5.0, // Default rating
        vehicleType: rideData.rideType,
        driver: rideData.driver.name
    });

    storage.set('recentRides', recentRides);

    // Clear tracking data
    storage.remove('trackingData');

    // Show completion message
    showNotification('Trip completed successfully!', 'success');

    // Redirect to review page
    setTimeout(() => {
        window.location.href = 'review.html';
    }, 2000);
}



function initializeCancelRide() {
    const cancelButton = document.getElementById('cancelRide');
    const cancelModal = document.getElementById('cancelModal');

    if (!cancelButton || !cancelModal) {
        console.error('Cancel button or modal not found!');
        return;
    }

    console.log('Setting up cancel button listeners...'); // Debug log

    cancelButton.addEventListener('click', function () {
        console.log('Cancel button clicked!'); // Debug log
        cancelModal.classList.remove('hidden');
        cancelModal.classList.add('flex');
    });

    console.log('Cancel button exists on load:', !!document.getElementById('cancelRide'));

    document.addEventListener('DOMContentLoaded', function () {
        console.log('Cancel button exists after DOMContentLoaded:', !!document.getElementById('cancelRide'));
    });

    // Set up cancel modal functions
    window.closeCancelModal = function () {
        cancelModal.classList.add('hidden');
        cancelModal.classList.remove('flex');
    };

    window.confirmCancel = function () {
        cancelRide();
    };
}

// Cancel ride
function cancelRide() {
    if (trackingInterval) {
        clearInterval(trackingInterval);
    }

    // Clear tracking data
    storage.remove('trackingData');
    storage.remove('currentBooking');

    // Show cancellation message
    showNotification('Ride cancelled successfully', 'info');

    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

// Initialize driver contact
function initializeDriverContact() {
    const callButton = document.querySelector('.call-driver');
    const messageButton = document.querySelector('.message-driver');

    if (callButton) {
        callButton.addEventListener('click', function () {
            if (rideData.driver && rideData.driver.phone) {
                window.open(`tel:${rideData.driver.phone}`);
            } else {
                showNotification('Driver contact not available', 'error');
            }
        });
    }

    if (messageButton) {
        messageButton.addEventListener('click', function () {
            if (rideData.driver && rideData.driver.phone) {
                window.open(`sms:${rideData.driver.phone}`);
            } else {
                showNotification('Driver contact not available', 'error');
            }
        });
    }
}

// Share ride location
function shareRideLocation() {
    if (navigator.share) {
        navigator.share({
            title: 'My MotorLink Ride',
            text: `I'm on a ride from ${rideData.pickup} to ${rideData.destination}`,
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const text = `I'm on a ride from ${rideData.pickup} to ${rideData.destination}. Track my ride: ${window.location.href}`;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            showNotification('Ride details copied to clipboard', 'success');
        } else {
            showNotification('Sharing not supported on this device', 'error');
        }
    }
}

// Get ride status color
function getRideStatusColor(status) {
    const colors = {
        'searching': 'yellow',
        'confirmed': 'green',
        'enroute': 'blue',
        'arrived': 'green',
        'inprogress': 'blue',
        'completed': 'green'
    };

    return colors[status] || 'gray';
}

// Emergency contact
function emergencyContact() {
    const confirmed = confirm('Are you sure you want to contact emergency services?');
    if (confirmed) {
        window.open('tel:112'); // Emergency number in Rwanda
    }
}

// Report issue
function reportIssue() {
    const issue = prompt('Please describe the issue:');
    if (issue) {
        showNotification('Issue reported successfully. Support will contact you soon.', 'success');
        // In a real app, this would send the report to the backend
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', function () {
    if (trackingInterval) {
        clearInterval(trackingInterval);
    }
});

// Expose functions for global use
window.shareRideLocation = shareRideLocation;
window.emergencyContact = emergencyContact;
window.reportIssue = reportIssue;
window.showCancelModal = showCancelModal;
window.closeCancelModal = closeCancelModal;
window.confirmCancel = confirmCancel;

// Initialize tracking when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    initializeTracking();
});

// Temporary debug code
document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('cancelRide');
    if (btn) {
        btn.addEventListener('click', function () {
            console.log('Cancel button clicked - basic listener works');
            document.getElementById('cancelModal').classList.remove('hidden');
        });
    } else {
        console.error('Cancel button not found in DOM');
    }
});