const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

// Rota para listar as plantações cadastradas (para o <select>)
router.get('/plantas', sensorController.listarPlantas);

// Rota para buscar as leituras filtradas pelo ID da planta (ex: /api/sensores/1)
router.get('/:plantaId', sensorController.buscarPorPlanta);

// Rota para salvar nova leitura (usada pelo simulador)
router.post('/', sensorController.salvarDado);

module.exports = router;