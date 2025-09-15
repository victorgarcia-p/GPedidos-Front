import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Cupom } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class CuponsService {
  constructor(private api: ApiService) { }

  getCupons(): Observable<Cupom[]> {
    return this.api.get<any[]>('cupons').pipe(
      map(items => (items || []).map(this.mapBackendToCupom))
    );
  }

  getCupom(codigo: string): Observable<Cupom> {
    return this.api.get<any>(`cupons/${codigo}`).pipe(
      map(item => Array.isArray(item) ? (item[0] ? this.mapBackendToCupom(item[0]) : null) : this.mapBackendToCupom(item)),
      map(item => item as Cupom)
    );
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
    return this.api.post<any>('cupons', cupomBackend).pipe(map(this.mapBackendToCupom));
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
    return this.api.put<any>('cupons/alterar', cupomBackend).pipe(map(this.mapBackendToCupom));
  }

  private mapBackendToCupom = (c: any): Cupom => ({
    codigo: c?.CODIGO ?? c?.codigo,
    tipoDesconto: c?.TIPO_DESCONTO ?? c?.tipoDesconto,
    valorDesconto: Number(c?.VALOR_DESCONTO ?? c?.valorDesconto ?? 0),
    validadeInicio: new Date(c?.VALIDADE_INICIO ?? c?.validadeInicio),
    validadeFim: new Date(c?.VALIDADE_FIM ?? c?.validadeFim),
    usoMaximo: Number(c?.USO_MAXIMO ?? c?.usoMaximo ?? 0)
  });
}
