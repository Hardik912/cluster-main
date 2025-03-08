const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const Moralis = require("moralis").default;
const scoreRoutes = require('./routes/scoreRoutes.js')
const blockchainRoutes = require("./routes/blockchainRoutes");
const twitterRoutes = require("./routes/twitterRoutes");
const VeridaApiRoutes= require("./routes/VeridaApiRoute.js");
const VeridaAuthRoutes= require('./routes/VeridaAuthRoute.js')
const connectDB = require('./db.js')

dotenv.config(); // Load .env variables

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/twitter", twitterRoutes);

// Load blockchain routes
app.use("/api", blockchainRoutes);

app.use('/VeridaApi', VeridaApiRoutes);
app.use('/VeridaAuth',VeridaAuthRoutes)

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running fine." });
});
connectDB();

app.use("/api/score", scoreRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const startServer = async () => {
  try {
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
    
  } catch (error) {
    console.error(" Error starting server:", error);
  }
};

startServer();