import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import Modal from "./Modal";
import AddressForm from "./AddressForm";
import ManageAddresses from "./ManageAddresses";

export default function App() {
  const [modalOpen, setModalOpen] = useState(true);
  const [lat, setLat] = useState(20.5937); 
  const [lng, setLng] = useState(78.9629); 
  const [address, setAddress] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const mapRef = useRef();

  const markerIcon = new Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const locateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const currentLat = position.coords.latitude;
          const currentLng = position.coords.longitude;
          setLat(currentLat);
          setLng(currentLng);
          setModalOpen(false);
          await fetchAddress(currentLat, currentLng);
          if (mapRef.current) {
            const map = mapRef.current;
            map.setView([currentLat, currentLng], 15);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Failed to fetch your location. Please enable location services.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } 
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  

  const handleMarkerDrag = (e) => {
    const newLat = e.target.getLatLng().lat;
    const newLng = e.target.getLatLng().lng;
    setLat(newLat);
    setLng(newLng);
    fetchAddress(newLat, newLng);
  };

  const fetchAddress = async (latitude, longitude) => {
    setLoading(true);
    try {
      console.log(`Fetching address for ${latitude}, ${longitude}`); 
      const response = await axios.get("http://localhost:5000/api/location/reverse-geocode", {
        params: { lat: latitude, lng: longitude },
      });
      console.log("Address fetched:", response.data); 
      const fetchedAddress = response.data.address || "Address not found";
      setAddress(fetchedAddress);
    } catch (error) {
      console.error("Error fetching address:", error.message);
      setAddress("Error fetching address.");
    } finally {
      setLoading(false);
    }
  };
  
  
  
  const searchAddress = async () => {
    if (!manualAddress.trim()) {
      alert("Please enter an address to search.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/location/search-address", {
        params: { query: manualAddress },
      });
  
      if (response.data && response.data.length > 0) {
        const { lat, lon, display_name } = response.data[0]; 
        setLat(parseFloat(lat)); 
        setLng(parseFloat(lon));  
        setAddress(display_name);
        
        setModalOpen(false);
        if (mapRef.current) {
          const map = mapRef.current;
          map.setView([parseFloat(lat), parseFloat(lon)], 15); 
        }
      } else {
        alert("No results found for the entered address.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      alert("Failed to fetch location. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {modalOpen && <Modal onEnableLocation={locateMe} onClose={() => setModalOpen(false)} />}

      {!modalOpen && (
        <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow">
          <h1 className="mb-4 text-2xl font-bold text-center">Reverse Geocoding App</h1>
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Enter address..."
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              className="flex-1 px-4 py-2 mr-2 border rounded"
            />
            <button
              onClick={searchAddress}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Search Address
            </button>
          </div>
          <button
            onClick={locateMe}
            className="px-4 py-2 mb-4 text-white bg-green-500 rounded hover:bg-green-600"
          >
            Locate Me
          </button>
          <MapContainer
            center={[lat, lng]}
            zoom={15}
            style={{ height: "400px", width: "100%" }}
            className="z-0 rounded-lg"
            whenCreated={(map) => (mapRef.current = map)}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
              position={[lat, lng]}
              icon={markerIcon}
              draggable={true}
              eventHandlers={{
                dragend: handleMarkerDrag,
              }}
            >
              <Popup>{address || "Selected location"}</Popup>
            </Marker>
          </MapContainer>
          <div className="mt-4 text-center">
            <p>Selected Coordinates:</p>
            <p>
              Latitude: <b>{lat}</b>, Longitude: <b>{lng}</b>
            </p>
            {address && (
              <div className="p-4 mt-4 bg-gray-100 border rounded">
                <p className="font-bold">Address:</p>
                <p>{address}</p>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Add Detailed Address
                </button>
              </div>
            )}
          </div>
        </div>
      )}

     
      {showAddressForm && (
        <AddressForm
          setSavedAddresses={setSavedAddresses}
          onClose={() => setShowAddressForm(false)}
        />
      )}

      <ManageAddresses
        savedAddresses={savedAddresses}
        setSavedAddresses={setSavedAddresses}
      />
    </div>
  );
}