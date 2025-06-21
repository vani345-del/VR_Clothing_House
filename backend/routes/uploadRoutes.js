const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
require("dotenv").config();

const router = express.Router();

/*─────────────────────────────────────
  Cloudinary configuration
─────────────────────────────────────*/
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/*─────────────────────────────────────
  Multer setup – keep file in memory
─────────────────────────────────────*/
const storage = multer.memoryStorage();
const upload  = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },    // 5 MB max (adjust as you like)
});

/*─────────────────────────────────────
  Helper – upload buffer with timeout
─────────────────────────────────────*/
const streamUpload = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { timeout: 120000 },                   // wait up to 120 s (2 min)
      (error, result) => (result ? resolve(result) : reject(error))
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });

/*─────────────────────────────────────
  @route   POST /api/upload
  @desc    Upload a single image to Cloudinary
─────────────────────────────────────*/
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 🔸 Upload the buffer
    const result = await streamUpload(req.file.buffer);

    // 🔸 Respond with the Cloudinary URL
    return res.json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
