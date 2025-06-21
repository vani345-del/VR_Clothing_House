const mongoose = require("mongoose");
const skumiddleware = require("../middleware/skumiddleware");

const productSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  countInStock: { type: Number, required: true, default: 0 },
  category: {
    type: String,
    required: true,
    enum: ["Sarees", "Dresses", "Kidswear"],
  },
  brand: { type: String },
  sizes: { type: [String], default: [] },
  colors: { type: [String], required: true },
  collections: { type: String, required: true },
  material: { type: String },

  // ✅ Updated images field: added color
  images: [
    {
      url: { type: String, required: true },
      altText: { type: String },
      color: { type: String }, // <-- This links image with a color
    },
  ],

  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  numberReviews: { type: Number, default: 0 },
  tags: [String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  metaTitle: String,
  metaDescription: String,
  metaKeywords: String,

  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  weight: Number,

  sku: {
    type: String,
    unique: true,
  },
}, {
  timestamps: true,
});

// ✅ Use SKU auto-generator middleware
skumiddleware(productSchema);

module.exports = mongoose.model("Product", productSchema);

