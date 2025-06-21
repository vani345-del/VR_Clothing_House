// middleware/skuMiddleware.js

// Utility function to generate SKU
function generateSKU(categoryPrefix = "GEN") {
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `${categoryPrefix.toUpperCase()}-${random}`;
}


// Middleware function for SKU generation
function skumiddleware(schema) {
  schema.pre("save", function (next) {
    if (!this.sku) {
      const prefixMap = {
        Sarees: "SAR",
        Dresses: "DRS",
        Kidswear: "KID",
      };
      const prefix = prefixMap[this.category] || "GEN";
      this.sku = generateSKU(prefix);
    }
    next();
  });
}

module.exports = skumiddleware;
