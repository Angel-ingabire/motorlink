import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold mb-4 text-primary">Welcome to MotorLink</h1>
      <p className="mb-6 text-gray-600">Book rides quickly, track your journey, and travel with ease.</p>
      <Link to="/search" className="bg-primary text-white px-6 py-3 rounded text-lg hover:bg-blue-700">
        Book a Ride
      </Link>
    </div>
  );
}

export default Home;
