// Simulador de Sensor IoT (Envia dados falsos para a API a cada 3 segundos)

const URL_API = 'http://localhost:3000/api/sensores';

function gerarDadosFalsos() {
    // Gera uma temperatura entre 20°C e 30°C com 1 casa decimal
    const temperatura = Number((20 + Math.random() * 10).toFixed(1));
    
    // Gera uma umidade entre 40% e 70% com 1 casa decimal
    const umidade = Number((40 + Math.random() * 30).toFixed(1));

    return { temperatura, umidade };
}

async function enviarParaServidor() {
    const dados = gerarDadosFalsos();

    try {
        const resposta = await fetch(URL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();
        console.log('📡 [Simulador] Dado enviado com sucesso:', dados, '| Resposta do Servidor:', resultado);
    } catch (erro) {
        console.error('❌ [Simulador] Erro ao enviar dados. O servidor Node.js está ligado?', erro.message);
    }
}

// Dispara o envio a cada 3 segundos
console.log('Iniciando simulador de IoT...');
setInterval(enviarParaServidor, 3000);