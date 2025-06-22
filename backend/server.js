const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRouter = require('./routes/cartRouter');
const checkoutRouter = require('./routes/checkoutRouter');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./controllers/adminRouts');
const adminOrderRoutes = require('./controllers/adminOderRoutes');
const productAdminController = require('./controllers/productAdminController');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cookieParser = require('cookie-parser');

// Load environment variables and connect to database
dotenv.config();
connectDB();

const app = express();

// Allowed origins for Vercel (production & preview) and local dev
const allowedOrigins = [
  'https://vr-clothing-house.vercel.app',
  'https://vr-clothing-house-z7tm.vercel.app',
  'http://localhost:3000',
];

// CORS middleware with dynamic origin check
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Other middleware
app.use(express.json());
app.use(cookieParser());

// Health check route
app.get('/', (req, res) => {
  res.send('✅ Welcome to the backend API hosted on Fly.io!');
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
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/payment', paymentRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
