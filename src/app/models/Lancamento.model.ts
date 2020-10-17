export interface Lancamento {
  lancamentoContaCorrenteCliente: {
    numeroRemessaBanco: number;
    nomeSituacaoRemessa: number;
    dadosDomicilioBancario: {
      codigoBanco: number;
      numeroAgencia: number;
      numeroContaCorrente: number;
    };
    nomeTipoOperacao: number
  };
  dataEfetivaLancamento: string;
  dataLancamentoContaCorrenteCliente: string;
  numeroEvento: number;
  descricaoGrupoPagamento: string;
  codigoIdentificadorUnico: string;
  nomeBanco: string;
  quantidadeLancamentoRemessa: number;
  numeroRaizCNPJ: string;
  numeroSufixoCNPJ: string;
  valorLancamentoRemessa: number;
  dateLancamentoContaCorrenteCliente: number;
  dateEfetivaLancamento: number;
}
