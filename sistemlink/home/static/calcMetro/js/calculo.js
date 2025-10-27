// Objeto global para armazenar os dados de cada tipo de adesivo
let adesivos = {};

// ----------------------------------------------------
// 1. FUNÇÃO DE ADICIONAR ADESIVO
// ----------------------------------------------------
function adicionarAdesivo() {
	const container = document.getElementById('adesivosContainer');
	const index = document.querySelectorAll('.adesivo').length;

	const div = document.createElement('div');
	div.className = 'adesivo';
	div.dataset.index = index;

	div.innerHTML = `
    <h3>Adesivo ${index + 1}</h3>
    <button type="button" onclick="removerAdesivo(this)" class="btn-remover">Remover Adesivo</button>
    <label>Nome da Peça:</label>
    <input type="text" class="nome-adesivo" name="nome" value="Adesivo-1" required />
    <label>Adesivos por veículo:</label>
    <input type="number" class="por-veiculo" name="porVeiculo" value="1" min="1" required />
    <label>Largura do adesivo (cm):</label>
    <input type="number" class="largura-adesivo" name="largura" value="10" min="1" required />
    <label>Altura do adesivo (cm):</label>
    <input type="number" class="altura-adesivo" name="altura" value="10" min="1" required />
    <hr>
  `;

	container.appendChild(div);

	// HABILITA O BOTÃO DESFAZER
	const btnDesfazer = document.getElementById('btnDesfazer');
	if (btnDesfazer) {
		btnDesfazer.disabled = false;
	}
}

function desfazerAdicao() {
	const container = document.getElementById('adesivosContainer');
	const adesivosAtuais = container.querySelectorAll('.adesivo');

	// 1. Verifica se há adesivos para remover
	if (adesivosAtuais.length > 0) {
		// Seleciona o ÚLTIMO adesivo na lista (o mais recente)
		const ultimoAdesivo = adesivosAtuais[adesivosAtuais.length - 1];

		// Remove o último adesivo do DOM
		ultimoAdesivo.remove();

		// 2. Atualiza o estado do botão Desfazer
		// Desabilita se não houver mais adesivos
		if (adesivosAtuais.length - 1 === 0) {
			document.getElementById('btnDesfazer').disabled = true;
		}

		// 3. Opcional: Recalcula a área se for relevante
		if (adesivosAtuais.length - 1 > 0) {
			calcular();
		} else {
			document.getElementById('resultado').innerHTML = ''; // Limpa o resultado
		}
	} else {
		// Se já não houver adesivos, desabilita o botão por segurança
		document.getElementById('btnDesfazer').disabled = true;
	}
}

// A função removerAdesivo(this) ainda é útil para remoção individual
function removerAdesivo(buttonElement) {
	const adesivoDiv = buttonElement.closest('.adesivo');

	if (adesivoDiv) {
		adesivoDiv.remove();

		// Atualiza o estado do botão Desfazer (se o último foi removido manualmente)
		const adesivosRestantes = document
			.getElementById('adesivosContainer')
			.querySelectorAll('.adesivo').length;
		if (adesivosRestantes === 0) {
			document.getElementById('btnDesfazer').disabled = true;
			document.getElementById('resultado').innerHTML = '';
		} else {
			// Recalcula o resultado, pois o layout mudou
			calcular();
		}
	}
}

const salvaObjAdesivo = () => {
	const adesivoDivs = document.querySelectorAll('.adesivo');
	const resultadoObj = {};

	adesivoDivs.forEach((div) => {
		// Acessa os campos do adesivo
		const nomeInput = div.querySelector('input[name="nome"]');
		const larguraInput = div.querySelector('input[name="largura"]');
		const alturaInput = div.querySelector('input[name="altura"]');
		const porVeiculoInput = div.querySelector('input[name="porVeiculo"]');

		if (!nomeInput || !larguraInput || !alturaInput || !porVeiculoInput) {
			console.error('Erro: um ou mais campos não foram encontrados.');
			return;
		}

		const nome = nomeInput.value.trim();
		const largura = parseFloat(larguraInput.value);
		const altura = parseFloat(alturaInput.value);
		const porVeiculo = parseInt(porVeiculoInput.value);

		// Validação
		if (
			!nome ||
			isNaN(largura) ||
			largura <= 0 ||
			isNaN(altura) ||
			altura <= 0 ||
			isNaN(porVeiculo) ||
			porVeiculo <= 0
		) {
			console.warn('Adesivo ignorado devido a dados inválidos:', nome);
			return;
		}

		// Se a largura for maior que 130, divide em partes
		if (largura > 130) {
			const partes = Math.ceil(largura / 125);
			const larguraDividida = largura / partes;

			for (let i = 1; i <= partes; i++) {
				const nomeParte = `${nome} ${i}`;
				resultadoObj[nomeParte] = {
					nome: nomeParte,
					largura: larguraDividida.toFixed(2),
					altura,
					porVeiculo,
				};
			}
		} else {
			// Caso não precise dividir
			resultadoObj[nome] = { nome, largura, altura, porVeiculo };
		}
	});

	return resultadoObj;
};

