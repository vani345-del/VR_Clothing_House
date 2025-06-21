import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {  logoutUser } from './redux/slices/authSlice';

// Layouts & Pages
import UserLayout from './components/Layout/UserLayout';
import AdminLayout from './components/Admin/AdminLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SareesPages from './pages/SareesPages';
import DressesPage from './pages/DressesPage';
import Kidsware from './pages/Kidsware';
import ProfilePage from './pages/profilePage';
import ProductDetails from './components/Products/productDetails';
import Checkout from './components/Cart/Checkout';
import ProtectedRoute from './components/Common/ProtectedRoute';
import AdminHomePage from './pages/AdminHomePage';
import UserManagement from './components/Admin/UserManagement';
import ProductManagement from './components/Admin/ProductManagement';
import EditProductPage from './components/Admin/EditProductPage';
import OrderManagement from './components/Admin/OrderManagement';
import AddProduct from './components/Admin/AddProduct';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderDeatilsPage from './pages/OrderDeatilsPage';
import MyordersPage from './pages/MyordersPage';
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";

const AppRoutes = () => {
  
  
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="sarees" element={<SareesPages />} />
        <Route path="dresses" element={<DressesPage />} />
        <Route path="kidsware" element={<Kidsware />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="order-confirmation" element={<OrderConfirmation />} />
        <Route path="order/:id" element={<OrderDeatilsPage />} />
        <Route path="/my-orders" element={<MyordersPage />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminHomePage />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="products/:id/edit" element={<EditProductPage />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="orders" element={<OrderManagement />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
