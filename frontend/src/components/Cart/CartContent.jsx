import React from 'react';
import { RiDeleteBin3Line } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateCartItemQuantity } from '../../redux/slices/cartSlice';

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  // Handle quantity update
  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  // Handle remove item
  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  return (
    <div>
      {cart?.products?.length > 0 ? (
        <>
          {cart.products.map((product, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-4 border-b"
            >
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover mr-4 rounded"
                />
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    Size: {product.size} | Color: {product.color}
                  </p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() =>
                        handleAddToCart(
                          product.productId,
                          -1,
                          product.quantity,
                          product.size,
                          product.color
                        )
                      }
                      className="border rounded px-2 py-0 text-xl font-medium"
                    >
                      -
                    </button>
                    <span className="mx-4">{product.quantity}</span>
                    <button
                      onClick={() =>
                        handleAddToCart(
                          product.productId,
                          1,
                          product.quantity,
                          product.size,
                          product.color
                        )
                      }
                      className="border rounded px-2 py-0 text-xl font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-right">
               <p className="font-medium">
  ₹{(product.price * product.quantity).toLocaleString()}
</p>
                <button
                  onClick={() =>
                    handleRemoveFromCart(
                      product.productId,
                      product.size,
                      product.color
                    )
                  }
                >
                  <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600" />
                </button>
              </div>
            </div>
          ))}

          {/* Total Price */}
          <div className="text-right mt-6 border-t pt-4">
            <h2 className="text-xl font-semibold">
              Total: ₹{cart.totalPrice.toLocaleString()}
            </h2>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center py-6">Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartContents;
