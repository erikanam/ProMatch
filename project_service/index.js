require('dotenv').config();

const express = require('express');
const projectRoutes = require('./projectRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4002; // if no env, fallback to 4002

app.use(express.json());

app.use('/api/projects', projectRoutes);

app.listen(port, () => {
  console.log(`Project Service running on port ${port}`);
});
