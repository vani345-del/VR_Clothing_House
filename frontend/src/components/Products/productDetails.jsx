import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ProductGrid from './ProductGrid';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector((state) => state.products);
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisable, setIsButtonDisable] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.colors?.length > 0) {
      const firstColor = selectedProduct.colors[0];
      setSelectedColor(firstColor);
      const matchingImage = selectedProduct.images.find((img) => img.color === firstColor);
      if (matchingImage) {
        setMainImage(matchingImage.url);
      } else {
        setMainImage(selectedProduct.images[0].url);
      }
    }
  }, [selectedProduct]);

  const formatPrice = (price) => new Intl.NumberFormat("en-IN").format(price);
  const originalPrice = Number(selectedProduct?.price) || 0;
  const discountPrice = Number(selectedProduct?.discountPrice) || 0;
  const hasDiscount = discountPrice > 0 && discountPrice < originalPrice;
  const finalPrice = hasDiscount ? discountPrice : originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
    : 0;

  const handleQuantity = (action) => {
    if (action === 'plus') setQuantity((prev) => prev + 1);
    if (action === 'minus' && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (selectedProduct.countInStock === 0) {
      toast.error("Product is out of stock", {
        style: { backgroundColor: '#dc2626', color: '#ffffff' },
      });
      return;
    }

    const category = selectedProduct?.category?.toLowerCase();
    const isSizeRequired = category === 'dresses' || category === 'kidswear';

    if (!selectedColor || (isSizeRequired && !selectedSize)) {
      toast.error("Please select a color and size (if applicable)", {
        style: { backgroundColor: '#dc2626', color: '#ffffff' },
      });
      return;
    }

    setIsButtonDisable(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        price: finalPrice,
        image: mainImage,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("Product added to the cart!", {
          duration: 1000,
          style: { backgroundColor: '#16a34a', color: '#ffffff' },
        });
        setSelectedSize(null);
        setSelectedColor(null);
        setQuantity(1);
      })
      .finally(() => setIsButtonDisable(false));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='mt-20'>
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg">
          <div className='flex flex-col md:flex-row'>
            {/* Thumbnails */}
            <div className="hidden md:flex flex-col space-y-4 mr-6 ml-20">
              {selectedProduct?.images?.slice(0, 2).map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="md:w-1/2">
              <img src={mainImage} alt="Main Product" className='w-full h-auto object-cover rounded-lg' />
            </div>

            {/* Mobile thumbnails */}
            <div className="md:hidden flex overflow-x-scroll space-x-4 mb-4">
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  onClick={() => setMainImage(image.url)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                />
              ))}
            </div>

            {/* Details Panel */}
            <div className="md:w-1/2 md:ml-10">
              <h1 className='text-2xl md:text-3xl font-semibold mb-2'>{selectedProduct?.name}</h1>

              {/* ✅ Availability Indicator */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-3 h-3 rounded-full ${selectedProduct.countInStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm font-medium text-gray-700">
                  {selectedProduct.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Price Block */}
              <div className="mb-4">
                <p className='text-xl font-bold text-gray-800'>₹{formatPrice(finalPrice)}</p>
                {hasDiscount && (
                  <>
                    <p className='text-sm text-gray-500 line-through'>₹{formatPrice(originalPrice)}</p>
                    <p className='text-sm text-green-600 font-medium'>Save {discountPercent}% Off</p>
                  </>
                )}
              </div>

              <p className='text-gray-600 mb-4'>{selectedProduct.description}</p>

              {/* Color Selection */}
              <div className='mb-4'>
                <p className='text-gray-700'>Color:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        const matchingImage = selectedProduct.images.find((img) => img.color === color);
                        if (matchingImage) setMainImage(matchingImage.url);
                      }}
                      className={`w-8 h-8 rounded-full border ${selectedColor === color ? "border-4 border-black" : "border-gray-300"}`}
                      style={{ backgroundColor: color.toLowerCase(), filter: "brightness(0.5)" }}
                    ></button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              {["dresses", "kidswear"].includes(selectedProduct.category?.toLowerCase()) && (
                <div className="mb-4">
                  <p className="text-gray-700">Size:</p>
                  <div className="flex gap-2 mt-2">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border ${selectedSize === size ? "bg-black text-white" : ""}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-gray-700">Quantity:</p>
                <div className="flex items-center space-x-4 mt-2">
                  <button onClick={() => handleQuantity("minus")} className='px-2 py-1 bg-gray-200 rounded text-lg'>-</button>
                  <span className='text-lg'>{quantity}</span>
                  <button onClick={() => handleQuantity("plus")} className='px-2 py-1 bg-gray-200 rounded text-lg'>+</button>
                </div>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisable || selectedProduct.countInStock === 0}
                className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${isButtonDisable || selectedProduct.countInStock === 0 ? "cursor-not-allowed opacity-50" : "hover:bg-gray-900"}`}
              >
                {selectedProduct.countInStock === 0 ? "OUT OF STOCK" : isButtonDisable ? "Adding..." : "ADD TO CART"}
              </button>

              {/* Characteristics */}
              <div className="mt-10 text-gray-700">
                <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                <table className='w-full text-left text-sm text-gray-600'>
                  <tbody>
                    {selectedProduct.sku && (
                      <tr>
                        <td className='py-1'>SKU</td>
                        <td className='py-1'>{selectedProduct.sku}</td>
                      </tr>
                    )}
                    <tr>
                      <td className='py-1'>Collection</td>
                      <td className='py-1'>{selectedProduct.collections}</td>
                    </tr>
                    <tr>
                      <td className='py-1'>Material</td>
                      <td className='py-1'>{selectedProduct.material}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Similar Products */}
      <div className='mt-20'>
        <h2 className='text-3xl text-center font-bold mt-8'>You May Also Like</h2>
        <ProductGrid products={similarProducts} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default ProductDetails;

