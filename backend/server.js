const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const hotelRoutes = require('./routes/hotels');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/hotels', hotelRoutes);

app.use((err, req, res, next) => {
  res.status(400).json({ errors: [err.message] });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
