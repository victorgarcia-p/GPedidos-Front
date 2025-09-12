export interface Pedido {
  id: number;
  numero: string;
  clienteId: number;
  itens: ItemPedido[];
  status: StatusPedido;
  cupomId?: string;
  totalBruto: number;
  desconto: number;
  totalLiquido: number;
  criadoEm: Date;
  numeroNota?: string;
  cliente?: Cliente;
  cupom?: Cupom;
  lancamentos?: Lancamento[];
}

export interface ItemPedido {
  id: number;
  produtoId: number;
  precoUnitario: number;
  quantidade: number;
  valorBruto: number;
  desconto: number;
  valorLiquido: number;
  pedidoId: number;
  produto?: Produto;
}

export enum StatusPedido {
  Rascunho = 0,
  Confirmado = 1,
  Cancelado = 2,
  Faturado = 3
}

export interface Cliente {
  id: number;
  documento: number;
  nome: string;
  email: string;
  ativo: boolean;
  telefone: string;
}

export interface Produto {
  id: number;
  sku: string;
  nome: string;
  precoUnitario: number;
  ativo: boolean;
  estoque: number;
  estoqueSeparacao: number;
  estoqueAtual: number;
}

export interface Cupom {
  codigo: string;
  tipoDesconto: TipoDesconto;
  valorDesconto: number;
  validadeInicio: Date;
  validadeFim: Date;
  usoMaximo: number;
}

export enum TipoDesconto {
  ValorFixo = 0,
  Porcentagem = 1
}

export interface Lancamento {
  id: number;
  parcela: number;
  pedidoId: number;
  vencimento: Date;
  valor: number;
  status: StatusLancamento;
  pedido?: Pedido;
  baixas?: Baixa[];
}

export enum StatusLancamento {
  Aguardando = 0,
  Parcial = 1,
  Baixado = 2,
  Cancelado = 3
}

export interface Baixa {
  id: number;
  lancamentoId: number;
  lancamentoParcela: number;
  dataBaixa: Date;
  valorBaixa: number;
  statusBaixa: StatusBaixa;
  lancamento?: Lancamento;
}

export enum StatusBaixa {
  Parcial = 0,
  Baixado = 1,
  Cancelado = 2
}
