//routes.js
const express = require('express');
const regController = require('./regController'); 

const router = express.Router();


router.post('/register', regController.registerUser);

module.exports = router;
