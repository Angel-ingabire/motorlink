// Global variables
let map = null;
let userMarker;
let destinationMarker;
let routeLayer;
let userLocation = null;
let destinationLocation = null;
let watchId = null;
let isTracking = false;

// Initialize based on current page
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();

  if (currentPage === "dashboard.html" || currentPage === "") {
    initializeDashboard();
  } else if (currentPage === "tracking.html") {
    initializeTracking();
  }
});

function initializeTracking() {
  initializeTrackingMap();
  setupCancelRideModal();
  startLocationTracking();
  updateTripDetails();
  updateCurrentTime();
}


function initializeTrackingMap() {
  if (!rideData.pickup?.coordinates || !rideData.destination?.coordinates) {
    console.warn('Missing coordinates - using default view');
    rideData.pickup = rideData.pickup || {};
    rideData.destination = rideData.destination || {};
    rideData.pickup.coordinates = rideData.pickup.coordinates || [-1.9441, 30.0619]; // Default Kigali coords
    rideData.destination.coordinates = rideData.destination.coordinates || [-1.9403, 30.0654]; // Nearby point
  }

  const mapContainer = document.getElementById('mapContainer');
  if (!mapContainer || mapContainer.offsetParent === null) {
    console.error('Map container not found or not visible');
    return;
  }

  if (map && typeof map.remove === 'function') {
    map.remove();
  }

  map = L.map('map').setView([-1.9441, 30.0619], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const pickupCoords = [rideData.pickup.lat, rideData.pickup.lng];
  const destinationCoords = [rideData.destination.lat, rideData.destination.lng];

  if (pickupCoords) {
    L.marker(pickupCoords).addTo(map).bindPopup('Pickup Location');
  }

  if (destCoords) {
    L.marker(destCoords).addTo(map).bindPopup('Destination');
  }

  if (pickupCoords && destCoords) {
    map.fitBounds([pickupCoords, destCoords], { padding: [50, 50] });
  }
}

// Dashboard functionality
function initializeDashboard() {
  setupLocationSearch();
  setupCurrentLocationButton();
  setupFormSubmission();
}

// Setup location search functionality
function setupLocationSearch() {
  const pickupInput = document.getElementById("pickup");
  const destinationInput = document.getElementById("destination");

  if (pickupInput) {
    setupLocationInput(pickupInput, "pickup");
  }

  if (destinationInput) {
    setupLocationInput(destinationInput, "destination");
  }
}

// Setup individual location input with search
function setupLocationInput(input, type) {
  let timeout;

  input.addEventListener("input", function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (this.value.length > 1) {
        showLocationSuggestions(this, this.value, type);
      } else {
        hideLocationSuggestions(this);
      }
    }, 300);
  });

  input.addEventListener("blur", function () {
    setTimeout(() => {
      hideLocationSuggestions(this);
      // Auto-capitalize on blur
      this.value = smartCapitalize(this.value);
    }, 200);
  });

  input.addEventListener("focus", function () {
    if (this.value.length > 1) {
      showLocationSuggestions(this, this.value, type);
    }
  });
}

// Show location suggestions
function showLocationSuggestions(input, query, type) {
  const suggestions = searchLocations(query);
  const suggestionsDiv = document.getElementById(`${type}-suggestions`);

  if (!suggestionsDiv) return;

  if (suggestions.length === 0) {
    suggestionsDiv.classList.add("hidden");
    return;
  }

  suggestionsDiv.innerHTML = "";
  suggestionsDiv.classList.remove("hidden");

  suggestions.forEach((location) => {
    const item = document.createElement("div");
    item.className =
      "px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center border-b border-gray-100 last:border-b-0";

    const icon = getLocationIcon(location.type);
    const typeLabel = getTypeLabel(location.type);

    item.innerHTML = `
            <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <i class="fas fa-${icon} text-blue-600 text-sm"></i>
            </div>
            <div class="flex-grow">
                <div class="font-medium text-gray-900">${highlightMatch(location.name, query)}</div>
                <div class="text-sm text-gray-500">${location.address}</div>
                <div class="text-xs text-blue-600">${typeLabel}</div>
            </div>
        `;

    item.addEventListener("click", () => {
      input.value = location.name;
      input.value = smartCapitalize(location.name);
      input.dataset.lat = location.coordinates[1];
      input.dataset.lng = location.coordinates[0];
      input.dataset.address = location.address;
      hideLocationSuggestions(input);

      // Calculate distance if both locations are selected
      calculateTripInfo();
    });

    suggestionsDiv.appendChild(item);
  });
}

