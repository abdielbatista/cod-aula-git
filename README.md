# 📊 Dashboard IoT - Sistema de Monitoramento em Tempo Real

Sistema full-stack desenvolvido para fins educacionais (**Projeto Integrador**), utilizando o padrão arquitetural **MVC (Model-View-Controller)** para monitoramento de sensores agrícolas em tempo real, com gráficos dinâmicos, indicadores de status de conexão, tratamento de erros e seletor dinâmico de plantações.

---

## 🚀 Tecnologias Utilizadas

* **Front-end:** HTML5, Tailwind CSS (via CDN), Chart.js, JavaScript (Vanilla).
* **Back-end:** Node.js, Express, Cors.
* **Banco de Dados:** MySQL / MariaDB (`mysql2`).
* **Comunicação:** API REST assíncrona (`fetch`).

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (versão 16 ou superior recomendada)
* [MySQL Server](https://dev.mysql.com/downloads/) (ou XAMPP / WampServer para gerenciar o banco localmente)
* Um editor de código como o [VS Code](https://code.visualstudio.com/)

---

## ⚙️ Configuração do Banco de Dados (MySQL)

Acesse o seu gerenciador MySQL (PhpMyAdmin ou terminal) e execute o script abaixo para criar o banco de dados, a tabela de plantações e a tabela de leituras com o relacionamento (`FOREIGN KEY`):

```sql
CREATE DATABASE IF NOT EXISTS sistema_iot;
USE sistema_iot;

-- 1. Tabela de Plantações
CREATE TABLE IF NOT EXISTS `plantas` (
  `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(100) NOT NULL,
  `localizacao` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Inserindo plantações de exemplo
INSERT INTO `plantas` (`id`, `nome`, `localizacao`) VALUES
(1, 'Plantação de Alface', 'Estufa A'),
(2, 'Plantação de Tomate', 'Estufa B'),
(3, 'Plantação de Milho', 'Campo Aberto');

-- 2. Tabela de Leituras dos Sensores (relacionada com as plantas)
CREATE TABLE IF NOT EXISTS `leiturasensor` (
  `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `temperatura` FLOAT NOT NULL,
  `umidade` FLOAT NOT NULL,
  `criadoEm` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `planta_id` INT(11) DEFAULT 1,
  CONSTRAINT `fk_plantas` FOREIGN KEY (`planta_id`) REFERENCES `plantas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

---

## 📦 Como Instalar e Executar o Projeto Localmente

### 1. Clonar ou baixar o repositório
Abra o terminal na pasta do projeto.

### 2. Instalação das Dependências
Navegue até a pasta do back-end (ou raiz onde está o seu `package.json`) e instale os pacotes necessários (`express`, `cors`, `mysql2`, etc.):
```bash
npm install
```

### 3. Executando o Servidor (Back-end)
Inicie o servidor da API executando:
```bash
node server.js
```
*O servidor rodará por padrão em: `http://localhost:3000`*

### 4. Executando o Simulador de Hardware (Gerador de dados)
Em uma **nova aba/janela do terminal**, execute o script simulador para injetar dados falsos de temperatura, umidade e IDs de plantações variados no banco a cada 3 segundos:
```bash
node simulador.js
```

### 5. Acessando o Front-end (Dashboard)
Para abrir o painel visual:
1. Vá até a pasta do front-end (`dashboard/index.html`).
2. Utilize a extensão **Live Server** do VS Code para abri-lo (recomendado) **OU** dê dois cliques no arquivo `index.html` para abri-lo direto no navegador.

---

## 📂 Estrutura do Projeto

```text
/cod-git
   ├── /backend
   │     ├── /config          <-- Conexão com o banco de dados (MySQL)
   │     ├── /controllers     <-- Regras de negócio (SensorController)
   │     ├── /models          <-- Consultas SQL (SensorModel)
   │     └── /routes          <-- Endpoints da API (sensorRoutes)
   ├── /dashboard
   │     └── index.html       <-- Interface visual (Tailwind CSS + Chart.js)
   ├── server.js              <-- Ponto de entrada do servidor Node.js
   ├── simulador.js           <-- Simula o envio automático de dados IoT
   ├── script.js              <-- Lógica do front-end e consumo da API
   └── package.json           <-- Dependências e scripts
```

## 👨‍🏫 Autor / Professor Abdiel B.S
Projeto desenvolvido para acompanhamento e aulas práticas das turmas de Desenvolvimento Web e IoT (Projeto Integrador).