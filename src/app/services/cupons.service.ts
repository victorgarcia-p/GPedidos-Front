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
    const cupomBackend = {
      CODIGO: cupom.codigo,
      TIPO_DESCONTO: cupom.tipoDesconto,
      VALOR_DESCONTO: cupom.valorDesconto,
      VALIDADE_INICIO: cupom.validadeInicio,
      VALIDADE_FIM: cupom.validadeFim,
      USO_MAXIMO: cupom.usoMaximo
    };
    return this.api.post<Cupom>('cupons', cupomBackend);
  }

  atualizarCupom(cupom: Partial<Cupom>): Observable<Cupom> {
    const cupomBackend = {
      CODIGO: cupom.codigo,
      TIPO_DESCONTO: cupom.tipoDesconto,
      VALOR_DESCONTO: cupom.valorDesconto,
      VALIDADE_INICIO: cupom.validadeInicio,
      VALIDADE_FIM: cupom.validadeFim,
      USO_MAXIMO: cupom.usoMaximo
    };
    return this.api.put<Cupom>('cupons', cupomBackend);
  }
}
