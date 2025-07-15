#MOTORLINK#
#First for the front-end of motor-link we have the following file system structure#
# MotorLink Codebase Architecture & Backend Integration Guide

## Frontend Architecture Overview

### File Structure & Responsibilities

```
MotorLink/
├── HTML Pages (User Interface)
│   ├── index.html          # Landing page with hero section
│   ├── login.html          # User authentication
│   ├── signup.html         # User registration
│   ├── dashboard.html      # Main app interface
│   ├── results.html        # Available rides display
│   ├── tracking.html       # Real-time ride tracking
│   ├── review.html         # Rating and review system
│   ├── profile.html        # User profile management
│   └── blog.html           # Blog/FAQ section
│
├── CSS Styling
│   └── styles.css          # Custom animations and components
│
├── JavaScript Modules
│   ├── script.js           # Core utilities and common functions
│   ├── auth.js             # Authentication flow
│   ├── dashboard.js        # Ride booking functionality
│   ├── tracking.js         # Real-time tracking system
│   └── review.js           # Review and rating system
│
└── Assets
    └── logo.svg            # Application branding
```

## Core JavaScript Modules Explained

### 1. script.js - Foundation Layer
**What it does:**
- Provides core utility functions used across all pages
- Manages local storage operations
- Handles form validation
- Creates notification system
- Manages loading states

**Key Functions:**
```javascript
// Storage wrapper for localStorage
window.storage = {
    set(key, value)     // Store data
    get(key)            // Retrieve data
    remove(key)         // Delete data
    clear()             // Clear all data
}

// Validation utilities
window.validation = {
    validateForm(form)           // Validate required fields
    showFieldError(field, msg)   // Display errors
    clearFieldError(field)       // Remove errors
}

// Utility functions
window.utils = {
    validateEmail(email)         // Email format validation
    validatePhone(phone)         // Rwanda phone validation
    formatCurrency(amount)       // Format to RWF
    formatDate(date)            // Date formatting
    getCurrentLocation()         // GPS location
}
```

**Backend Integration Points:**
- Replace localStorage with API calls for data persistence
- Add token management for authentication
- Implement proper error handling for API responses

### 2. auth.js - Authentication System
**What it does:**
- Handles user login and registration
- Manages user sessions
- Validates form inputs
- Redirects users after authentication

**Key Functions:**
```javascript
async function simulateLogin(loginData)
async function simulateSignup(signupData)
function checkAuthStatus()
function logout()
```

**Backend API Integration Needed:**
```javascript
// Replace mock functions with real API calls
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/refresh-token
```

**Database Tables Required:**
```sql
users:
- id (primary key)
- email (unique)
- password_hash
- full_name
- phone_number
- user_type (passenger/driver)
- created_at
- updated_at
- email_verified
- phone_verified

user_sessions:
- id
- user_id (foreign key)
- token_hash
- expires_at
- created_at
```

### 3. dashboard.js - Ride Booking Engine
**What it does:**
- Handles ride booking form
- Manages location autocomplete
- Calculates estimated prices
- Displays user statistics and ride history

**Key Functions:**
```javascript
async function handleRideBooking(formData)
function getLocationSuggestions(query)
function updateEstimatedPrice()
function displayRecentRides(rides)
```

**Backend API Integration:**
```javascript
// Location and booking APIs
GET  /api/locations/search?q={query}
POST /api/rides/book
GET  /api/rides/estimate-price
GET  /api/users/{id}/rides/recent
GET  /api/users/{id}/statistics
```

**Database Tables:**
```sql
rides:
- id
- user_id (passenger)
- driver_id
- pickup_location
- destination_location
- pickup_latitude
- pickup_longitude
- destination_latitude
- destination_longitude
- ride_type (motorbike/car/shared)
- status (requested/confirmed/in_progress/completed/cancelled)
- fare_amount
- estimated_duration
- actual_duration
- created_at
- started_at
- completed_at

locations:
- id
- name
- address
- latitude
- longitude
- location_type (landmark/district/business)

price_calculations:
- id
- base_fare
- per_km_rate
- per_minute_rate
- surge_multiplier
- ride_type
```

### 4. tracking.js - Real-time Tracking System
**What it does:**
- Displays live ride progress
- Shows driver information
- Handles ride cancellation
- Manages real-time updates

**Key Functions:**
```javascript
function startTracking()
function updateTrackingState()
function completeRide()
function cancelRide()
```

**Backend Integration - WebSocket APIs:**
```javascript
// Real-time tracking
WebSocket: /ws/rides/{rideId}/tracking
GET /api/rides/{id}/status
POST /api/rides/{id}/cancel
GET /api/drivers/{id}/location
```

