import React, { useEffect } from 'react';
import MyordersPage from './MyordersPage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/slices/cartSlice';
import { logout } from '../redux/slices/authSlice';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  return (
    <div className="mt-20 min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

          {/* Profile Section */}
          <div className="col-span-1 bg-white shadow-md rounded-xl p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2 break-words">{user?.name}</h1>
            <p className="text-gray-600 mb-4 break-words">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-black hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition duration-200"
            >
              Logout
            </button>
          </div>

          {/* Orders Section */}
          <div className="col-span-1 md:col-span-2 bg-white shadow-md rounded-xl p-4 sm:p-6 overflow-x-auto">
            
            <MyordersPage />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

