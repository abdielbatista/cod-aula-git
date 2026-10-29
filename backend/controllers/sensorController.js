const SensorModel = require('../models/sensorModel');

const SensorController = {
    // 1. Salvar novo dado (atualizado para aceitar o plantaId vindo do simulador ou front-end)
    salvarDado: (req, res) => {
        const { temperatura, umidade, plantaId } = req.body;
        
        // Define a planta 1 como padrão caso venha vazia
        const idPlanta = plantaId || 1;

        SensorModel.salvar(temperatura, umidade, idPlanta, (err, result) => {
            if (err) return res.status(500).json({ erro: 'Erro ao salvar dado' });
            res.json({ mensagem: 'Dado salvo com sucesso!', id: result.insertId });
        });
    },

    // 2. Buscar leituras filtradas pelo ID da planta (para o gráfico e tabela)
    buscarPorPlanta: (req, res) => {
        const { plantaId } = req.params;

        SensorModel.buscarPorPlantaId(plantaId, (err, results) => {
            if (err) return res.status(500).json({ erro: 'Erro ao buscar dados da planta' });
            // Retorna em ordem cronológica correta para o gráfico
            res.json(results.reverse());
        });
    },

    // 3. Listar todas as plantações cadastradas (para preencher o <select>)
    listarPlantas: (req, res) => {
        SensorModel.listarTodasPlantas((err, results) => {
            if (err) return res.status(500).json({ erro: 'Erro ao listar plantações' });
            res.json(results);
        });
    }
};

module.exports = SensorController;