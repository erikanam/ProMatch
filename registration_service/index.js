// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const regRoute = require('./regRoute');  

dotenv.config();  
const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());  
app.use('/api', regRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