function calcularOtimizado(adesivos, quantVeiculos, larguraMaterial = 130) {
	//Cria um array de objetos de adesivos
	let listaAdesivos = [];

	/*	
		Percorre o objeto global de adesivos buscando o nome e quantidade por veículo,
		multiplicando pela quantidade de veículos para obter o total de cada adesivo necessário.
		Adiciona cada adesivo ao array 'listaAdesivos' com suas dimensões , 
		baseado na quantidade de adesivos necessarios.
	*/
	for (const nome in adesivos) {
		const adesivo = adesivos[nome];
		const total = adesivo.porVeiculo * quantVeiculos;
		for (let i = 0; i < total; i++) {
			listaAdesivos.push({
				nome: adesivo.nome,
				largura: adesivo.largura + 1, // margem
				altura: adesivo.altura + 1, // margem
			});
		}
	}

	listaAdesivos.sort((a, b) => b.largura - a.largura);

	// Cria um array para armazenar as linhas de adesivos
	let linhas = [];
	// Cria um objeto para a linha atual
	let linhaAtual = { larguraUsadaAtual: 0, alturaAtual: 0, adesivos: [] };

	// Percorre a lista de adesivos
	for (const adesivo of listaAdesivos) {
		// Verifica se o adesivo cabe na linha atual baseado na largura atual + largura do adesivo
		if (linhaAtual.larguraUsadaAtual + adesivo.largura <= larguraMaterial) {
			// Adiciona a largura do adesiva à largura usada da linha atual
			linhaAtual.larguraUsadaAtual += adesivo.largura;
			// Verifica se altura do adesivo é maior que a altura atual da linha , e escolhe a maior para ser a nova altura da linha
			console.log(` altura Atual ${linhaAtual.alturaAtual}`);
			linhaAtual.alturaAtual = Math.max(linhaAtual.alturaAtual, adesivo.altura);
			linhaAtual.adesivos.push(adesivo);
		} else {
			// Adiciona a linha atual ao array de linhas
			linhas.push(linhaAtual);
			linhaAtual = {
				larguraUsadaAtual: adesivo.largura,
				alturaAtual: adesivo.altura,
				adesivos: [adesivo],
			};
		}
	}
	// Adiciona a última linha se tiver adesivos
	if (linhaAtual.adesivos.length > 0) {
		linhas.push(linhaAtual);
	}

	// Calcular altura total somando a altura de cada linha
	const alturaTotal = linhas.reduce(
		(SomaValorAltura, linha) => SomaValorAltura + linha.alturaAtual,
		0
	);

	// Retorna resumo
	return {
		linhas,
		alturaTotal,
	};
}

function calcular() {
	const quantVeiculos = parseInt(
		document.getElementById('quantidadeVeiculos').value
	);
	const larguraMaterial = 130;

	if (isNaN(quantVeiculos) || quantVeiculos <= 0) {
		alert('Por favor, insira a Quantidade de Veículos corretamente.');
		return;
	}

	adesivos = salvaObjAdesivo();
	if (Object.keys(adesivos).length === 0) {
		document.getElementById('resultado').innerHTML =
			"<p class='warning'>Nenhum adesivo válido encontrado para cálculo.</p>";
		return;
	}

	const resultado = calcularOtimizado(adesivos, quantVeiculos, larguraMaterial);
	console.log('Resultado do cálculo otimizado:', resultado);

	let resumoHTML = '';
	resultado.linhas.forEach((linha, i) => {
		resumoHTML += `
      <li>
        <strong>Linha ${i + 1}</strong> 
        (largura usada: ${linha.larguraUsadaAtual} cm, altura: ${
			linha.alturaAtual
		} cm)
        <ul>
          ${linha.adesivos
						.map(
							(ad) =>
								`<li>${ad.nome} (${ad.largura - 1}x${ad.altura - 1} cm)</li>`
						)
						.join('')}
        </ul>
      </li>
    `;
	});

	const area_em_cm2 = resultado.alturaTotal * larguraMaterial;
	// Calcular área total (m²)
	const areaTotal_m2 = (area_em_cm2 / 10000).toFixed(2);

	// Exibir resultado
	document.getElementById('resultado').innerHTML = `
    <div class="result-box">
      <div class="final-result">
        <h3>Resultado Final da Impressão</h3>
        <p>Área Total de Impressão:</p>
        <div class="value-box area-value"><strong>${areaTotal_m2}m²</strong></div>
      </div>

      <p class="nota">
        <em>Nota: Os cálculos consideram uma margem de segurança de 1cm em altura e largura para cortes.</em>
      </p>

      <h2>📊 Resumo do Cálculo</h2>
      <div class="section">
        <h3>Dados Gerais do Projeto</h3>
        <p><strong>Total de Veículos:</strong> ${quantVeiculos}</p>
        <p>
          <strong>Altura Total Necessária:</strong> 
          <span class='height-detail' style='font-size:1.1em;'>${resultado.alturaTotal} cm</span>
        </p>
      </div>

      <div class="section">
        <h3>Distribuição Otimizada por Linha</h3>
        <ul class="adesivo-list">${resumoHTML}</ul> 
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 6. BLOCO DE INICIALIZAÇÃO (EXECUTA APENAS UMA VEZ NA CARGA DA PÁGINA)
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
	// Esta chamada ocorre APENAS na carga da página, adicionando o primeiro adesivo.
	adicionarAdesivo();

	// Desabilita o botão 'Desfazer Adição' inicialmente, pois não há o que desfazer.
	const btnDesfazer = document.getElementById('btnDesfazer');
	if (btnDesfazer) {
		btnDesfazer.disabled = true;
	}
});
