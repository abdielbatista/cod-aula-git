const express = require('express');
const router = express.Router();
const SensorController = require('../controllers/sensorController');

router.post('/', SensorController.salvarDado);
router.get('/', SensorController.listarDados);

module.exports = router;