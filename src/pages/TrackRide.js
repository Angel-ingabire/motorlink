import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function TrackRide() {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride;

  function handleComplete() {
    navigate("/review", { state: { ride } });
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Track Your Ride</h2>
      {ride ? (
        <>
          <div className="mb-4">
            <div className="font-bold">{ride.driverName}</div>
            <div className="text-sm text-gray-500">{ride.carModel}</div>
            <div className="text-sm">From: {ride.from}</div>
            <div className="text-sm">To: {ride.to}</div>
            <div className="text-sm">ETA: {ride.eta} min</div>
          </div>
          <div className="bg-gray-100 h-40 rounded mb-4 flex items-center justify-center text-gray-400">
            [Map Placeholder]
          </div>
          <button
            className="bg-accent text-white px-4 py-2 rounded hover:bg-yellow-600"
            onClick={handleComplete}
          >
            Complete Ride
          </button>
        </>
      ) : (
        <div>No ride selected.</div>
      )}
    </div>
  );
}

export default TrackRide;
