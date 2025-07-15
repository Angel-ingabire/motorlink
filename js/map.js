        mapboxgl.accessToken = 'pk.eyJ1IjoieXZldHRlMzM0IiwiYSI6ImNtZDRnZnA3bjBkZGQyanNkY3RzcHJ1bnoifQ.FrsqTSFPnnbsWpZUE5IbBQ';

        // Kigali coordinates
        const kigaliCenter = [30.0606, -1.9441];

        // Destination
        const destination = [30.0606, -1.9441];

        // Initialize map
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: kigaliCenter,
            zoom: 13
        });

        // Add zoom and rotation controls
        map.addControl(new mapboxgl.NavigationControl());

        // Add geolocate control to track user location
        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
        });
        map.addControl(geolocate);

        // Add destination marker (draggable)
        const destinationMarker = new mapboxgl.Marker({ color: 'red', draggable: true })
            .setLngLat(destination)
            .setPopup(new mapboxgl.Popup().setText('Destination: Kigali City Center'))
            .addTo(map);

        // When the map loads, trigger geolocation
        map.on('load', () => {
            geolocate.trigger();
        });

        // Example: Listen for geolocate events
        geolocate.on('geolocate', function(e) {
            const userLocation = [e.coords.longitude, e.coords.latitude];
        });
        map.on('load', () => {
            updateDriverLocations();
            setInterval(updateDriverLocations, 5000);
        });
