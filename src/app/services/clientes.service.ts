import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Cliente } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  constructor(private api: ApiService) { }

  getClientes(): Observable<Cliente[]> {
    return this.api.get<any[]>('clientes').pipe(
      map(items => (items || []).map(this.mapBackendToCliente))
    );
  }

  getCliente(id: number): Observable<Cliente> {
    return this.api.get<any>(`clientes/${id}`).pipe(
      map(item => Array.isArray(item) ? (item[0] ? this.mapBackendToCliente(item[0]) : null) : this.mapBackendToCliente(item)),
      map(item => item as Cliente)
    );
  }

  criarCliente(cliente: Partial<Cliente>): Observable<Cliente> {
    const clienteBackend = {
      DOCUMENTO: cliente.documento,
      NOME: cliente.nome,
      EMAIL: cliente.email,
      ATIVO: cliente.ativo,
      TELEFONE: cliente.telefone
    };
    return this.api.post<any>('clientes', clienteBackend).pipe(map(this.mapBackendToCliente));
  }

  atualizarCliente(cliente: Partial<Cliente>): Observable<Cliente> {
    const clienteBackend = {
      ID: cliente.id,
      DOCUMENTO: cliente.documento,
      NOME: cliente.nome,
      EMAIL: cliente.email,
      ATIVO: cliente.ativo,
      TELEFONE: cliente.telefone
    };
    return this.api.put<any>('clientes/alterar', clienteBackend).pipe(map(this.mapBackendToCliente));
  }

  private mapBackendToCliente = (c: any): Cliente => ({
    id: c?.ID ?? c?.id,
    documento: Number(c?.DOCUMENTO ?? c?.documento ?? 0),
    nome: c?.NOME ?? c?.nome,
    email: c?.EMAIL ?? c?.email,
    ativo: Boolean(c?.ATIVO ?? c?.ativo),
    telefone: (c?.TELEFONE ?? c?.telefone ?? '').toString()
  });
}
