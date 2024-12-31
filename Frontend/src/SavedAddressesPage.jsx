import React from "react";
import ManageAddresses from "./ManageAddresses";

export default function SavedAddressesPage({ savedAddresses, setSavedAddresses }) {
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-center">Saved Addresses</h1>
      <ManageAddresses savedAddresses={savedAddresses} setSavedAddresses={setSavedAddresses} />
    </div>
  );
}
