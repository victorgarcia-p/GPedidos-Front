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
    return this.api.post<Produto>('produtos', produto);
  }

  atualizarProduto(id: number, produto: Partial<Produto>): Observable<Produto> {
    return this.api.put<Produto>(`produtos/${id}`, produto);
  }

  excluirProduto(id: number): Observable<void> {
    return this.api.delete<void>(`produtos/${id}`);
  }
}
