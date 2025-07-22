// Mapbox access token
const MAPBOX_TOKEN = "pk.eyJ1IjoieXZldHRlMzM0IiwiYSI6ImNtZDRnZnA3bjBkZGQyanNkY3RzcHJ1bnoifQ.FrsqTSFPnnbsWpZUE5IbBQ"
const mapboxgl = window.mapboxgl // Declare mapboxgl variable

// Set Mapbox access token
if (typeof mapboxgl !== "undefined") {
  mapboxgl.accessToken = MAPBOX_TOKEN
}

// Comprehensive Kigali locations database
const KIGALI_LOCATIONS = [
  // City Centers and Main Areas
  {
    name: "Kigali City Center",
    address: "Central Business District, Kigali",
    coordinates: [30.0588, -1.9506],
    type: "center",
  },
  {
    name: "Kigali Convention Centre",
    address: "Kimisagara, Nyarugenge, Kigali",
    coordinates: [30.0619, -1.9441],
    type: "landmark",
  },
  {
    name: "Downtown Kigali",
    address: "City Center, Nyarugenge, Kigali",
    coordinates: [30.0588, -1.9506],
    type: "center",
  },

  // Districts and Neighborhoods
  { name: "Kimisagara", address: "Kimisagara, Nyarugenge District", coordinates: [30.0606, -1.9536], type: "district" },
  { name: "Kacyiru", address: "Kacyiru, Gasabo District", coordinates: [30.0735, -1.9355], type: "district" },
  { name: "Remera", address: "Remera, Gasabo District", coordinates: [30.0758, -1.9449], type: "district" },
  { name: "Nyamirambo", address: "Nyamirambo, Nyarugenge District", coordinates: [30.0445, -1.9667], type: "district" },
  { name: "Kimihurura", address: "Kimihurura, Gasabo District", coordinates: [30.0991, -1.9302], type: "district" },
  { name: "Gikondo", address: "Gikondo, Kicukiro District", coordinates: [30.0726, -1.9884], type: "district" },
  { name: "Kicukiro Centre", address: "Kicukiro, Kicukiro District", coordinates: [30.0946, -1.9886], type: "center" },
  { name: "Kibagabaga", address: "Kibagabaga, Gasabo District", coordinates: [30.0875, -1.9156], type: "district" },
  { name: "Nyarutarama", address: "Nyarutarama, Gasabo District", coordinates: [30.1125, -1.9333], type: "district" },
  { name: "Gisozi", address: "Gisozi, Gasabo District", coordinates: [30.0833, -1.9167], type: "district" },
  { name: "Kanombe", address: "Kanombe, Kicukiro District", coordinates: [30.1167, -1.9667], type: "district" },
  { name: "Niboye", address: "Niboye, Kicukiro District", coordinates: [30.1, -1.9833], type: "district" },
  { name: "Gatenga", address: "Gatenga, Kicukiro District", coordinates: [30.0833, -2.0], type: "district" },
  { name: "Kabeza", address: "Kabeza, Kicukiro District", coordinates: [30.0917, -1.975], type: "district" },
  { name: "Kinyinya", address: "Kinyinya, Gasabo District", coordinates: [30.0917, -1.9083], type: "district" },

  // Universities and Educational Institutions
  {
    name: "University of Rwanda",
    address: "Gikondo Campus, Kicukiro",
    coordinates: [30.0726, -1.9884],
    type: "university",
  },
  {
    name: "Kigali Independent University",
    address: "Kimisagara, Nyarugenge",
    coordinates: [30.0606, -1.9536],
    type: "university",
  },
  {
    name: "Rwanda Institute of Administration and Management",
    address: "Remera, Gasabo",
    coordinates: [30.0758, -1.9449],
    type: "university",
  },
  {
    name: "Adventist University of Central and East Africa",
    address: "Nyarutarama, Gasabo",
    coordinates: [30.1125, -1.9333],
    type: "university",
  },
  { name: "University of Kigali", address: "Kicukiro District", coordinates: [30.0946, -1.9886], type: "university" },
  {
    name: "Carnegie Mellon University Rwanda",
    address: "Gikondo, Kicukiro",
    coordinates: [30.0726, -1.9884],
    type: "university",
  },
  {
    name: "Kigali Institute of Science and Technology",
    address: "Nyarugenge District",
    coordinates: [30.0588, -1.9506],
    type: "university",
  },
  {
    name: "Rwanda Tourism University College",
    address: "Nyarutarama, Gasabo",
    coordinates: [30.1125, -1.9333],
    type: "university",
  },
  {
    name: "Protestant Institute of Arts and Social Sciences",
    address: "Kimihurura, Gasabo",
    coordinates: [30.0991, -1.9302],
    type: "university",
  },
  { name: "Kigali Health Institute", address: "Remera, Gasabo", coordinates: [30.0758, -1.9449], type: "university" },

  // Hospitals and Healthcare
  {
    name: "King Faisal Hospital",
    address: "Kacyiru, Gasabo District",
    coordinates: [30.0735, -1.9355],
    type: "hospital",
  },
  {
    name: "University Teaching Hospital of Kigali",
    address: "Nyarugenge District",
    coordinates: [30.0588, -1.9506],
    type: "hospital",
  },
  { name: "Rwanda Military Hospital", address: "Kanombe, Kicukiro", coordinates: [30.1167, -1.9667], type: "hospital" },
  {
    name: "Polyclinic du Plateau",
    address: "Kimisagara, Nyarugenge",
    coordinates: [30.0606, -1.9536],
    type: "hospital",
  },
  {
    name: "Clinique La Croix du Sud",
    address: "Kimihurura, Gasabo",
    coordinates: [30.0991, -1.9302],
    type: "hospital",
  },
  { name: "Kigali Hospital", address: "Nyamirambo, Nyarugenge", coordinates: [30.0445, -1.9667], type: "hospital" },
  { name: "Polyclinique La Medicale", address: "Remera, Gasabo", coordinates: [30.0758, -1.9449], type: "hospital" },
  { name: "Rwanda Heart Foundation", address: "Gikondo, Kicukiro", coordinates: [30.0726, -1.9884], type: "hospital" },

  // Markets and Shopping
  { name: "Kimisagara Market", address: "Kimisagara, Nyarugenge", coordinates: [30.0606, -1.9536], type: "market" },
  { name: "Nyamirambo Market", address: "Nyamirambo, Nyarugenge", coordinates: [30.0445, -1.9667], type: "market" },
  { name: "Remera Market", address: "Remera, Gasabo", coordinates: [30.0758, -1.9449], type: "market" },
  { name: "Kicukiro Market", address: "Kicukiro District", coordinates: [30.0946, -1.9886], type: "market" },
  { name: "Union Trade Centre", address: "City Center, Nyarugenge", coordinates: [30.0588, -1.9506], type: "mall" },
  { name: "Kigali City Tower", address: "City Center, Nyarugenge", coordinates: [30.0588, -1.9506], type: "mall" },
  { name: "UTC Mall", address: "Nyarugenge District", coordinates: [30.0588, -1.9506], type: "mall" },
  { name: "Simba Supermarket", address: "Multiple locations", coordinates: [30.0588, -1.9506], type: "supermarket" },
  { name: "Nakumatt", address: "Union Trade Centre", coordinates: [30.0588, -1.9506], type: "supermarket" },

  // Hotels and Accommodation
  { name: "Kigali Serena Hotel", address: "City Center, Nyarugenge", coordinates: [30.0588, -1.9506], type: "hotel" },
  { name: "Radisson Blu Hotel", address: "Gasabo District", coordinates: [30.0735, -1.9355], type: "hotel" },
  { name: "Marriott Hotel Kigali", address: "Kacyiru, Gasabo", coordinates: [30.0735, -1.9355], type: "hotel" },
  {
    name: "Hotel des Mille Collines",
    address: "City Center, Nyarugenge",
    coordinates: [30.0588, -1.9506],
    type: "hotel",
  },
  { name: "Ubumwe Grande Hotel", address: "Kimihurura, Gasabo", coordinates: [30.0991, -1.9302], type: "hotel" },
  {
    name: "Heaven Restaurant & Boutique Hotel",
    address: "Kiyovu, Nyarugenge",
    coordinates: [30.0588, -1.9506],
    type: "hotel",
  },
  { name: "Golf Hills Residence", address: "Nyarutarama, Gasabo", coordinates: [30.1125, -1.9333], type: "hotel" },

  // Government and Offices
  {
    name: "Parliament of Rwanda",
    address: "Kimisagara, Nyarugenge",
    coordinates: [30.0619, -1.9441],
    type: "government",
  },
  {
    name: "Ministry of Finance",
    address: "Kimisagara, Nyarugenge",
    coordinates: [30.0606, -1.9536],
    type: "government",
  },
  { name: "Rwanda Development Board", address: "Kacyiru, Gasabo", coordinates: [30.0735, -1.9355], type: "government" },
  { name: "City Hall", address: "Nyarugenge District", coordinates: [30.0588, -1.9506], type: "government" },
  { name: "Supreme Court", address: "Kimisagara, Nyarugenge", coordinates: [30.0606, -1.9536], type: "government" },

  // Transport Hubs
  {
    name: "Kigali International Airport",
    address: "Kanombe, Bugesera",
    coordinates: [30.1391, -2.1785],
    type: "airport",
  },
  { name: "Nyabugogo Bus Station", address: "Nyarugenge District", coordinates: [30.0445, -1.9667], type: "transport" },
  {
    name: "Kimisagara Bus Station",
    address: "Kimisagara, Nyarugenge",
    coordinates: [30.0606, -1.9536],
    type: "transport",
  },
  { name: "Remera Taxi Park", address: "Remera, Gasabo", coordinates: [30.0758, -1.9449], type: "transport" },
  { name: "Kicukiro Bus Station", address: "Kicukiro District", coordinates: [30.0946, -1.9886], type: "transport" },

  // Religious Sites
  {
    name: "Kigali Central Mosque",
    address: "Nyamirambo, Nyarugenge",
    coordinates: [30.0445, -1.9667],
    type: "religious",
  },
  { name: "St. Paul Cathedral", address: "Nyamirambo, Nyarugenge", coordinates: [30.0445, -1.9667], type: "religious" },
  { name: "Regina Pacis Church", address: "Remera, Gasabo", coordinates: [30.0758, -1.9449], type: "religious" },
  { name: "Zion Temple", address: "Kimisagara, Nyarugenge", coordinates: [30.0606, -1.9536], type: "religious" },

  // Recreation and Sports
  { name: "Amahoro Stadium", address: "Remera, Gasabo", coordinates: [30.0758, -1.9449], type: "stadium" },
  { name: "Kigali Golf Club", address: "Nyarutarama, Gasabo", coordinates: [30.1125, -1.9333], type: "recreation" },
  {
    name: "Nyamirambo Regional Stadium",
    address: "Nyamirambo, Nyarugenge",
    coordinates: [30.0445, -1.9667],
    type: "stadium",
  },
  { name: "Petit Stade", address: "Remera, Gasabo", coordinates: [30.0758, -1.9449], type: "stadium" },

  // Parks and Nature
  { name: "Nyandungu Eco-Park", address: "Gasabo District", coordinates: [30.0735, -1.9355], type: "park" },
  { name: "Kigali Genocide Memorial", address: "Gisozi, Gasabo", coordinates: [30.0833, -1.9167], type: "memorial" },
  { name: "Inema Arts Center", address: "Kacyiru, Gasabo", coordinates: [30.0735, -1.9355], type: "recreation" },

  // Business Districts
  { name: "Kigali Heights", address: "Kacyiru, Gasabo", coordinates: [30.0735, -1.9355], type: "business" },
  { name: "Telecom House", address: "City Center, Nyarugenge", coordinates: [30.0588, -1.9506], type: "business" },
  { name: "Centenary House", address: "City Center, Nyarugenge", coordinates: [30.0588, -1.9506], type: "business" },

  // Additional Areas
  { name: "Kagugu", address: "Kagugu, Gasabo District", coordinates: [30.0667, -1.9], type: "district" },
  { name: "Rusororo", address: "Rusororo, Gasabo District", coordinates: [30.1, -1.8833], type: "district" },
  { name: "Masaka", address: "Masaka, Kicukiro District", coordinates: [30.1167, -2.0], type: "district" },
  { name: "Muhima", address: "Muhima, Nyarugenge District", coordinates: [30.05, -1.95], type: "district" },
  { name: "Biryogo", address: "Biryogo, Nyarugenge District", coordinates: [30.0417, -1.9583], type: "district" },
  { name: "Rugando", address: "Rugando, Gasabo District", coordinates: [30.0583, -1.925], type: "district" },
  { name: "Kimicanga", address: "Kimicanga, Gasabo District", coordinates: [30.075, -1.925], type: "district" },
]