// Hide location suggestions
function hideLocationSuggestions(input) {
  const type = input.id;
  const suggestionsDiv = document.getElementById(`${type}-suggestions`);
  if (suggestionsDiv) {
    suggestionsDiv.classList.add("hidden");
  }
}

// Search locations in database (same as before)
function searchLocations(query) {
  const searchTerm = query.toLowerCase().trim();

  return KIGALI_LOCATIONS.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm) ||
      location.address.toLowerCase().includes(searchTerm) ||
      location.type.toLowerCase().includes(searchTerm),
  )
    .sort((a, b) => {
      // Prioritize exact matches
      const aExact = a.name.toLowerCase().startsWith(searchTerm) ? 1 : 0;
      const bExact = b.name.toLowerCase().startsWith(searchTerm) ? 1 : 0;
      return bExact - aExact;
    })
    .slice(0, 8);
}

// Get location icon based on type (same as before)
function getLocationIcon(type) {
  const icons = {
    center: "city",
    landmark: "landmark",
    district: "map-marker-alt",
    university: "graduation-cap",
    hospital: "hospital",
    market: "store",
    mall: "shopping-bag",
    supermarket: "shopping-cart",
    hotel: "bed",
    government: "building",
    airport: "plane",
    transport: "bus",
    religious: "place-of-worship",
    stadium: "futbol",
    recreation: "tree",
    park: "leaf",
    memorial: "monument",
    business: "building",
  };
  return icons[type] || "map-marker-alt";
}

// Get type label (same as before)
function getTypeLabel(type) {
  const labels = {
    center: "City Center",
    landmark: "Landmark",
    district: "District",
    university: "University",
    hospital: "Hospital",
    market: "Market",
    mall: "Shopping Mall",
    supermarket: "Supermarket",
    hotel: "Hotel",
    government: "Government",
    airport: "Airport",
    transport: "Transport Hub",
    religious: "Religious Site",
    stadium: "Stadium",
    recreation: "Recreation",
    park: "Park",
    memorial: "Memorial",
    business: "Business",
  };
  return labels[type] || "Location";
}

// Highlight matching text (same as before)
function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(regex, '<span class="bg-yellow-200">$1</span>');
}

// Setup current location functionality
function setupCurrentLocationButton() {
  const currentLocBtn = document.getElementById("useCurrentLocation");
  const pickupInput = document.getElementById("pickup");

  if (currentLocBtn && pickupInput) {
    currentLocBtn.addEventListener("click", () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
      }

      const originalHTML = currentLocBtn.innerHTML;
      currentLocBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lng = position.coords.longitude;
          const lat = position.coords.latitude;

          // Reverse geocode to get location name
          try {
            let locationName = await reverseGeocode(lat, lng);
            // Fallback if reverse geocode fails
            if (!locationName || locationName === "Nearby location") {
              locationName = "Current Location";
            }
            pickupInput.value = smartCapitalize(locationName);
            pickupInput.dataset.lat = lat;
            pickupInput.dataset.lng = lng;
            pickupInput.dataset.address = locationName;

            calculateTripInfo();
          } catch (error) {
            pickupInput.value = "Current Location";
            pickupInput.dataset.lat = lat;
            pickupInput.dataset.lng = lng;
            pickupInput.dataset.address = "Current Location";
          }

          currentLocBtn.innerHTML = originalHTML;
        },
        () => {
          alert("Unable to retrieve your location");
          currentLocBtn.innerHTML = originalHTML;
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      );
    });
  }
}

