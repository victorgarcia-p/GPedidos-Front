import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Produto } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  constructor(private api: ApiService) { }

  getProdutos(): Observable<Produto[]> {
    return this.api.get<Produto[]>('produtos');
  }

  getProduto(id: number): Observable<Produto> {
    return this.api.get<Produto>(`produtos/${id}`);
  }

  criarProduto(produto: Partial<Produto>): Observable<Produto> {
    const produtoBackend = {
      SKU: produto.sku,
      NOME: produto.nome,
      PRECO_UNITARIO: produto.precoUnitario,
      ATIVO: produto.ativo,
      ESTOQUE: produto.estoque
    };
    return this.api.post<Produto>('produtos', produtoBackend);
  }

  atualizarProduto(produto: Partial<Produto>): Observable<Produto> {
    const produtoBackend = {
      SKU: produto.sku,
      NOME: produto.nome,
      PRECO_UNITARIO: produto.precoUnitario,
      ATIVO: produto.ativo,
      ESTOQUE: produto.estoque
    };
    return this.api.put<Produto>('produtos', produtoBackend);
  }
}
