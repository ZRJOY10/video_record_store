const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the "uploads" directory
app.use(express.static("uploads"));

// Configure Multer storage for video uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `video-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Define the upload endpoint
app.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");
  res.json({ message: "Video uploaded successfully!", filePath: `/uploads/${req.file.filename}` });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
