import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: 'easeOut', duration: 0.4 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { ease: 'easeIn', duration: 0.2 },
  },
};

const ProductGrid = ({ products }) => {
  if (!Array.isArray(products)) return null;

  return (
    <motion.div
      className="mt-16"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="w-full py-6 px-2 sm:px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {products.map((product) => (
              <motion.div
                key={product._id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="w-full"
              >
                <HoverProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// 👇 Card with smooth crossfade effect
const HoverProductCard = ({ product }) => {
  const firstImage = product.images[0]?.url;
  const secondImage = product.images[1]?.url || firstImage;

  return (
    <Link
      to={`/product/${product._id}`}
      className="bg-white rounded-xl border border-gray-200 hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 ease-in-out block"
    >
      <div className="relative w-full h-[340px] sm:h-[360px] md:h-[380px] lg:h-[400px] overflow-hidden rounded-t-xl group">
        {/* First Image */}
        <img
          src={firstImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
          loading="lazy"
          draggable={false}
        />
        {/* Second Image (hover) */}
        <img
          src={secondImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          loading="lazy"
          draggable={false}
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="text-base md:text-lg font-semibold text-black mb-1 truncate" title={product.name}>
          {product.name}
        </h3>
        {product.sku && (
          <p className="text-xs text-gray-500 mb-1">SKU: {product.sku}</p>
        )}
        <p className="text-lg font-bold text-black mb-2">₹{product.price}</p>
        <span className="inline-block px-4 py-1 border border-black text-sm text-black rounded-full hover:bg-black hover:text-white transition">
          View Details
        </span>
      </div>
    </Link>
  );
};

export default ProductGrid;
