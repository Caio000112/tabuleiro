const tabuleiro = document.getElementById('tabuleiro');

// Cria o tabuleiro com casas claras e escuras
for (let i = 0; i < 64; i++) {
  const casa = document.createElement('div');
  casa.classList.add('casa');
  const linha = Math.floor(i / 8);
  const coluna = i % 8;
  casa.dataset.linha = linha;
  casa.dataset.coluna = coluna;
  casa.classList.add((linha + coluna) % 2 === 0 ? 'clara' : 'escura');
  tabuleiro.appendChild(casa);
}

// Cria as peças
const reiBranco = document.createElement('div');
reiBranco.classList.add('peca');
reiBranco.textContent = '♔';
reiBranco.dataset.tipo = 'rei';

const torrePreta = document.createElement('div');
torrePreta.classList.add('peca');
torrePreta.textContent = '♜';
torrePreta.dataset.tipo = 'torre';

// Coloca as peças nas casas iniciais
tabuleiro.children[60].appendChild(reiBranco); // h1
tabuleiro.children[0].appendChild(torrePreta); // a8

let pecaSelecionada = null;
let casaOrigem = null;

document.addEventListener('mousedown', e => {
  if (e.target.classList.contains('peca')) {
    pecaSelecionada = e.target;
    casaOrigem = pecaSelecionada.parentElement;
    pecaSelecionada.style.position = 'absolute';
    pecaSelecionada.style.zIndex = '1000';
  }
});

document.addEventListener('mousemove', e => {
  if (pecaSelecionada) {
    pecaSelecionada.style.left = e.pageX - 30 + 'px';
    pecaSelecionada.style.top = e.pageY - 30 + 'px';
  }
});

document.addEventListener('mouseup', e => {
  if (!pecaSelecionada) return;

  const elementos = document.elementsFromPoint(e.clientX, e.clientY);
  const casaAlvo = elementos.find(el => el.classList.contains('casa'));

  if (casaAlvo && movimentoValido(pecaSelecionada, casaOrigem, casaAlvo)) {
    casaAlvo.appendChild(pecaSelecionada);
  } else {
    casaOrigem.appendChild(pecaSelecionada); // Volta para a origem
  }

  pecaSelecionada.style.position = 'static';
  pecaSelecionada.style.zIndex = '';
  pecaSelecionada = null;
  casaOrigem = null;
});

// Função para validar o movimento
function movimentoValido(peca, origem, destino) {
  const tipo = peca.dataset.tipo;
  const linhaOrigem = parseInt(origem.dataset.linha);
  const colunaOrigem = parseInt(origem.dataset.coluna);
  const linhaDestino = parseInt(destino.dataset.linha);
  const colunaDestino = parseInt(destino.dataset.coluna);

  const deltaLinha = Math.abs(linhaDestino - linhaOrigem);
  const deltaColuna = Math.abs(colunaDestino - colunaOrigem);

  if (tipo === 'rei') {
    // Rei: 1 casa em qualquer direção
    return deltaLinha <= 1 && deltaColuna <= 1;
  }

  if (tipo === 'torre') {
    // Torre: movimento apenas na mesma linha ou coluna
    return (linhaDestino === linhaOrigem || colunaDestino === colunaOrigem);
  }

  return false;
}
