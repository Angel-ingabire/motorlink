import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Search() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    // TODO: API call to fetch rides
    navigate("/rides", { state: { from, to } });
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Find a Ride</h2>
      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <input
          className="border px-3 py-2 rounded"
          type="text"
          placeholder="Current Address"
          value={from}
          onChange={e => setFrom(e.target.value)}
          required
        />
        <input
          className="border px-3 py-2 rounded"
          type="text"
          placeholder="Destination"
          value={to}
          onChange={e => setTo(e.target.value)}
          required
        />
        <button className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700">
          Next
        </button>
      </form>
    </div>
  );
}

export default Search;
