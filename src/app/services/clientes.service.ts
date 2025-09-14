import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Cliente } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  constructor(private api: ApiService) { }

  getClientes(): Observable<Cliente[]> {
    return this.api.get<Cliente[]>('clientes');
  }

  getCliente(id: number): Observable<Cliente> {
    return this.api.get<Cliente>(`clientes/${id}`);
  }

  criarCliente(cliente: Partial<Cliente>): Observable<Cliente> {
    const clienteBackend = {
      DOCUMENTO: cliente.documento,
      NOME: cliente.nome,
      EMAIL: cliente.email,
      ATIVO: cliente.ativo,
      TELEFONE: cliente.telefone
    };
    return this.api.post<Cliente>('clientes', clienteBackend);
  }

  atualizarCliente(cliente: Partial<Cliente>): Observable<Cliente> {
    const clienteBackend = {
      DOCUMENTO: cliente.documento,
      NOME: cliente.nome,
      EMAIL: cliente.email,
      ATIVO: cliente.ativo,
      TELEFONE: cliente.telefone
    };
    return this.api.put<Cliente>('clientes', clienteBackend);
  }
}
