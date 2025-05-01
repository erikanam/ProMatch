const express = require('express');
const router = express.Router();
const { handleCreateProject } = require('./projectController');

router.post('/', handleCreateProject);

module.exports = router;
