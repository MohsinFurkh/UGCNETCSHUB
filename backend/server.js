const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect('mongodb+srv://vercel-admin-user:GkpWgGEpnmPeCa67@ugcnetcsdatabase.2s1bq3f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.send('Welcome to UGC NET CS Hub API');
});

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/topics', require('./routes/topics'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
