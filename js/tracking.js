// Tracking JavaScript for MotorLink
// Handles real-time ride tracking and updates

document.addEventListener('DOMContentLoaded', function() {
    initializeTracking();
});

// Global tracking variables
let trackingInterval;
let rideData = {};
let trackingState = 'searching'; // searching, confirmed, enroute, arrived, inprogress, completed

function initializeTracking() {
    // Check if user is logged in
    if (!checkAuthStatus()) {
        return;
    }
    
    loadRideData();
    initializeTrackingUI();
    startTracking();
    initializeCancelRide();
    initializeDriverContact();
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

// Load ride data
function loadRideData() {
    // Get ride data from storage or URL parameters
    const currentBooking = storage.get('currentBooking');
    const trackingData = storage.get('trackingData');
    
    if (trackingData) {
        rideData = trackingData;
    } else if (currentBooking) {
        // Create mock ride data from booking
        rideData = {
            id: utils.generateId(),
            pickup: currentBooking.pickup || 'Kimisagara',
            destination: currentBooking.destination || 'Kigali City',
            rideType: currentBooking.rideType || 'motorbike',
            fare: calculateFare(currentBooking),
            driver: {
                name: 'Jean-Claude Uwimana',
                phone: '+250 788 123 456',
                rating: 4.8,
                reviews: 127,
                vehicle: {
                    type: 'Honda CB125',
                    plate: 'RAD 123A',
                    color: 'Blue'
                },
                photo: 'https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=JD'
            },
            bookingTime: new Date().toISOString(),
            estimatedArrival: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
            status: 'confirmed'
        };
        
        storage.set('trackingData', rideData);
    }
    
    updateTrackingUI();
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
    updateMap();
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

// Update trip details
function updateTripDetails() {
    const elements = {
        pickup: document.querySelector('.trip-pickup'),
        destination: document.querySelector('.trip-destination'),
        fare: document.querySelector('.trip-fare'),
        distance: document.querySelector('.trip-distance')
    };
    
    if (elements.pickup) elements.pickup.textContent = rideData.pickup;
    if (elements.destination) elements.destination.textContent = rideData.destination;
    if (elements.fare) elements.fare.textContent = utils.formatCurrency(rideData.fare);
    if (elements.distance) elements.distance.textContent = '2.3 km'; // Mock distance
}

// Update map (mock implementation)
function updateMap() {
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) return;
    
    // In a real implementation, this would integrate with a mapping service
    // For now, we'll update the mock indicators
    updateMapIndicators();
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
    
    if (elapsed < 30) {
        trackingState = 'searching';
    } else if (elapsed < 60) {
        trackingState = 'confirmed';
    } else if (elapsed < 180) {
        trackingState = 'enroute';
    } else if (elapsed < 210) {
        trackingState = 'arrived';
    } else if (elapsed < 600) {
        trackingState = 'inprogress';
    } else {
        trackingState = 'completed';
        completeRide();
    }
}

// Update live updates
function updateLiveUpdates() {
    const updatesContainer = document.getElementById('liveUpdates');
    if (!updatesContainer) return;
    
    const updates = getLiveUpdates();
    
    updatesContainer.innerHTML = updates.map(update => `
        <div class="flex items-start space-x-3">
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

// Initialize cancel ride functionality
function initializeCancelRide() {
    const cancelButton = document.getElementById('cancelRide');
    const cancelModal = document.getElementById('cancelModal');
    
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            if (cancelModal) {
                cancelModal.classList.remove('hidden');
                cancelModal.classList.add('flex');
            }
        });
    }
    
    // Set up cancel modal functions
    window.closeCancelModal = function() {
        if (cancelModal) {
            cancelModal.classList.add('hidden');
            cancelModal.classList.remove('flex');
        }
    };
    
    window.confirmCancel = function() {
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
        callButton.addEventListener('click', function() {
            if (rideData.driver && rideData.driver.phone) {
                window.open(`tel:${rideData.driver.phone}`);
            } else {
                showNotification('Driver contact not available', 'error');
            }
        });
    }
    
    if (messageButton) {
        messageButton.addEventListener('click', function() {
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
window.addEventListener('beforeunload', function() {
    if (trackingInterval) {
        clearInterval(trackingInterval);
    }
});

// Expose functions for global use
window.shareRideLocation = shareRideLocation;
window.emergencyContact = emergencyContact;
window.reportIssue = reportIssue;
window.closeCancelModal = closeCancelModal;
window.confirmCancel = confirmCancel;
