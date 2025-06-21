import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import cartReducer from './slices/cartSlice' //
import checkoutReducer from "./slices/checkoutSlice";
import adminOrderReducer from "./slices/adminOrderSlice";
import adminProductReducer from "./slices/adminProductSlice";
import adminReducer from "./slices/adminSlice";
import orderReducer from "./slices/orderSlice"

const store = configureStore({
  reducer: {

    auth: authReducer,
    products:productReducer, // Assuming you have a productReducer defined in slices/productSlice.js
    cart:cartReducer, 
    checkout:checkoutReducer,
    orders:orderReducer,
    admin:adminReducer,
    adminProducts:adminProductReducer,
    adminOrders:adminOrderReducer// Assuming you have a cartReducer defined in slices/cartSlice.js
  },
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development mode
});

export default store;