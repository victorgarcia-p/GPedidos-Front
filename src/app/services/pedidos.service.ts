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
    return this.api.post<Pedido>('pedidos', pedido);
  }

  atualizarPedido(id: number, pedido: Partial<Pedido>): Observable<Pedido> {
    return this.api.put<Pedido>(`pedidos/${id}`, pedido);
  }

  cancelarPedido(id: number): Observable<Pedido> {
    return this.api.put<Pedido>(`pedidos/${id}/cancelar`, {});
  }

  baixarPedido(id: number, dadosPagamento: any): Observable<Pedido> {
    return this.api.put<Pedido>(`pedidos/${id}/baixar`, dadosPagamento);
  }

  faturarPedido(id: number): Observable<Pedido> {
    return this.api.put<Pedido>(`pedidos/${id}/faturar`, {});
  }

  adicionarItem(pedidoId: number, item: Partial<ItemPedido>): Observable<ItemPedido> {
    return this.api.post<ItemPedido>(`pedidos/${pedidoId}/itens`, item);
  }

  removerItem(pedidoId: number, itemId: number): Observable<void> {
    return this.api.delete<void>(`pedidos/${pedidoId}/itens/${itemId}`);
  }

  aplicarCupom(pedidoId: number, codigoCupom: string): Observable<Pedido> {
    return this.api.put<Pedido>(`pedidos/${pedidoId}/cupom`, { codigo: codigoCupom });
  }
}
