const axios = require("axios");
const Address = require("./model");

exports.reverseGeocode = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Latitude and Longitude are required." });
  }

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );

    console.log("OpenStreetMap API response:", response.data);

    if (response.data) {
      const address = new Address({
        address: response.data.display_name,
        location: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        },
      });

      try {
        await address.save(); 
        res.status(200).json({ address: response.data.display_name });
      } catch (dbError) {
        console.error("Error saving to the database:", dbError);
        res.status(500).json({ message: "Error saving address to the database." });
      }
    } else {
      res.status(404).json({ message: "No address found for the given coordinates." });
    }
  } catch (error) {
    console.error("Error fetching address:", error); 
    res.status(500).json({ message: "Server error while fetching address." });
  }
};

 
exports.searchAddress = async (req, res) => {
  const { query } = req.query;

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );

    if (response.data && response.data.length > 0) {
      res.status(200).json(response.data);
    } else {
      res.status(404).json({ message: "No results found for the entered address." });
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    res.status(500).json({ message: "Server error while fetching coordinates." });
  }
};