// Global variables
let map
let userMarker
let destinationMarker
let userLocation = null
let destinationLocation = null
let watchId = null
let isTracking = false

// Initialize based on current page
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop()

  if (currentPage === "dashboard.html" || currentPage === "") {
    initializeDashboard()
  } else if (currentPage === "tracking.html") {
    initializeTracking()
  }
})

// Dashboard functionality
function initializeDashboard() {
  setupLocationSearch()
  setupCurrentLocationButton()
  setupFormSubmission()
}

// Setup location search functionality
function setupLocationSearch() {
  const pickupInput = document.getElementById("pickup")
  const destinationInput = document.getElementById("destination")

  if (pickupInput) {
    setupLocationInput(pickupInput, "pickup")
  }

  if (destinationInput) {
    setupLocationInput(destinationInput, "destination")
  }
}

// Setup individual location input with search
function setupLocationInput(input, type) {
  let timeout

  input.addEventListener("input", function () {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      if (this.value.length > 1) {
        showLocationSuggestions(this, this.value, type)
      } else {
        hideLocationSuggestions(this)
      }
    }, 300)
  })

  input.addEventListener("blur", function () {
    setTimeout(() => {
      hideLocationSuggestions(this)
    }, 200)
  })

  input.addEventListener("focus", function () {
    if (this.value.length > 1) {
      showLocationSuggestions(this, this.value, type)
    }
  })
}

