import React from "react";

export default function ManageAddresses({ savedAddresses, setSavedAddresses }) {
  const handleDelete = (id) => {
    setSavedAddresses(savedAddresses.filter((address) => address.id !== id));
  };

  return (
    <div className="w-full max-w-4xl p-6 mt-6 bg-white rounded-lg shadow">
      <h2 className="mb-4 text-xl font-bold">Saved Addresses</h2>
      {savedAddresses.length === 0 ? (
        <p>No addresses saved yet.</p>
      ) : (
        <ul>
          {savedAddresses.map((address) => (
            <li key={address.id} className="flex items-center justify-between mb-2">
              <span>{address.address} ({address.category})</span>
              <button
                onClick={() => handleDelete(address.id)}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}