// Setup form submission
function setupFormSubmission() {
  const form = document.getElementById("rideBookingForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const pickupInput = document.getElementById("pickup");
      const destinationInput = document.getElementById("destination");

      let pickupCoords, destinationCoords;

      // Get pickup coordinates
      if (pickupInput.dataset.lat && pickupInput.dataset.lng) {
        pickupCoords = `${pickupInput.dataset.lng},${pickupInput.dataset.lat}`;
      } else {
        const coords = await geocodePlace(pickupInput.value);
        if (!coords) {
          alert("Could not find pickup location.");
          return;
        }
        pickupCoords = coords.join(",");
      }

      // Get destination coordinates
      if (destinationInput.dataset.lat && destinationInput.dataset.lng) {
        destinationCoords = `${destinationInput.dataset.lng},${destinationInput.dataset.lat}`;
      } else {
        const coords = await geocodePlace(destinationInput.value);
        if (!coords) {
          alert("Could not find destination.");
          return;
        }
        destinationCoords = coords.join(",");
      }

      // Store additional trip data
      const tripData = {
        pickup: pickupInput.value,
        destination: destinationInput.value,
        pickupAddress: pickupInput.dataset.address || pickupInput.value,
        destinationAddress: destinationInput.dataset.address || destinationInput.value,
        rideType: document.getElementById("rideType").value,
        passengers: document.getElementById("passengers").value,
      };

      localStorage.setItem("currentTrip", JSON.stringify(tripData));

      // Redirect to tracking page
      window.location.href = `tracking.html?pickup=${encodeURIComponent(pickupCoords)}&destination=${encodeURIComponent(destinationCoords)}`;
    });
  }
}

// Display route on map using OSRM
async function displayRoute(start, end) {
  try {
    const routeData = await getRoute(start, end);

    if (routeData) {
      // Remove existing route if any
      if (routeLayer) {
        map.removeLayer(routeLayer);
      }

      // Add new route
      routeLayer = L.geoJSON(routeData, {
        style: {
          color: "#3b82f6",
          weight: 6,
          opacity: 0.8,
        },
      }).addTo(map);

      // Fit map to show route
      const bounds = L.latLngBounds(start, end);
      map.fitBounds(bounds, { padding: [50, 50] });

      // Update trip details
      const distance = (routeData.properties.distance / 1000).toFixed(1);
      const duration = Math.round(routeData.properties.duration / 60);

      document.getElementById("tripDistance").textContent = `${distance} km`;
      document.getElementById("eta").textContent = `${duration} min`;
    }
  } catch (error) {
    console.error("Error displaying route:", error);
  }
}

// Start real-time location tracking (same as before)
function startLocationTracking() {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported");
    return;
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  // Start watching position
  watchId = navigator.geolocation.watchPosition(updateUserLocation, handleLocationError, options);

  isTracking = true;
  document.getElementById("rideStatus").textContent = "Tracking Active";
}

function updateUserLocation(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const speed = position.coords.speed || 0;

  userLocation = [lat, lng];

  // Update marker position
  if (userMarker) {
    userMarker.setLatLng(userLocation);
  }

  // Safely update UI elements if they exist
  const updateIfExists = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  updateIfExists("currentLat", lat.toFixed(6));
  updateIfExists("currentLng", lng.toFixed(6));
  updateIfExists("currentSpeed", `${Math.round(speed * 3.6)} km/h`);
  updateIfExists("lastUpdated", new Date().toLocaleTimeString());

  // Add live update
  addLiveUpdate("Location updated", "Your position has been updated");

  // Recalculate ETA if we have destination
  if (destinationLocation) {
    updateETA();
  }
}

