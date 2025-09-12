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
    return this.api.post<Cliente>('clientes', cliente);
  }

  atualizarCliente(id: number, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.api.put<Cliente>(`clientes/${id}`, cliente);
  }

  excluirCliente(id: number): Observable<void> {
    return this.api.delete<void>(`clientes/${id}`);
  }
}
