import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Review() {
  const location = useLocation();
  const ride = location.state?.ride;
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: API call to submit review
    navigate("/rides");
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Review Your Ride</h2>
      {ride ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <span className="font-bold">{ride.driverName}</span> ({ride.carModel})
          </div>
          <div>
            <label className="block mb-1">Rating:</label>
            <input
              type="range"
              min="1"
              max="5"
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
              className="w-full"
            />
            <div>{rating} Stars</div>
          </div>
          <textarea
            className="border px-3 py-2 rounded"
            placeholder="Leave a comment..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit Review
          </button>
        </form>
      ) : (
        <div>No ride selected.</div>
      )}
    </div>
  );
}

export default Review;
