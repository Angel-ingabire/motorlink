# MotorLink - Ride Booking Application

## Overview

**MotorLink** is a comprehensive ride-booking platform built specifically for Kigali, Rwanda. It connects passengers with both motorbike and car drivers, offering safe, reliable, and affordable transportation. The project includes both frontend and backend components, designed with a focus on user experience and real-time ride tracking.

---

##  Features

- **User Authentication** – Secure signup and login for both passengers and drivers  
- **Ride Booking** – Intuitive interface for booking rides with fare estimation  
- **Real-time Tracking** – Live GPS tracking of ongoing rides  
- **Reviews & Ratings** – Mutual review system for drivers and passengers  
- **Profile Management** – Customizable user profiles and preferences  
- **Payment Integration** – Cash and mobile money supported  
- **Admin Dashboard** – Centralized management for users, rides, and settings  

---

## 🛠 Technologies Used

### Frontend
- HTML5, CSS3, JavaScript
- Tailwind CSS for UI styling
- Font Awesome for icons
- Mapbox GL JS for map rendering
- Leaflet.js for real-time tracking

### Backend
- PostgreSQL database
- Node.js with Express.js
- RESTful API architecture

---

## Prerequisites

Ensure the following are installed before getting started:
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Git

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Angel-ingabire/motorlink.git
cd motorlink
npm install
3. Database Setup
Create a PostgreSQL database named motorlink

Run the schema setup:

bash
Copy
Edit
psql -U your_username -d motorlink -f schema.sql
4. Configuration
Create a .env file in the root directory:

env
Copy
Edit
DATABASE_URL=postgres://username:password@localhost:5432/motorlink
MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
SESSION_SECRET=your_session_secret
5. Start the Application
bash
Copy
Edit
npm start
The application should now be running at: http://localhost:3000

 Project Structure
bash
Copy
Edit
MotorLink/
├── HTML Pages
│   ├── index.html         # Landing page
│   ├── login.html         # User login
│   ├── signup.html        # User registration
│   ├── dashboard.html     # Main ride interface
│   ├── results.html       # Ride options display
│   ├── tracking.html      # GPS ride tracking
│   ├── review.html        # Rating and reviews
│   ├── profile.html       # User profile management
│   └── blog.html          # FAQ or blog section
│
├── CSS
│   └── styles.css         # Custom styles and animations
│
├── JavaScript
│   ├── script.js          # Core utilities
│   ├── auth.js            # Login and signup logic
│   ├── dashboard.js       # Ride request functions
│   ├── tracking.js        # Ride tracking logic
│   └── review.js          # Review system
│
└── Assets
    └── logo.svg           # Logo and branding
 Usage
For Passengers:
Sign up or log in

Enter pickup and destination

Choose a ride type (motorbike or car)

Confirm booking and track ride

Rate the experience

For Drivers:
Sign up as a verified driver

Go online to receive requests

Accept ride requests and navigate

Complete rides and receive payments

API Endpoints
POST /api/auth/signup – Register user

POST /api/auth/login – Authenticate user

GET /api/rides – List available rides

POST /api/rides – Create new ride

GET /api/rides/:id/tracking – Track a ride

POST /api/reviews – Submit ride review

 Deployment
To deploy in production:

Set up a PostgreSQL instance

Configure environment variables for production

Build frontend assets:

bash
Copy
Edit
npm run build
Start production server:

bash
Copy
Edit
npm run start:prod
Recommended Services:
Heroku for application hosting

AWS RDS for PostgreSQL database

Cloudinary for media and asset storage

Testing
Run the test suite using:

bash
Copy
Edit
npm test
Includes:

Unit tests for utility functions

Integration tests for API routes

E2E tests for user workflows