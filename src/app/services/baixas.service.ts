import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Baixa } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class BaixasService {
  constructor(private api: ApiService) { }

  getBaixas(): Observable<Baixa[]> {
    return this.api.get<Baixa[]>('baixas');
  }

  getBaixa(id: number): Observable<Baixa> {
    return this.api.get<Baixa>(`baixas/${id}`);
  }

  cancelarBaixa(id: number): Observable<Baixa> {
    return this.api.put<Baixa>(`baixas/cancelar/${id}`, {});
  }
}
