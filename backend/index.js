require('dotenv').config(); // Load environment variables

const express = require('express');
const connectDB = require('./config/db'); // Database connection
const cors = require('cors');
// Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());


// Middlewares
app.use(express.json()); // Middleware to parse JSON bodies

// Connect to Database
connectDB();

// Use routes
app.use('/api/auth', authRoutes); // Organize auth routes under a clear prefix
app.use('/api/users', userRoutes); // Keep API routes prefixed for better organization

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Server Port Configuration
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
