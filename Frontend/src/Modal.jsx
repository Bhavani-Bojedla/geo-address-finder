import React from "react";

export default function Modal({ onEnableLocation, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-11/12 max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-center">Enable Location</h2>
        <p className="mb-4 text-center text-gray-700">
          To continue, please allow access to your location or use manual search.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onEnableLocation}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Enable Location
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Search Manually
          </button>
        </div>
      </div>
    </div>
  );
}