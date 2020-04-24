const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const aboutController = require('../controllers/aboutController');

router.get('/', homeController.index);
router.get('/about', aboutController.about);

module.exports = router;