// Show location suggestions
function showLocationSuggestions(input, query, type) {
  const suggestions = searchLocations(query)
  const suggestionsDiv = document.getElementById(`${type}-suggestions`)

  if (!suggestionsDiv) return

  if (suggestions.length === 0) {
    suggestionsDiv.classList.add("hidden")
    return
  }

  suggestionsDiv.innerHTML = ""
  suggestionsDiv.classList.remove("hidden")

  suggestions.forEach((location) => {
    const item = document.createElement("div")
    item.className =
      "px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center border-b border-gray-100 last:border-b-0"

    const icon = getLocationIcon(location.type)
    const typeLabel = getTypeLabel(location.type)

    item.innerHTML = `
            <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <i class="fas fa-${icon} text-blue-600 text-sm"></i>
            </div>
            <div class="flex-grow">
                <div class="font-medium text-gray-900">${highlightMatch(location.name, query)}</div>
                <div class="text-sm text-gray-500">${location.address}</div>
                <div class="text-xs text-blue-600">${typeLabel}</div>
            </div>
        `

    item.addEventListener("click", () => {
      input.value = location.name
      input.dataset.lat = location.coordinates[1]
      input.dataset.lng = location.coordinates[0]
      input.dataset.address = location.address
      hideLocationSuggestions(input)

      // Calculate distance if both locations are selected
      calculateTripInfo()
    })

    suggestionsDiv.appendChild(item)
  })
}

