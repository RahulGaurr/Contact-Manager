const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require('cors');

connectDb();
const app = express();

const port = process.env.PORT || 5000;
app.use(express.json())
app.use(cors({origin: 'http://localhost:5173'}))

app.use("/api/contacts", require("./routes/contactRoutes")) // middleware
app.use("/api/users", require("./routes/userRoutes")) // middleware

app.use(errorHandler)
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

