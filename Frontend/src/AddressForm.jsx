import React, { useState } from "react";

export default function AddressForm({ setSavedAddresses, onClose }) {
  const [houseNo, setHouseNo] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState("");

  const handleSave = () => {
    if (!houseNo || !area || !category) {
      alert("Please fill all fields.");
      return;
    }

    const newAddress = {
      id: Date.now(),
      category,
      address: `${houseNo}, ${area}`,
    };

    setSavedAddresses((prev) => [...prev, newAddress]);
    alert("Address saved successfully!");
    onClose(); 
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow">
      <h1 className="mb-4 text-2xl font-bold">Add Address</h1>
      <input
        type="text"
        placeholder="House/Flat/Block No."
        value={houseNo}
        onChange={(e) => setHouseNo(e.target.value)}
        className="w-full px-4 py-2 mb-2 border rounded"
      />
      <input
        type="text"
        placeholder="Apartment/Road/Area"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        className="w-full px-4 py-2 mb-2 border rounded"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded"
      >
        <option value="" disabled>
          Select Category
        </option>
        <option value="Home">Home</option>
        <option value="Office">Office</option>
        <option value="Friends & Family">Friends & Family</option>
      </select>
      <button
        onClick={handleSave}
        className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Save Address
      </button>
    </div>
  );
}