// Hide location suggestions
function hideLocationSuggestions(input) {
  const type = input.id
  const suggestionsDiv = document.getElementById(`${type}-suggestions`)
  if (suggestionsDiv) {
    suggestionsDiv.classList.add("hidden")
  }
}

// Search locations in database
function searchLocations(query) {
  const searchTerm = query.toLowerCase().trim()

  return KIGALI_LOCATIONS.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm) ||
      location.address.toLowerCase().includes(searchTerm) ||
      location.type.toLowerCase().includes(searchTerm),
  )
    .sort((a, b) => {
      // Prioritize exact matches
      const aExact = a.name.toLowerCase().startsWith(searchTerm) ? 1 : 0
      const bExact = b.name.toLowerCase().startsWith(searchTerm) ? 1 : 0
      return bExact - aExact
    })
    .slice(0, 8)
}

// Get location icon based on type
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
  }
  return icons[type] || "map-marker-alt"
}

// Get type label
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
  }
  return labels[type] || "Location"
}

// Highlight matching text
function highlightMatch(text, query) {
  if (!query) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  return text.replace(regex, '<span class="bg-yellow-200">$1</span>')
}

// Setup current location functionality
function setupCurrentLocationButton() {
  const currentLocBtn = document.getElementById("useCurrentLocation")
  const pickupInput = document.getElementById("pickup")

  if (currentLocBtn && pickupInput) {
    currentLocBtn.addEventListener("click", () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser")
        return
      }

      const originalHTML = currentLocBtn.innerHTML
      currentLocBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lng = position.coords.longitude
          const lat = position.coords.latitude

          // Reverse geocode to get location name
          try {
            const locationName = await reverseGeocode(lng, lat)
            pickupInput.value = locationName
            pickupInput.dataset.lat = lat
            pickupInput.dataset.lng = lng
            pickupInput.dataset.address = locationName

            calculateTripInfo()
          } catch (error) {
            pickupInput.value = `${lng.toFixed(6)}, ${lat.toFixed(6)}`
            pickupInput.dataset.lat = lat
            pickupInput.dataset.lng = lng
          }

          currentLocBtn.innerHTML = originalHTML
        },
        () => {
          alert("Unable to retrieve your location")
          currentLocBtn.innerHTML = originalHTML
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      )
    })
  }
}

