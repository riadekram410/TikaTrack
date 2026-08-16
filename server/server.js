const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "TikaTrack API is running!"
    });
});

// Server for tikkaa
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`TikaTrack server running on http://localhost:${PORT}`);
});