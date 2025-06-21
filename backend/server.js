const express = require('express');
const serverless = require('serverless-http'); // ✅ Required for Vercel
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRouter = require('./routes/cartRouter');
const checkoutRouter = require('./routes/checkoutRouter');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./controllers/adminRouts');
const adminorderRouters = require('./controllers/adminOderRoutes');
const productAdminController = require('./controllers/productAdminController');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cookieParser = require("cookie-parser");

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // change to your deployed frontend URL later
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Welcome route
app.get("/", (req, res) => {
  res.send("✅ Welcome to the backend API hosted on Vercel!");
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/users', adminRoutes);
app.use('/api/admin/products', productAdminController);
app.use('/api/admin/orders', adminorderRouters);
app.use('/api/payment', paymentRoutes);

// ✅ Export serverless handler
module.exports = serverless(app);