// Setup form submission
function setupFormSubmission() {
  const form = document.getElementById("rideBookingForm")

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault()

      const pickupInput = document.getElementById("pickup")
      const destinationInput = document.getElementById("destination")

      let pickupCoords, destinationCoords

      // Get pickup coordinates
      if (pickupInput.dataset.lat && pickupInput.dataset.lng) {
        pickupCoords = `${pickupInput.dataset.lng},${pickupInput.dataset.lat}`
      } else {
        const coords = await geocodePlace(pickupInput.value)
        if (!coords) {
          alert("Could not find pickup location.")
          return
        }
        pickupCoords = coords.join(",")
      }

      // Get destination coordinates
      if (destinationInput.dataset.lat && destinationInput.dataset.lng) {
        destinationCoords = `${destinationInput.dataset.lng},${destinationInput.dataset.lat}`
      } else {
        const coords = await geocodePlace(destinationInput.value)
        if (!coords) {
          alert("Could not find destination.")
          return
        }
        destinationCoords = coords.join(",")
      }

      // Store additional trip data
      const tripData = {
        pickup: pickupInput.value,
        destination: destinationInput.value,
        pickupAddress: pickupInput.dataset.address || pickupInput.value,
        destinationAddress: destinationInput.dataset.address || destinationInput.value,
        rideType: document.getElementById("rideType").value,
        passengers: document.getElementById("passengers").value,
      }

      localStorage.setItem("currentTrip", JSON.stringify(tripData))

      // Redirect to tracking page
      window.location.href = `tracking.html?pickup=${encodeURIComponent(pickupCoords)}&destination=${encodeURIComponent(destinationCoords)}`
    })
  }
}

// Tracking functionality
function initializeTracking() {
  initializeTrackingMap()
  setupCancelRideModal()
  startLocationTracking()
  updateTripDetails()
  updateCurrentTime()
}

// Initialize tracking map
function initializeTrackingMap() {
  const pickup = getQueryParam("pickup")
  const destination = getQueryParam("destination")

  if (!pickup || !destination) {
    alert("Trip information is missing.")
    return
  }

  const pickupCoords = pickup.split(",").map(Number)
  const destCoords = destination.split(",").map(Number)

  // Initialize map
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: pickupCoords,
    zoom: 13,
  })

  map.on("load", () => {
    // Add markers
    new mapboxgl.Marker({ color: "green" })
      .setLngLat(pickupCoords)
      .setPopup(new mapboxgl.Popup().setText("Pickup Location"))
      .addTo(map)

    destinationMarker = new mapboxgl.Marker({ color: "red" })
      .setLngLat(destCoords)
      .setPopup(new mapboxgl.Popup().setText("Destination"))
      .addTo(map)

    // Add user location marker (will be updated with real location)
    userMarker = new mapboxgl.Marker({ color: "blue" })
      .setLngLat(pickupCoords)
      .setPopup(new mapboxgl.Popup().setText("Your Location"))
      .addTo(map)

    // Get and display route
    displayRoute(pickupCoords, destCoords)
  })
}

