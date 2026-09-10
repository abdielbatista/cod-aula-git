const SensorModel = require('../models/sensorModel');

const SensorController = {
    salvarDado: (req, res) => {
        const { temperatura, umidade } = req.body;
        SensorModel.salvar(temperatura, umidade, (err, result) => {
            if (err) return res.status(500).json({ erro: 'Erro ao salvar dado' });
            res.json({ mensagem: 'Dado salvo com sucesso!', id: result.insertId });
        });
    },
    listarDados: (req, res) => {
        SensorModel.listarUltimos((err, results) => {
            if (err) return res.status(500).json({ erro: 'Erro ao buscar dados' });
            // Retorna em ordem cronológica correta para o gráfico
            res.json(results.reverse());
        });
    }
};

module.exports = SensorController;