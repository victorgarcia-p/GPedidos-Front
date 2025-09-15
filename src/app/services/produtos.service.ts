import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Produto } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  constructor(private api: ApiService) { }

  getProdutos(): Observable<Produto[]> {
    return this.api.get<any[]>('produtos').pipe(
      map(items => (items || []).map(this.mapBackendToProduto))
    );
  }

  getProduto(id: number): Observable<Produto> {
    return this.api.get<any>(`produtos/${id}`).pipe(
      map(item => Array.isArray(item) ? (item[0] ? this.mapBackendToProduto(item[0]) : null) : this.mapBackendToProduto(item)),
      map(item => item as Produto)
    );
  }

  criarProduto(produto: Partial<Produto>): Observable<Produto> {
    const produtoBackend = {
      SKU: produto.sku,
      NOME: produto.nome,
      PRECO_UNITARIO: produto.precoUnitario,
      ATIVO: produto.ativo,
      ESTOQUE: produto.estoque,
      ESTOQUE_SEPARACAO: produto.estoqueSeparacao ?? 0,
      ESTOQUE_ATUAL: produto.estoqueAtual ?? produto.estoque ?? 0
    };
    return this.api.post<any>('produtos', produtoBackend).pipe(map(this.mapBackendToProduto));
  }

  atualizarProduto(produto: Partial<Produto>): Observable<Produto> {
    const produtoBackend = {
      ID: produto.id,
      SKU: produto.sku,
      NOME: produto.nome,
      PRECO_UNITARIO: produto.precoUnitario,
      ATIVO: produto.ativo,
      ESTOQUE: produto.estoque,
      ESTOQUE_SEPARACAO: produto.estoqueSeparacao ?? 0,
      ESTOQUE_ATUAL: produto.estoqueAtual ?? produto.estoque ?? 0
    };
    return this.api.put<any>('produtos/alterar', produtoBackend).pipe(map(this.mapBackendToProduto));
  }

  private mapBackendToProduto = (p: any): Produto => ({
    id: p?.ID ?? p?.id,
    sku: p?.SKU ?? p?.sku,
    nome: p?.NOME ?? p?.nome,
    precoUnitario: this.toNumber(p?.PRECO_UNITARIO ?? p?.precoUnitario ?? 0),
    ativo: Boolean(p?.ATIVO ?? p?.ativo),
    estoque: this.toNumber(p?.ESTOQUE ?? p?.estoque ?? 0),
    estoqueSeparacao: this.toNumber(p?.ESTOQUE_SEPARACAO ?? p?.estoqueSeparacao ?? 0),
    estoqueAtual: this.toNumber(p?.ESTOQUE_ATUAL ?? p?.estoqueAtual ?? p?.ESTOQUE ?? p?.estoque ?? 0)
  });

  private toNumber(value: any): number {
    if (typeof value === 'number') return isFinite(value) ? value : 0;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      // Handle comma decimal (e.g., "10,50") and strip thousands separators
      const normalized = trimmed
        .replace(/\.(?=\d{3}(\D|$))/g, '') // remove thousands dots
        .replace(/,(?=\d{1,2}$)/, '.') // last comma as decimal
        .replace(/[^0-9.\-]/g, '');
      const parsed = parseFloat(normalized);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }
}
