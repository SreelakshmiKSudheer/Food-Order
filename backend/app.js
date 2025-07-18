const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })) // Middleware to parse URL-encoded bodies

const router = require('./routes/index')


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use("/api", router);

const PORT = process.env.PORT;

// http://localhost:3000/api/
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
