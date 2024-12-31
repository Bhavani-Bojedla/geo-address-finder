const express = require("express");
const { reverseGeocode,searchAddress } = require("./controller");

const router = express.Router();


router.get("/reverse-geocode", reverseGeocode);
router.get("/search-address",searchAddress);

module.exports = router;
