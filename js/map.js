
mapboxgl.accessToken = "pk.eyJ1IjoieXZldHRlMzM0IiwiYSI6ImNtZDRnZnA3bjBkZGQyanNkY3RzcHJ1bnoifQ.FrsqTSFPnnbsWpZUE5IbBQ"

// Kigali locations
const KIGALI_LOCATIONS = [
  { name: "Kigali Convention Centre", coordinates: [30.0619, -1.9441] },
  { name: "Kigali International Airport", coordinates: [30.1391, -2.1785] },
  { name: "Kimisagara Market", coordinates: [30.0606, -1.9536] },
  { name: "Kacyiru", coordinates: [30.0735, -1.9355] },
  { name: "Remera", coordinates: [30.0758, -1.9449] },
  { name: "Nyamirambo", coordinates: [30.0445, -1.9667] },
  { name: "Kimihurura", coordinates: [30.0991, -1.9302] },
  { name: "Gikondo", coordinates: [30.0726, -1.9884] },
  { name: "Kicukiro Centre", coordinates: [30.0946, -1.9886] },
  { name: "Kibagabaga", coordinates: [30.0875, -1.9156] },
  { name: "Nyabugogo", coordinates: [30.0434, -1.9378] },
  { name: "Kigali City Tower", coordinates: [30.0588, -1.9506] },
  { name: "Kigali City Center", coordinates: [30.0588, -1.9506] },
  { name: "Kigali City Centre", coordinates: [30.0588, -1.9506] },
]

// Kigali center coordinates
const kigaliCenter = [30.0619, -1.9441]

let map
let userMarker
let destinationMarker
let userLocation = null
let destinationLocation = null

// Initialize map when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("map")) {
    initializeMap()
  }
})

// Initialize map
function initializeMap() {
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: kigaliCenter,
    zoom: 13,
  })

  // Add zoom and rotation controls
  map.addControl(new mapboxgl.NavigationControl())

  // Add geolocate control to track user location
  const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
    showUserHeading: true,
  })
  map.addControl(geolocate)

  // When the map loads, get destination from URL and setup
  map.on("load", () => {
    setupMapSources()

    // Get destination from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const destinationName = urlParams.get("destination") || "Kigali City Center"

    // Set destination location
    setDestinationLocation(destinationName)

    // Trigger geolocation
    geolocate.trigger()
  })

  // Listen for geolocate events
  geolocate.on("geolocate", (e) => {
    userLocation = [e.coords.longitude, e.coords.latitude]

    // Add user marker if it doesn't exist
    if (!userMarker) {
      userMarker = new mapboxgl.Marker({ color: "blue" })
        .setLngLat(userLocation)
        .setPopup(new mapboxgl.Popup().setText("Your Location"))
        .addTo(map)
    } else {
      userMarker.setLngLat(userLocation)
    }

    // Update route if we have both user and destination
    if (destinationLocation) {
      updateRoute(userLocation, destinationLocation)
    }
  })
}

// Set destination location based on name from dashboard
function setDestinationLocation(destinationName) {
  // First try to find in our Kigali locations
  const location = KIGALI_LOCATIONS.find(
    (loc) =>
      loc.name.toLowerCase().includes(destinationName.toLowerCase()) ||
      destinationName.toLowerCase().includes(loc.name.toLowerCase()),
  )

  if (location) {
    destinationLocation = location.coordinates
    createDestinationMarker()
  } else {
    // Use Mapbox Geocoding for locations not in our list
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destinationName + ", Kigali, Rwanda")}.json?access_token=${mapboxgl.accessToken}&bbox=29.8,-2.2,30.3,-1.7&limit=1`

    fetch(geocodeUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          destinationLocation = data.features[0].center
          createDestinationMarker()
        } else {
          // Default to Kigali City Center if not found
          destinationLocation = [30.0588, -1.9506]
          createDestinationMarker()
        }
      })
      .catch((error) => {
        console.error("Geocoding error:", error)
        // Default to Kigali City Center
        destinationLocation = [30.0588, -1.9506]
        createDestinationMarker()
      })
  }
}

// Create destination marker
function createDestinationMarker() {
  if (!destinationLocation) return

  // Remove existing destination marker
  if (destinationMarker) {
    destinationMarker.remove()
  }

  // Create destination marker (red)
  destinationMarker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(destinationLocation)
    .setPopup(new mapboxgl.Popup().setText("Destination"))
    .addTo(map)

  // Update route if we have user location
  if (userLocation) {
    updateRoute(userLocation, destinationLocation)
  }

  // Fit map to show both markers
  fitMapToMarkers()
}

// Setup map sources for routes
function setupMapSources() {
  // Add route source
  map.addSource("route", {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [],
      },
    },
  })

  // Add route layer
  map.addLayer({
    id: "route",
    type: "line",
    source: "route",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#3B82F6",
      "line-width": 5,
      "line-opacity": 0.75,
    },
  })
}

// Update route between user location and destination
async function updateRoute(start, end) {
  if (!start || !end) return

  try {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: "GET" },
    )

    const json = await query.json()

    if (json.routes && json.routes.length > 0) {
      const data = json.routes[0]
      const route = data.geometry.coordinates

      // Update the route source
      map.getSource("route").setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: route,
        },
      })

      // Update trip info in UI
      const distance = (data.distance / 1000).toFixed(1) + " km"
      const duration = Math.round(data.duration / 60) + " min"
      updateTripInfo(distance, duration)

      // Fit map to show the route
      const bounds = new mapboxgl.LngLatBounds()
      route.forEach((coord) => bounds.extend(coord))
      map.fitBounds(bounds, { padding: 50 })
    }
  } catch (error) {
    console.error("Error getting route:", error)
  }
}

// Update trip information in UI
function updateTripInfo(distance, duration) {
  const distanceElement = document.querySelector(".trip-distance")
  const etaElement = document.getElementById("eta")

  if (distanceElement) distanceElement.textContent = distance
  if (etaElement) etaElement.textContent = duration
}

// Fit map to show user and destination markers
function fitMapToMarkers() {
  if (!userLocation && !destinationLocation) return

  const bounds = new mapboxgl.LngLatBounds()

  if (userLocation) bounds.extend(userLocation)
  if (destinationLocation) bounds.extend(destinationLocation)

  map.fitBounds(bounds, {
    padding: 50,
    maxZoom: 15,
  })
}

// Get user's current location
function getCurrentUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve([position.coords.longitude, position.coords.latitude])
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  })
}

// Expose functions globally
window.updateDestination = setDestinationLocation
window.getCurrentUserLocation = getCurrentUserLocation