**Additional Database Tables:**
```sql
drivers:
- id
- user_id (foreign key)
- license_number
- vehicle_type
- vehicle_plate
- vehicle_color
- rating
- total_rides
- status (online/offline/busy)
- current_latitude
- current_longitude
- last_location_update

ride_tracking:
- id
- ride_id
- driver_latitude
- driver_longitude
- passenger_latitude
- passenger_longitude
- timestamp
- status_update
```

### 5. review.js - Rating & Review System
**What it does:**
- Manages star rating interface
- Handles review submission
- Displays review history
- Allows review editing/deletion

**Key Functions:**
```javascript
async function submitReview(reviewData)
function updateStarRating(rating)
function loadExistingReviews()
```

**Backend APIs:**
```javascript
POST /api/rides/{id}/review
GET  /api/reviews/user/{userId}
PUT  /api/reviews/{id}
DELETE /api/reviews/{id}
GET  /api/drivers/{id}/reviews
```

**Database Tables:**
```sql
reviews:
- id
- ride_id (foreign key)
- user_id (reviewer)
- driver_id (reviewed)
- rating (1-5)
- review_text
- created_at
- updated_at
- helpful_count
```

## Backend Development Roadmap

### Phase 1: Authentication & User Management
1. **Setup Authentication Server**
   - JWT token-based authentication
   - Password hashing (bcrypt)
   - Email verification system
   - Phone number verification (SMS)

2. **User APIs**
   ```
   POST /api/auth/register
   POST /api/auth/login
   POST /api/auth/logout
   GET  /api/auth/me
   POST /api/auth/refresh
   POST /api/auth/verify-email
   POST /api/auth/verify-phone
   ```

### Phase 2: Location & Mapping Services
1. **Integration with Mapping APIs**
   - Google Maps API for Rwanda
   - OpenStreetMap alternative
   - Reverse geocoding
   - Distance/duration calculations

2. **Location APIs**
   ```
   GET /api/locations/search
   GET /api/locations/popular
   POST /api/locations/reverse-geocode
   GET /api/pricing/estimate
   ```

### Phase 3: Ride Management System
1. **Ride Booking Engine**
   ```
   POST /api/rides/book
   GET  /api/rides/{id}
   PUT  /api/rides/{id}/status
   POST /api/rides/{id}/cancel
   ```

2. **Driver Matching Algorithm**
   - Proximity-based matching
   - Driver availability checking
   - Load balancing

### Phase 4: Real-time Features
1. **WebSocket Implementation**
   - Socket.IO or native WebSockets
   - Real-time location updates
   - Live ride status changes
   - Push notifications

2. **Notification System**
   - SMS notifications (Twilio)
   - Email notifications
   - In-app notifications

### Phase 5: Payment Integration
1. **Mobile Money Integration (Rwanda)**
   - MTN Mobile Money API
   - Airtel Money API
   - Tigo Cash integration

2. **Payment APIs**
   ```
   POST /api/payments/initialize
   POST /api/payments/confirm
   GET  /api/payments/history
   POST /api/payments/refund
   ```

## External API Integrations Required

### 1. Mapping & Location Services
- **Google Maps API** or **Mapbox**
- **OpenStreetMap Nominatim** (free alternative)

### 2. Communication Services
- **Twilio** for SMS notifications
- **SendGrid** for email services

### 3. Payment Gateways
- **MTN Mobile Money API**
- **Airtel Money API**
- **Paypack** (Rwanda payment gateway)

### 4. Infrastructure Services
- **Firebase** for push notifications
- **Cloudinary** for image storage
- **AWS S3** for file storage

## Database Schema Summary

```sql
-- Core user tables
users, user_sessions, user_profiles

-- Location and ride tables  
locations, rides, ride_tracking

-- Driver management
drivers, driver_documents, driver_ratings

-- Reviews and payments
reviews, payments, payment_methods

-- System tables
price_settings, surge_pricing, notifications
```

## Security Considerations

1. **Data Protection**
   - Encrypt sensitive data (passwords, payment info)
   - HTTPS everywhere
   - Input validation and sanitization

2. **Authentication Security**
   - JWT tokens with expiration
   - Refresh token rotation
   - Rate limiting on auth endpoints

3. **Location Privacy**
   - Encrypted location storage
   - Location data retention policies
   - User consent for tracking

## Performance Optimization

1. **Database Optimization**
   - Indexes on frequently queried fields
   - Database connection pooling
   - Query optimization

2. **Caching Strategy**
   - Redis for session storage
   - Cache popular locations
   - API response caching

3. **Real-time Optimization**
   - WebSocket connection management
   - Location update throttling
   - Efficient data broadcasting










