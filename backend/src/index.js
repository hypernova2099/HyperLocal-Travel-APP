require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trip');
const busRoutes = require('./routes/bus');
const placesRoutes = require('./routes/places');
const taxiRoutes = require('./routes/taxis');
const dayPlanRoutes = require('./routes/dayplan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Smart District Travel Assistant Backend' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/trip', tripRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/taxis', taxiRoutes);
app.use('/api/dayplan', dayPlanRoutes);

// Start server after DB connect
const startServer = async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, '0.0.0.0' ,() => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
