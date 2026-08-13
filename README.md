Passo 1: Criar a Estrutura de Pastas no Computador
Na raiz do seu projeto (por exemplo, na pasta projeto-integrador), crie as seguintes pastas e arquivos manualmente ou pelo terminal:

```
/projeto-integrador
│
├── /backend
│   ├── server.js
│   └── package.json
│
├── /frontend
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── simulador.js
```
Passo 2: Criar o Banco de Dados (MySQL)

Abra o seu gerenciador de MySQL (MySQL Workbench, phpMyAdmin, DBeaver, etc.) e execute o código SQL abaixo para criar o banco e a tabela:

```sql
CREATE DATABASE IF NOT EXISTS projeto_iot;
USE projeto_iot;

CREATE TABLE IF NOT EXISTS LeituraSensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    temperatura FLOAT NOT NULL,
    umidade FLOAT NOT NULL,
    criadoEm DATETIME DEFAULT CURRENT_TIMESTAMP
);
```


Passo 3: Configurar e Rodar o Backend (Node.js)

1 - Abra o terminal na pasta backend:

```cmd
Bash
cd backend
```


2 - Instale as dependências necessárias (Express para o servidor, Cors para liberar o acesso, e o MySQL2 para conectar no banco):

```cmd
npm init -y
npm install express cors mysql2
```


3- Crie o arquivo server.js dentro da pasta backend e cole o código abaixo (ajuste usuário, senha e nome do banco nas configurações do MySQL):

```javascript
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexão com o MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',         // Altere para o seu usuário do MySQL
    password: 'sua_senha', // Altere para a sua senha do MySQL
    database: 'projeto_iot'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL com sucesso!');
});

// Rota para receber dados (POST) - Usada pelo Arduino ou pelo Simulador
app.post('/api/sensores', (req, res) => {
    const { temperatura, umidade } = req.body;
    const sql = 'INSERT INTO LeituraSensor (temperatura, umidade) VALUES (?, ?)';
    
    db.query(sql, [temperatura, umidade], (err, result) => {
        if (err) {
            console.error('Erro ao salvar no banco:', err);
            return res.status(500).json({ erro: 'Erro ao salvar dados' });
        }
        res.json({ mensagem: 'Dado salvo com sucesso!', id: result.insertId });
    });
});

// Rota para o Front-end buscar os últimos 10 registros (GET)
app.get('/api/sensores', (req, res) => {
    const sql = 'SELECT * FROM LeituraSensor ORDER BY id DESC LIMIT 10';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar dados:', err);
            return res.status(500).json({ erro: 'Erro ao buscar dados' });
        }
        // Inverte para ficar em ordem cronológica correta no gráfico
        res.json(results.reverse());
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
```

1 - Para iniciar o servidor, digite no terminal (ainda dentro da pasta backend):

```cmd
Bash
node server.js
```

Passo 4: Criar o Frontend (Separado em HTML, CSS e JS)
Vá até a pasta frontend e crie os três arquivos separados:

1. Arquivo index.html

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard IoT - Projeto Integrador</title>
    <!-- Tailwind CSS (via CDN) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Chart.js (via CDN) -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- Link para o CSS separado -->
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-gray-100 min-h-screen p-6">

    <div class="max-w-6xl mx-auto">
        <!-- Cabeçalho -->
        <header class="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow">
            <h1 class="text-2xl font-bold text-gray-800">Dashboard IoT (Dados do MySQL)</h1>
            <span class="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-semibold">Conectado ao Banco</span>
        </header>

        <!-- Cards de Indicadores -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                <p class="text-gray-500 text-sm">Temperatura Atual</p>
                <h2 id="currentTemp" class="text-3xl font-bold text-gray-800">-- °C</h2>
            </div>
            <div class="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                <p class="text-gray-500 text-sm">Umidade Atual</p>
                <h2 id="currentHum" class="text-3xl font-bold text-gray-800">-- %</h2>
            </div>
        </div>

        <!-- Área do Gráfico -->
        <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-4 text-gray-700">Histórico de Leituras</h3>
            <div class="relative h-80">
                <canvas id="sensorChart"></canvas>
            </div>
        </div>
    </div>

    <!-- Link para o JavaScript separado -->
    <script src="script.js"></script>
</body>
</html>
```

2. Arquivo style.css
(Aqui você pode colocar estilos customizados extras se precisar, o Tailwind já estiliza a maior parte)

```
/* Estilos personalizados opcionais */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
```

3. Arquivo script.js

```javascript
const ctx = document.getElementById('sensorChart').getContext('2d');

// Configuração inicial do Gráfico com Chart.js
const sensorChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Temperatura (°C)',
                data: [],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.3,
                fill: true
            },
            {
                label: 'Umidade (%)',
                data: [],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.3,
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

// Função que busca os dados reais direto do Backend / MySQL
async function buscarDadosDoMySQL() {
    try {
        const resposta = await fetch('http://localhost:3000/api/sensores');
        const leituras = await resposta.json();

        if (leituras.length > 0) {
            const labels = leituras.map(l => new Date(l.criadoEm).toLocaleTimeString());
            const temperaturas = leituras.map(l => l.temperatura);
            const umidades = leituras.map(l => l.umidade);

            // Atualiza os números dos cards com a leitura mais recente
            const ultimo = leituras[leituras.length - 1];
            document.getElementById('currentTemp').innerText = ultimo.temperatura + ' °C';
            document.getElementById('currentHum').innerText = ultimo.umidade + ' %';

            // Atualiza as informações do gráfico
            sensorChart.data.labels = labels;
            sensorChart.data.datasets[0].data = temperaturas;
            sensorChart.data.datasets[1].data = umidades;
            sensorChart.update();
        }
    } catch (erro) {
        console.error("Erro ao buscar dados do servidor:", erro);
    }
}

// Executa assim que abre e atualiza a cada 3 segundos
buscarDadosDoMySQL();
setInterval(buscarDadosDoMySQL, 3000);
```

Passo 5: Criar o Simulador (Para alimentar o banco automaticamente)
Para que o gráfico e os cards tenham o que mostrar sem precisar do hardware físico conectado, crie o arquivo simulador.js na raiz do projeto:

```javascript
const urlBackend = 'http://localhost:3000/api/sensores';

function gerarDadosAleatorios() {
    const temperatura = Number((20 + Math.random() * 10).toFixed(1));
    const umidade = Number((40 + Math.random() * 30).toFixed(1));
    return { temperatura, umidade };
}

async function enviarDados() {
    const dados = gerarDadosAleatorios();

    try {
        await fetch(urlBackend, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        console.log(`[ENVIADO] Temp: ${dados.temperatura}°C | Umid: ${dados.umidade}%`);
    } catch (erro) {
        console.error("[ERRO] O backend está rodando?", erro.message);
    }
}

console.log("🚀 Simulador iniciado. Enviando dados para o MySQL a cada 3 segundos...");
enviarDados();
setInterval(enviarDados, 3000);
```

Para rodá-lo, abra uma nova aba no terminal, navegue até a raiz do projeto e digite:

```cmd
Bash
node simulador.js
```
