import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCheckout } from '../../redux/slices/checkoutSlice';
import axios from 'axios';

const CheckOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckOutId] = useState(null);
  const [shipping, setShipping] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (cart && cart.products.length > 0) {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress: shipping,
          paymentMethod: 'Razorpay',
          totalPrice: cart.totalPrice,
        })
      );
      if (res.payload && res.payload._id) {
        setCheckOutId(res.payload._id);
      }
    }
  };

  const handlePaymentsuccess = async (details) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        { paymentStatus: 'paid', paymentDetails: details },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );
      await handleFinalizeCheckout(checkoutId);
    } catch (error) {
      console.error('Finalization failed:', error);
    }
  };

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );
      navigate('/order-confirmation');
    } catch (error) {
      console.error(error);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      const { data: order } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/razorpay/order`,
        { amount: cart.totalPrice }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: 'Your Store Name',
        description: 'Order Payment',
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/payment/razorpay/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          if (verifyRes.data.success) {
            await handlePaymentsuccess(response);
            console.log('Payment successful:', response);
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: `${shipping.firstName} ${shipping.lastName}`,
          email: user?.email,
          contact: shipping.phoneNumber,
        },
        theme: {
          color: '#000000',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Razorpay Error:', err);
      alert('Razorpay payment failed');
    }
  };

  if (loading) return <p className="text-center py-6">Loading cart...</p>;
  if (error) return <p className="text-center text-red-500 py-6">Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p className="text-center py-6">Your cart is empty</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-4 sm:px-6 tracking-tight">
      {/* Checkout Form */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-semibold uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg font-medium mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user ? user.email : ''}
              className="w-full p-2 border rounded"
              disabled
            />
          </div>

          <h3 className="text-lg font-medium mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={shipping.firstName}
                onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                value={shipping.lastName}
                onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shipping.address}
              onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={shipping.city}
                onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                value={shipping.postalCode}
                onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              value={shipping.country}
              onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              value={shipping.phoneNumber}
              onChange={(e) => setShipping({ ...shipping, phoneNumber: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {!checkoutId ? (
            <button type="submit" className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition">
              Continue to Payment
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRazorpayPayment}
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
            >
              Pay with Razorpay
            </button>
          )}
        </form>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-4">Order Summary</h3>
        <div className="border-t py-4 mb-4 space-y-4">
          {cart.products.map((product, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b pb-4"
            >
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded mr-4"
                />
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-500">Size: {product.size}</p>
                  <p className="text-sm text-gray-500">Color: {product.color}</p>
                </div>
              </div>
              <p className="text-md font-semibold">${product.price?.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-md mb-2">
          <p>Subtotal</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between text-md mb-2">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between text-lg font-semibold border-t pt-4 mt-4">
          <p>Total</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
