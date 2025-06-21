import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrders } from '../redux/slices/orderSlice';

const MyordersPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchUserOrders());
    }, [dispatch]);

    const handleRowClick = (orderId) => {
        navigate(`/order/${orderId}`)
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div className="mt-20 max-w-7xl mx-auto p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>
            
            {/* Horizontal scroll container */}
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-left text-gray-500 min-w-[800px]">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="py-3 px-4 min-w-[80px]">Image</th>
                            <th className="py-3 px-4 min-w-[150px]">Order ID</th>
                            <th className="py-3 px-4 min-w-[160px]">Created</th>
                            <th className="py-3 px-4 min-w-[150px]">Shipping</th>
                            <th className="py-3 px-4 min-w-[80px]">Items</th>
                            <th className="py-3 px-4 min-w-[100px]">Price</th>
                            <th className="py-3 px-4 min-w-[100px]">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr 
                                    key={order._id}
                                    onClick={() => handleRowClick(order._id)}
                                    className='border-b hover:bg-gray-50 cursor-pointer transition-colors'
                                >
                                    <td className="py-4 px-4">
                                        <img
                                            src={order.orderItems[0].image} 
                                            alt={order.orderItems[0].name} 
                                            className='w-12 h-12 object-cover rounded-lg'
                                        />
                                    </td>
                                    <td className="py-4 px-4 font-medium text-gray-900">
                                        #{order._id.slice(-8)}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="text-sm">
                                            <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                                            <div className="text-gray-400 text-xs">
                                                {new Date(order.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="text-sm">
                                            {order.shippingAddress
                                                ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                                                : "N/A"
                                            }
                                        </div>
                                    </td>
                                    <td className='py-4 px-4 text-center'>
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                            {order.orderItems.length}
                                        </span>
                                    </td>
                                    <td className='py-4 px-4 font-semibold text-gray-900'>
                                        ${order.totalPrice.toFixed(2)}
                                    </td>
                                    <td className='py-4 px-4'>
                                        <span className={`${
                                            order.isPaid 
                                                ? "bg-green-100 text-green-700" 
                                                : "bg-red-100 text-red-700"
                                        } px-3 py-1 rounded-full text-xs font-medium capitalize`}>
                                            {order.isPaid ? "Paid" : "Pending"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className='py-8 px-4 text-center text-gray-500'>
                                    <div className="flex flex-col items-center">
                                        <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <p className="text-lg font-medium">No orders yet</p>
                                        <p className="text-sm">Your order history will appear here</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Mobile-friendly scroll hint */}
            {orders.length > 0 && (
                <div className="mt-2 text-xs text-gray-500 text-center sm:hidden">
                    ← Scroll horizontally to see all columns →
                </div>
            )}
        </div>
    )
}

export default MyordersPage