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

// NOVO: Pega o ID da planta selecionada no <select> do HTML
function obterPlantaSelecionada() {
    const seletor = document.getElementById('seletorPlanta');
    return seletor ? seletor.value : 1; // Retorna o ID selecionado ou 1 como padrão
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

    // NOVO: Ouve o evento de troca no <select>: mudou de planta, busca os dados na hora!
    const seletor = document.getElementById('seletorPlanta');
    if (seletor) {
        seletor.addEventListener('change', () => {
            buscarDadosDoBanco();
        });
    }
}

async function buscarDadosDoBanco() {
    // Pega o ID da planta escolhida no momento
    const plantaId = obterPlantaSelecionada();

    try{
        // ATUALIZADO: Passa o ID da planta na URL para o back-end filtrar
        const resposta = await fetch(`http://localhost:3000/api/sensores/${plantaId}`);
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

            const tabelaBody = document.getElementById('historyTableBody');
            const ultimos5 = [...leituras].reverse().slice(0, 5);

            tabelaBody.innerHTML = ultimos5.map(d =>{
                const horaFormatada = new Date(d.criadoEm || Date.now()).toLocaleTimeString();
                return `
                <tr class="border-b hover:bg-gray-50">
                    <td class="p-2 font-medium text-blue-600">${d.temperatura} °C</td>
                    <td class="p-2 font-medium text-green-600">${d.umidade} %</td>
                    <td class="p-2 text-gray-400 text-xs">${horaFormatada}</td>
                </tr>
                `
            }).join('');
        } else {
            // Caso a planta não tenha registros, limpa os cards e o gráfico
            document.getElementById('currentTemp').innerText = '-- °C';
            document.getElementById('currentHum').innerText = '-- %';
            sensorChart.data.labels = [];
            sensorChart.data.datasets[0].data = [];
            sensorChart.data.datasets[1].data = [];
            sensorChart.update();
            
            document.getElementById('historyTableBody').innerHTML = `
                <tr><td colspan="3" class="p-4 text-center text-gray-400">Nenhum registro para esta plantação.</td></tr>
            `;
        }
    } catch (erro){
        console.error("Erro ao comunicar com o backend:", erro)
        atualizarStatusConexao(false);
    }
}

window.onload = inicializarDashboard;