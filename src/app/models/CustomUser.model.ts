export interface CustomUser {
  dados_pessoais: {
    email: string;
    nascimento: any;
    nome: string;
  }
  indice: number;
  tamanhoPagina: number;
  totalElements: number;
  totalControleLancamento: {
    quantidadeLancamentos: number;
    quantidadeRemessas: number;
    valorLancamentos: number;
  };
  lancamentos: any[];
}
