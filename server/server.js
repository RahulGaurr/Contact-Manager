const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require('cors');

connectDb();
const app = express();

const port = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173", // Vite dev server
    "https://contact-manager-ashy-sigma.vercel.app/" // Vercel frontend
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());

// API routes

app.use("/api/contacts", require("./routes/contactRoutes")) // middleware
app.use("/api/users", require("./routes/userRoutes")) // middleware


//error handling
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

// Export for Render
module.exports = app;