// Display route on map
async function displayRoute(start, end) {
  try {
    const routeData = await getRoute(start, end)

    if (routeData) {
      // Add route source and layer
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: routeData.geometry,
        },
      })

      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3887be",
          "line-width": 6,
          "line-opacity": 0.8,
        },
      })

      // Fit map to show route
      const bounds = new mapboxgl.LngLatBounds()
      bounds.extend(start)
      bounds.extend(end)
      map.fitBounds(bounds, { padding: 50 })

      // Update trip details
      const distance = (routeData.distance / 1000).toFixed(1)
      const duration = Math.round(routeData.duration / 60)
      const fare = calculateFare(routeData.distance)

      document.getElementById("tripDistance").textContent = `${distance} km`
      document.getElementById("eta").textContent = `${duration} min`
      document.getElementById("fareAmount").textContent = `RWF ${fare.toLocaleString()}`
    }
  } catch (error) {
    console.error("Error displaying route:", error)
  }
}

// Start real-time location tracking
function startLocationTracking() {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported")
    return
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  }

  // Start watching position
  watchId = navigator.geolocation.watchPosition(updateUserLocation, handleLocationError, options)

  isTracking = true
  document.getElementById("rideStatus").textContent = "Tracking Active"
}

// Update user location on map and UI
function updateUserLocation(position) {
  const lat = position.coords.latitude
  const lng = position.coords.longitude
  const speed = position.coords.speed || 0

  userLocation = [lng, lat]

  // Update marker position
  if (userMarker) {
    userMarker.setLngLat(userLocation)
  }

  // Update UI with current location
  document.getElementById("currentLat").textContent = lat.toFixed(6)
  document.getElementById("currentLng").textContent = lng.toFixed(6)
  document.getElementById("currentSpeed").textContent = `${Math.round(speed * 3.6)} km/h` // Convert m/s to km/h
  document.getElementById("lastUpdated").textContent = new Date().toLocaleTimeString()

  // Add live update
  addLiveUpdate("Location updated", "Your position has been updated")

  // Recalculate ETA if we have destination
  if (destinationLocation) {
    updateETA()
  }
}

// Handle location errors
function handleLocationError(error) {
  console.error("Location error:", error)
  let message = "Location tracking error"

  switch (error.code) {
    case error.PERMISSION_DENIED:
      message = "Location access denied"
      break
    case error.POSITION_UNAVAILABLE:
      message = "Location unavailable"
      break
    case error.TIMEOUT:
      message = "Location timeout"
      break
  }

  addLiveUpdate("Tracking Issue", message)
}

// Update ETA based on current location
async function updateETA() {
  if (!userLocation || !destinationLocation) return

  try {
    const routeData = await getRoute(userLocation, destinationLocation)
    if (routeData) {
      const duration = Math.round(routeData.duration / 60)
      document.getElementById("eta").textContent = `${duration} min`
    }
  } catch (error) {
    console.error("Error updating ETA:", error)
  }
}

// Add live update to the updates section
function addLiveUpdate(title, message) {
  const updatesContainer = document.getElementById("liveUpdates")
  if (!updatesContainer) return

  const updateDiv = document.createElement("div")
  updateDiv.className = "flex items-start space-x-3"
  updateDiv.innerHTML = `
        <div class="bg-blue-100 p-2 rounded-full">
            <i class="fas fa-info text-blue-600"></i>
        </div>
        <div>
            <p class="text-sm text-gray-600">${new Date().toLocaleTimeString()}</p>
            <p class="font-medium text-gray-900">${title}</p>
            <p class="text-sm text-gray-500">${message}</p>
        </div>
    `

  // Add to top of updates
  updatesContainer.insertBefore(updateDiv, updatesContainer.firstChild)

  // Keep only last 5 updates
  while (updatesContainer.children.length > 5) {
    updatesContainer.removeChild(updatesContainer.lastChild)
  }
}

// Update trip details from stored data
function updateTripDetails() {
  const tripData = JSON.parse(localStorage.getItem("currentTrip") || "{}")

  if (tripData.pickup) {
    document.getElementById("pickupLocation").textContent = tripData.pickupAddress || tripData.pickup
  }

  if (tripData.destination) {
    document.getElementById("destinationLocation").textContent = tripData.destinationAddress || tripData.destination
    destinationLocation = getQueryParam("destination").split(",").map(Number)
  }

  if (tripData.rideType) {
    document.getElementById("rideTypeDisplay").textContent = capitalizeFirst(tripData.rideType)
  }
}

