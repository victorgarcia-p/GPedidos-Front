import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Pedido, ItemPedido, StatusPedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  constructor(private api: ApiService) { }

  getPedidos(): Observable<Pedido[]> {
    return this.api.get<Pedido[]>('pedidos');
  }

  getPedido(id: number): Observable<Pedido> {
    return this.api.get<Pedido>(`pedidos/${id}`);
  }

  criarPedido(pedido: Partial<Pedido>): Observable<Pedido> {
    // Converter dados do frontend para o formato do backend
    const pedidoBackend = {
      CLIENTE_ID: pedido.clienteId,
      ITENS: pedido.itens?.map(item => ({
        PRODUTO_ID: item.produtoId,
        PRECO_UNITARIO: item.precoUnitario,
        QUANTIDADE: item.quantidade,
        VALOR_BRUTO: item.valorBruto,
        DESCONTO: item.desconto,
        VALOR_LIQUIDO: item.valorLiquido
      })) || [],
      STATUS: pedido.status,
      CUPOM: pedido.cupom,
      TOTAL_BRUTO: pedido.totalBruto,
      DESCONTO: pedido.desconto,
      TOTAL_LIQUIDO: pedido.totalLiquido,
      PAGAMENTOS: [] // Por enquanto vazio
    };
    
    console.log('Enviando dados do pedido para o backend:', pedidoBackend);
    return this.api.post<Pedido>('pedidos', pedidoBackend);
  }

  cancelarPedido(id: number): Observable<Pedido> {
    return this.api.put<Pedido>(`pedidos/cancelar/${id}`, {});
  }

  faturarPedido(id: number): Observable<Pedido> {
    return this.api.put<Pedido>(`pedidos/faturar/${id}`, {});
  }

  definirPedidoOuPreVenda(id: number): Observable<Pedido> {
    return this.api.put<Pedido>(`pedidos/alterar/${id}`, {});
  }
}
