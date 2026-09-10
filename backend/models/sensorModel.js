const db = require('../config/db');

const SensorModel = {
    salvar: (temperatura, umidade, callback) => {
        const sql = 'INSERT INTO LeituraSensor (temperatura, umidade) VALUES (?, ?)';
        db.query(sql, [temperatura, umidade], callback);
    },
    listarUltimos: (callback) => {
        const sql = 'SELECT * FROM LeituraSensor ORDER BY criadoEm DESC LIMIT 10';
        db.query(sql, callback);
    }
};

module.exports = SensorModel;