let remuneracaoEl;
let primiciaEl;
let dizimoEl;
let ofertaMinisterioSocorroEl;
let ofertaGratidaoEl;
let semeaduraEl;
let ofertaIsraelEl;
let totalContribuicaoEl;

function inicializa() {
  console.log("Inicializando...");

  remuneracaoEl = document.querySelector(
    "[name='remuneracao']:not([style*='display: none'])"
  );
  totalContribuicaoEl = document.querySelector(
    "[name='total-contribuicao']:not([style*='display: none'])"
  );

  primiciaEl = document.getElementById("primicia");
  dizimoEl = document.getElementById("dizimo");
  ofertaMinisterioSocorroEl = document.getElementById("oferta_minis_socorro");
  ofertaGratidaoEl = document.getElementById("oferta_gratidao");
  semeaduraEl = document.getElementById("semeadura");
  ofertaIsraelEl = document.getElementById("oferta_israel");

  console.log(remuneracaoEl, primiciaEl, dizimoEl); // Verificando se os elementos foram encontrados

  const tributosElements = [
    primiciaEl,
    dizimoEl,
    ofertaMinisterioSocorroEl,
    ofertaGratidaoEl,
    semeaduraEl,
    ofertaIsraelEl,
  ];

  // Adicionando ouvintes de evento com funções tradicionais para evitar escopo quebrado no Safari
  remuneracaoEl.addEventListener("input", function (event) {
    event.target.value = formatarValor(event.target.value);
    calculaTributos();
  });

  tributosElements.forEach(function (el) {
    el.addEventListener("input", function (event) {
      event.target.value = formatarValor(event.target.value);
      calculaTotalContribuicao();
    });
  });
}

// Verificando suporte ao Intl.NumberFormat
if (!Intl || !Intl.NumberFormat) {
  alert("Seu navegador não suporta formatação numérica.");
}

function formatarNumero(numero) {
  return Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numero);
}

function formatarValor(valor) {
  if (typeof valor === "string") {
    valor = valor.replace(/\D/g, "");
  }

  if (valor === "") return "0,00";

  const numeroFormatado = parseFloat(valor) / 100;
  return formatarNumero(numeroFormatado);
}

function valorCalculavel(valor) {
  return parseFloat(valor.replace(/[R$\s.]/g, "").replace(",", ".")) || 0;
}

function calculaContribuicao(valor, percentual) {
  return Math.ceil(parseFloat(valor) * (percentual / 100));
}

function calculaPrimicia(remuneracao) {
  const primicia = calculaContribuicao(remuneracao, 100 / 30);
  primiciaEl.value = formatarNumero(primicia);
  return valorCalculavel(primiciaEl.value);
}

function calculaDizimo(remuneracao, primicia) {
  const dizimo = calculaContribuicao(remuneracao - primicia, 10);
  dizimoEl.value = formatarNumero(dizimo);
  return valorCalculavel(dizimoEl.value);
}

function calculaOfertas(remuneracao) {
  const taxas = {
    ofertaMinisterioSocorro: 1,
    ofertaGratidao: 0.1,
    semeadura: 0.4,
    ofertaIsrael: 0.8,
  };

  ofertaMinisterioSocorroEl.value = formatarNumero(
    calculaContribuicao(remuneracao, taxas.ofertaMinisterioSocorro)
  );
  ofertaGratidaoEl.value = formatarNumero(
    calculaContribuicao(remuneracao, taxas.ofertaGratidao)
  );
  semeaduraEl.value = formatarNumero(
    calculaContribuicao(remuneracao, taxas.semeadura)
  );
  ofertaIsraelEl.value = formatarNumero(
    calculaContribuicao(remuneracao, taxas.ofertaIsrael)
  );
}

function calculaTotalContribuicao() {
  const totalContribuicao =
    valorCalculavel(primiciaEl.value) +
    valorCalculavel(dizimoEl.value) +
    valorCalculavel(ofertaMinisterioSocorroEl.value) +
    valorCalculavel(ofertaGratidaoEl.value) +
    valorCalculavel(semeaduraEl.value) +
    valorCalculavel(ofertaIsraelEl.value);

  totalContribuicaoEl.value = formatarNumero(totalContribuicao);
}

function calculaTributos() {
  const remuneracao = valorCalculavel(remuneracaoEl.value) || 0;
  const primicia = calculaPrimicia(remuneracao);

  calculaDizimo(remuneracao, primicia);
  calculaOfertas(remuneracao);
  calculaTotalContribuicao();
}

// Garante que a inicialização será executada em qualquer estado de carregamento do DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializa);
} else {
  inicializa();
}
