let sensorChart;

// Função para atualizar o status visual de conexão
function atualizarStatusConexao(online){
    const badge = document.getElementById('connectionBadge');

    if (online){
        badge.className = "px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center gap-2"
        badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-green-500"></span> Sistema Online`;
    } else {
        badge.className = "px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold flex items-center gap-2";
        badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> Servidor Offline`;
    }
}

async function inicializarDashboard() {
        const ctx = document.getElementById('sensorChart').getContext('2d');
        
        sensorChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { label: 'Temperatura (°C)', data: [], borderColor: '#3b82f6', tension: 0.3 },
                { label: 'Umidade (%)', data: [], borderColor: '#10b981', tension: 0.3 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    buscarDadosDoBanco();
    setInterval(buscarDadosDoBanco, 3000);
}

async function buscarDadosDoBanco() {
    try{
        const resposta = await fetch('http://localhost:3000/api/sensores');
        const leituras = await resposta.json();

        atualizarStatusConexao(true)

        if (leituras.length > 0){
            const labels = leituras.map(l => new Date(l.criadoEm).toLocaleTimeString());
            const temperaturas = leituras.map(l => l.temperatura);
            const umidades = leituras.map(l => l.umidade);

            const ultimo = leituras[leituras.length - 1];
            document.getElementById('currentTemp').innerText = ultimo.temperatura + ' °C';
            document.getElementById('currentHum').innerText = ultimo.umidade + ' %';
        
            sensorChart.data.labels = labels;
            sensorChart.data.datasets[0].data = temperaturas;
            sensorChart.data.datasets[1].data = umidades;
            sensorChart.update();
        }
    } catch (erro){
        console.error("Erro ao comunicar com o backend:", erro)

        atualizarStatusConexao(false);
    }
}

window.onload = inicializarDashboard;