// Initialize cancel ride functionality
function setupCancelRideModal() {
  const cancelBtn = document.getElementById("cancelRide")

  if (cancelBtn) {
    cancelBtn.addEventListener("click", showCancelModal)
  }
}

// Show cancel modal
function showCancelModal() {
  const modal = document.getElementById("cancelModal")
  if (modal) {
    modal.classList.remove("hidden")
    modal.classList.add("flex")
  }
}

// Close cancel modal
function closeCancelModal() {
  const modal = document.getElementById("cancelModal")
  if (modal) {
    modal.classList.add("hidden")
    modal.classList.remove("flex")
  }
}

// Confirm ride cancellation
function confirmCancel() {
  // Stop location tracking
  if (watchId) {
    navigator.geolocation.clearWatch(watchId)
    watchId = null
    isTracking = false
  }

  // Clear stored trip data
  localStorage.removeItem("currentTrip")

  // Show confirmation and redirect
  alert("Ride cancelled successfully")
  window.location.href = "dashboard.html"
}

// Update current time
function updateCurrentTime() {
  const timeElement = document.getElementById("currentTime")
  if (timeElement) {
    timeElement.textContent = new Date().toLocaleTimeString()
    setInterval(() => {
      timeElement.textContent = new Date().toLocaleTimeString()
    }, 1000)
  }
}

// Utility functions
async function geocodePlace(place) {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(place)}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=RW`
    const response = await fetch(url)
    const data = await response.json()

    if (data.features && data.features[0]) {
      return data.features[0].center // [lng, lat]
    }

    return null
  } catch (error) {
    return null
  }
}

async function getRoute(start, end) {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
    const response = await fetch(url)
    const data = await response.json()

    if (data.routes && data.routes[0]) {
      return data.routes[0]
    }

    return null
  } catch (error) {
    console.error("Error fetching route:", error)
    return null
  }
}

function calculateFare(distanceMeters) {
  const distanceKm = distanceMeters / 1000
  const baseFare = 1500 // Base fare in RWF
  const perKmRate = 400 // Rate per km in RWF

  return Math.round(baseFare + distanceKm * perKmRate)
}

function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(name)
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function calculateTripInfo() {
  const pickupInput = document.getElementById("pickup")
  const destinationInput = document.getElementById("destination")
  const tripInfo = document.getElementById("tripInfo")

  if (!pickupInput.dataset.lat || !destinationInput.dataset.lat) return

  const pickupCoords = [Number.parseFloat(pickupInput.dataset.lng), Number.parseFloat(pickupInput.dataset.lat)]
  const destCoords = [Number.parseFloat(destinationInput.dataset.lng), Number.parseFloat(destinationInput.dataset.lat)]

  try {
    // Calculate distance and route
    const routeData = getRoute(pickupCoords, destCoords)

    if (routeData) {
      const distance = (routeData.distance / 1000).toFixed(1) // Convert to km
      const duration = Math.round(routeData.duration / 60) // Convert to minutes
      const fare = calculateFare(routeData.distance)

      // Update UI
      document.getElementById("tripDistance").textContent = `${distance} km`
      document.getElementById("tripDuration").textContent = `${duration} min`
      document.getElementById("estimatedPrice").textContent = `RWF ${fare.toLocaleString()}`
      document.getElementById("estimatedETA").textContent = `${duration} min`

      if (tripInfo) {
        tripInfo.classList.remove("hidden")
      }
    }
  } catch (error) {
    console.error("Error calculating trip info:", error)
  }
}

// Cleanup function for when leaving the page
window.addEventListener("beforeunload", () => {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId)
  }
})

// Make functions globally available for HTML onclick handlers
window.showCancelModal = showCancelModal
window.closeCancelModal = closeCancelModal
window.confirmCancel = confirmCancel

// Declare reverseGeocode function
async function reverseGeocode(lng, lat) {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=place`
    const response = await fetch(url)
    const data = await response.json()

    if (data.features && data.features[0]) {
      return data.features[0].place_name
    }

    return null
  } catch (error) {
    return null
  }
}
