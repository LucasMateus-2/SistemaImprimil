document.addEventListener('DOMContentLoaded', () => {
	// bobina.js

	const pi = Math.PI;

	// Função principal equivalente ao calc_met_bobina
	function calcMetBobina(D, d, T) {
		return (pi * (D ** 2 - d ** 2)) / (4 * T * 1000);
	}

	// Função para calcular metragem final com largura
	function calcularMetragem(D, d, T, largura) {
		const metros = calcMetBobina(D, d, T);
		return Math.round(metros / largura);
	}

	const $ = (id) => document.getElementById(id);

	$('btnCalc').addEventListener('click', () => {
		try {
			const D = parseFloat($('D').value);
			const d = parseFloat($('d').value);
			const T = parseFloat($('T').value);
			const largura = parseFloat($('larguraMaterial')?.value || '130');

			if ([D, d, T, largura].some((v) => isNaN(v))) {
				throw new Error('Preencha todos os campos com valores numéricos.');
			}

			if (D <= d) throw new Error('D deve ser maior que d.');
			if (T <= 0 || largura <= 0)
				throw new Error('T e largura devem ser maiores que zero.');

			const resultado = calcularMetragem(D, d, T, largura);
			$('resultado').textContent = `Resultado L: ${resultado} metros`;
			$('error').textContent = '';
		} catch (e) {
			$('resultado').textContent = 'Resultado L: —';
			$('error').textContent = e.message;
		}
	});

	$('btnClear').addEventListener('click', () => {
		['D', 'd', 'T'].forEach((id) => ($(id).value = ''));
		$('resultado').textContent = 'Resultado L: —';
		$('error').textContent = '';
		$('D').focus();
	});
});
