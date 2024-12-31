require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./connection");
const locationRoutes = require("./routes");

const app = express();

connectDB();  

app.use(cors());
app.use(express.json());


app.use("/api/location", locationRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
