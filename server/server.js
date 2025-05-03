const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRouter = require('./routes/userRoutes');
// const adminRouter = require('./routes/adminRoutes');
const cors = require('cors');
const globalRouter = require('./routes/globalRoutes');
// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/public', globalRouter);
// app.use('/api/admin', adminRouter);

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 