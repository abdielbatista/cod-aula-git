const express = require('express');
const cors = require('cors');
const sensorRoutes = require('./routes/sensorRoutes');

const app = express();

// Middlewares essenciais
app.use(express.json());
app.use(cors());

// Registra as rotas da API
// IMPORTANTE: Dentro do arquivo './routes/sensorRoutes' é que você vai configurar 
// a rota para aceitar o parâmetro, por exemplo: /:plantaId
app.use('/api/sensores', sensorRoutes);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000!');
});