import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Cupom } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class CuponsService {
  constructor(private api: ApiService) { }

  getCupons(): Observable<Cupom[]> {
    return this.api.get<Cupom[]>('cupons');
  }

  getCupom(codigo: string): Observable<Cupom> {
    return this.api.get<Cupom>(`cupons/${codigo}`);
  }

  criarCupom(cupom: Partial<Cupom>): Observable<Cupom> {
    return this.api.post<Cupom>('cupons', cupom);
  }

  atualizarCupom(codigo: string, cupom: Partial<Cupom>): Observable<Cupom> {
    return this.api.put<Cupom>(`cupons/${codigo}`, cupom);
  }

  excluirCupom(codigo: string): Observable<void> {
    return this.api.delete<void>(`cupons/${codigo}`);
  }
}
