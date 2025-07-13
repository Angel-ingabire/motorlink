import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RideCard from "../components/Ridecard";

const sampleRides = [
  {
    id: 1,
    driverName: "Alice",
    carModel: "Toyota Prius",
    price: 12,
    from: "Downtown",
    to: "Airport",
    eta: 8
  },
  {
    id: 2,
    driverName: "Bob",
    carModel: "Honda Civic",
    price: 10,
    from: "Downtown",
    to: "Airport",
    eta: 12
  }
];

function Rides() {
  const location = useLocation();
  const navigate = useNavigate();
  const [rides] = useState(sampleRides);

  function handleBook(ride) {
    // TODO: API call to book ride
    navigate("/track", { state: { ride } });
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Available Rides</h2>
      {rides.map(ride => (
        <RideCard key={ride.id} ride={ride} onBook={handleBook} />
      ))}
    </div>
  );
}

export default Rides;
