import React from "react";

function RideCard({ ride, onBook }) {
  return (
    <div className="bg-white shadow rounded p-4 mb-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bold">{ride.driverName}</div>
          <div className="text-sm text-gray-500">{ride.carModel}</div>
        </div>
        <div className="text-lg font-bold text-primary">${ride.price}</div>
      </div>
      <div className="text-sm">
        <span className="font-semibold">From:</span> {ride.from}
        <br />
        <span className="font-semibold">To:</span> {ride.to}
        <br />
        <span className="font-semibold">ETA:</span> {ride.eta} min
      </div>
      <button
        className="mt-2 bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => onBook(ride)}
      >
        Book Ride
      </button>
    </div>
  );
}

export default RideCard;
