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

  getLancamento(id: number): Observable<Lancamento> {
    return this.api.get<Lancamento>(`lancamentos/${id}`);
  }

  baixarLancamento(dadosBaixa: any): Observable<any> {
    const lancamentoBackend = {
      ID: dadosBaixa.id,
      PARCELA: dadosBaixa.parcela,
      VALOR_BAIXADO: dadosBaixa.valorBaixa
    };
    return this.api.put<any>('lancamentos/baixar', lancamentoBackend);
  }

  cancelarLancamento(dadosLancamento: any): Observable<any> {
    const lancamentoBackend = {
      ID: dadosLancamento.id,
      PARCELA: dadosLancamento.parcela,
      VALOR_BAIXADO: 0
    };
    return this.api.put<any>('lancamentos/cancelar', lancamentoBackend);
  }
}
