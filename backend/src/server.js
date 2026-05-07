require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
