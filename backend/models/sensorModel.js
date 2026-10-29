const db = require('../config/db'); // Ou a forma como você importa a conexão com o banco

const SensorModel = {
    // Salvar leitura com o ID da planta
    salvar: (temperatura, umidade, plantaId, callback) => {
        const query = 'INSERT INTO leiturasensor (temperatura, umidade, planta_id) VALUES (?, ?, ?)';
        db.query(query, [temperatura, umidade, plantaId], callback);
    },

    // Buscar leituras filtradas pelo ID da planta (Essa é a que estava faltando!)
    buscarPorPlantaId: (plantaId, callback) => {
        const query = 'SELECT * FROM leiturasensor WHERE planta_id = ? ORDER BY criadoEm DESC LIMIT 20';
        db.query(query, [plantaId], callback);
    },

    // Listar todas as plantações cadastradas (para preencher o <select>)
    listarTodasPlantas: (callback) => {
        const query = 'SELECT * FROM plantas';
        db.query(query, callback);
    }
};

module.exports = SensorModel;