// Handle location errors (same as before)
function handleLocationError(error) {
  console.error("Location error:", error);
  userLocation = [-1.9577, 30.1127]; // fallback to Kigali center

  if (!map) {
    map = L.map("map").setView(userLocation, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  }
}


// Update ETA based on current location
async function updateETA() {
  if (!userLocation || !destinationLocation) return;

  try {
    const routeData = await getRoute(userLocation, destinationLocation);
    if (routeData) {
      const duration = Math.round(routeData.properties.duration / 60);
      document.getElementById("eta").textContent = `${duration} min`;
    }
  } catch (error) {
    console.error("Error updating ETA:", error);
  }
}

// Add live update to the updates section (same as before)
function addLiveUpdate(title, message) {
  const updatesContainer = document.getElementById("liveUpdates");
  if (!updatesContainer) return;

  const updateDiv = document.createElement("div");
  updateDiv.className = "flex items-start space-x-3";
  updateDiv.innerHTML = `
        <div class="bg-blue-100 p-2 rounded-full">
            <i class="fas fa-info text-blue-600"></i>
        </div>
        <div>
            <p class="text-sm text-gray-600">${new Date().toLocaleTimeString()}</p>
            <p class="font-medium text-gray-900">${title}</p>
            <p class="text-sm text-gray-500">${message}</p>
        </div>
    `;

  // Add to top of updates
  updatesContainer.insertBefore(updateDiv, updatesContainer.firstChild);

  // Keep only last 5 updates
  while (updatesContainer.children.length > 5) {
    updatesContainer.removeChild(updatesContainer.lastChild);
  }
}

// Initialize cancel ride functionality (same as before)
function setupCancelRideModal() {
  const cancelBtn = document.getElementById("cancelRide");

  if (cancelBtn) {
    cancelBtn.addEventListener("click", showCancelModal);
  }
}

// Show cancel modal (same as before)
function showCancelModal() {
  const modal = document.getElementById("cancelModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

// Close cancel modal (same as before)
function closeCancelModal() {
  const modal = document.getElementById("cancelModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

// Confirm ride cancellation (same as before)
function confirmCancel() {
  // Stop location tracking
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    isTracking = false;
  }

  // Clear stored trip data
  localStorage.removeItem("currentTrip");

  // Show confirmation and redirect
  alert("Ride cancelled successfully");
  window.location.href = "dashboard.html";
}

// Update current time (same as before)
function updateCurrentTime() {
  const timeElement = document.getElementById("currentTime");
  if (timeElement) {
    timeElement.textContent = new Date().toLocaleTimeString();
    setInterval(() => {
      timeElement.textContent = new Date().toLocaleTimeString();
    }, 1000);
  }
}

// Utility functions
async function geocodePlace(place) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&countrycodes=RW&limit=1`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data[0]) {
      return [parseFloat(data[0].lon), parseFloat(data[0].lat)]; // [lng, lat]
    }

    return null;
  } catch (error) {
    return null;
  }
}

async function getRoute(start, end) {
  try {
    // OSRM route service (using demo server)
    const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.routes && data.routes[0]) {
      return {
        type: "Feature",
        properties: {
          distance: data.routes[0].distance,
          duration: data.routes[0].duration,
        },
        geometry: data.routes[0].geometry,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching route:", error);
    return null;
  }
}

function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
// Capitalize the first letter of each word even after space
function smartCapitalize(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

function calculateTripInfo() {
  const pickupInput = document.getElementById("pickup");
  const destinationInput = document.getElementById("destination");
  const tripInfo = document.getElementById("tripInfo");

  if (!pickupInput.dataset.lat || !destinationInput.dataset.lat) return;

  const pickupCoords = [Number.parseFloat(pickupInput.dataset.lat), Number.parseFloat(pickupInput.dataset.lng)]; // [lat, lng]
  const destCoords = [Number.parseFloat(destinationInput.dataset.lat), Number.parseFloat(destinationInput.dataset.lng)];

  try {
    // Calculate distance and route
    const routeData = getRoute(pickupCoords, destCoords);

    if (routeData) {
      const distance = (routeData.properties.distance / 1000).toFixed(1); // Convert to km
      const duration = Math.round(routeData.properties.duration / 60); // Convert to minutes

      // Update UI
      document.getElementById("tripDistance").textContent = `${distance} km`;
      document.getElementById("tripDuration").textContent = `${duration} min`;
      document.getElementById("estimatedETA").textContent = `${duration} min`;

      if (tripInfo) {
        tripInfo.classList.remove("hidden");
      }
    }
  } catch (error) {
    console.error("Error calculating trip info:", error);
  }
}

// Cleanup function for when leaving the page
window.addEventListener("beforeunload", () => {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
  }
});

// Make functions globally available for HTML onclick handlers
window.showCancelModal = showCancelModal;
window.closeCancelModal = closeCancelModal;
window.confirmCancel = confirmCancel;

// Reverse geocode using Nominatim
async function reverseGeocode(lng, lat) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.address) {
      // Construct a readable address
      const addressParts = [];
      if (data.address.road) addressParts.push(data.address.road);
      if (data.address.suburb) addressParts.push(data.address.suburb);
      if (data.address.city_district) addressParts.push(data.address.city_district);
      if (data.address.city) addressParts.push(data.address.city);

      return addressParts.join(", ") || "Nearby location";
    }

    return null;
  } catch (error) {
    return null;
  }
}