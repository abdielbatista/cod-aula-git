const express = require('express');
const cors = require('cors');
const sensorRoutes = require('./routes/sensorRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Registra as rotas da API
app.use('/api/sensores', sensorRoutes);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000!');
});