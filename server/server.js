const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require('cors');
const path = require("path");

connectDb();
const app = express();

const port = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? "https://contact-manager-xi-five.vercel.app" 
    : "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow methods
  allowedHeaders: ["Content-Type", "Authorization"] // Allow necessary headers
}));

// Middleware
app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
}

// API routes

app.use("/api/contacts", require("./routes/contactRoutes")) // middleware
app.use("/api/users", require("./routes/userRoutes")) // middleware

// Serve frontend for non-API routes in production
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
  });
}

//error handling
app.use(errorHandler)
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

// Export for Vercel
module.exports = app;

