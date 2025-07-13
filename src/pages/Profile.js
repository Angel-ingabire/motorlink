import React from "react";

function Profile() {
  // TODO: Fetch user info from API
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="mb-2">Name: John Doe</div>
      <div className="mb-2">Email: johndoe@example.com</div>
      <div className="mb-2">Phone: +1234567890</div>
      <button className="mt-4 bg-accent text-white px-4 py-2 rounded hover:bg-yellow-600">
        Edit Profile
      </button>
    </div>
  );
}

export default Profile;
