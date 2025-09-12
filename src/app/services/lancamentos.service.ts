import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Lancamento, Baixa } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class LancamentosService {
  constructor(private api: ApiService) { }

  getLancamentos(): Observable<Lancamento[]> {
    return this.api.get<Lancamento[]>('lancamentos');
  }

  getLancamento(id: number, parcela: number): Observable<Lancamento> {
    return this.api.get<Lancamento>(`lancamentos/${id}/${parcela}`);
  }

  baixarLancamento(id: number, parcela: number, dadosBaixa: Partial<Baixa>): Observable<Baixa> {
    return this.api.post<Baixa>(`lancamentos/${id}/${parcela}/baixar`, dadosBaixa);
  }

  cancelarLancamento(id: number, parcela: number): Observable<Lancamento> {
    return this.api.put<Lancamento>(`lancamentos/${id}/${parcela}/cancelar`, {});
  }
}
