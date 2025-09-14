import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidosService } from '\.\.\/\.\.\/\.\.\/\.\.\/services/pedidos.service';
import { Pedido, StatusPedido } from '\.\.\/\.\.\/\.\.\/\.\.\/models/pedido.model';

@Component({
  selector: 'app-pedido-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pedido-detail-container">
      <div class="detail-header">
        <div class="header-info">
          <h2>Pedido {{ pedido?.numero }}</h2>
          <span class="status-badge" [ngClass]="getStatusClass(pedido?.status)">
            {{ getStatusText(pedido?.status) }}
          </span>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" (click)="voltar()">Voltar</button>
          <button *ngIf="canEdit()" class="btn btn-primary" (click)="editar()">Editar</button>
        </div>
      </div>

      <div *ngIf="pedido" class="detail-content">
        <!-- Informações do Cliente -->
        <div class="info-section">
          <h3>Cliente</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Nome:</label>
              <span>{{ pedido.cliente?.nome }}</span>
            </div>
            <div class="info-item">
              <label>CPF:</label>
              <span>{{ formatarCPF(pedido.cliente?.documento) }}</span>
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span>{{ pedido.cliente?.email }}</span>
            </div>
            <div class="info-item">
              <label>Telefone:</label>
              <span>{{ pedido.cliente?.telefone }}</span>
            </div>
          </div>
        </div>

        <!-- Itens do Pedido -->
        <div class="info-section">
          <h3>Itens do Pedido</h3>
          <div class="itens-table">
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>SKU</th>
                  <th>Qtd</th>
                  <th>Preço Unit.</th>
                  <th>Desconto</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of pedido.itens">
                  <td>{{ item.produto?.nome }}</td>
                  <td>{{ item.produto?.sku }}</td>
                  <td>{{ item.quantidade }}</td>
                  <td>{{ item.precoUnitario | currency:'BRL' }}</td>
                  <td>{{ item.desconto | currency:'BRL' }}</td>
                  <td>{{ item.valorLiquido | currency:'BRL' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Cupom -->
        <div class="info-section" *ngIf="pedido.cupom">
          <h3>Cupom Aplicado</h3>
          <div class="cupom-info">
            <strong>{{ pedido.cupom }}</strong>
            <span class="desconto-cupom" *ngIf="pedido.cupomObj">
              {{ getDescontoCupomText(pedido.cupomObj) }}
            </span>
          </div>
        </div>

        <!-- Resumo Financeiro -->
        <div class="info-section">
          <h3>Resumo Financeiro</h3>
          <div class="resumo-financeiro">
            <div class="resumo-item">
              <span>Total Bruto:</span>
              <span>{{ pedido.totalBruto | currency:'BRL' }}</span>
            </div>
            <div class="resumo-item" *ngIf="pedido.desconto > 0">
              <span>Desconto:</span>
              <span>-{{ pedido.desconto | currency:'BRL' }}</span>
            </div>
            <div class="resumo-item total">
              <span>Total Líquido:</span>
              <span>{{ pedido.totalLiquido | currency:'BRL' }}</span>
            </div>
          </div>
        </div>

        <!-- Informações do Pedido -->
        <div class="info-section">
          <h3>Informações do Pedido</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Data de Criação:</label>
              <span>{{ pedido.criadoEm | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="info-item" *ngIf="pedido.numeroNota">
              <label>Número da Nota:</label>
              <span>{{ pedido.numeroNota }}</span>
            </div>
          </div>
        </div>

        <!-- Lançamentos -->
        <div class="info-section" *ngIf="pedido.lancamentos && pedido.lancamentos.length > 0">
          <h3>Lançamentos</h3>
          <div class="lancamentos-table">
            <table>
              <thead>
                <tr>
                  <th>Parcela</th>
                  <th>Vencimento</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let lancamento of pedido.lancamentos">
                  <td>{{ lancamento.parcela }}</td>
                  <td>{{ lancamento.vencimento | date:'dd/MM/yyyy' }}</td>
                  <td>{{ lancamento.valor | currency:'BRL' }}</td>
                  <td>
                    <span class="status-badge" [ngClass]="getLancamentoStatusClass(lancamento.status)">
                      {{ getLancamentoStatusText(lancamento.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./pedido-detail.component.scss']
})
export class PedidoDetailComponent implements OnInit {
  pedido: Pedido | null = null;
  StatusPedido = StatusPedido;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidosService: PedidosService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.carregarPedido(id);
      }
    });
  }

  carregarPedido(id: number) {
    this.pedidosService.getPedido(id).subscribe({
      next: (pedido) => this.pedido = pedido,
      error: (error) => {
        console.error('Erro ao carregar pedido:', error);
        alert('Erro ao carregar pedido.');
      }
    });
  }

  voltar() {
    this.router.navigate(['/pedidos']);
  }

  editar() {
    if (this.pedido) {
      this.router.navigate(['/pedidos/editar', this.pedido.id]);
    }
  }

  canEdit(): boolean {
    return this.pedido?.status === StatusPedido.Rascunho || this.pedido?.status === StatusPedido.Confirmado;
  }

  getStatusText(status?: StatusPedido): string {
    switch (status) {
      case StatusPedido.Rascunho: return 'Rascunho';
      case StatusPedido.Confirmado: return 'Confirmado';
      case StatusPedido.Cancelado: return 'Cancelado';
      case StatusPedido.Faturado: return 'Faturado';
      default: return 'Desconhecido';
    }
  }

  getStatusClass(status?: StatusPedido): string {
    switch (status) {
      case StatusPedido.Rascunho: return 'status-rascunho';
      case StatusPedido.Confirmado: return 'status-confirmado';
      case StatusPedido.Cancelado: return 'status-cancelado';
      case StatusPedido.Faturado: return 'status-faturado';
      default: return 'status-desconhecido';
    }
  }

  getLancamentoStatusText(status: any): string {
    switch (status) {
      case 0: return 'Aguardando';
      case 1: return 'Parcial';
      case 2: return 'Baixado';
      case 3: return 'Cancelado';
      default: return 'Desconhecido';
    }
  }

  getLancamentoStatusClass(status: any): string {
    switch (status) {
      case 0: return 'status-aguardando';
      case 1: return 'status-parcial';
      case 2: return 'status-baixado';
      case 3: return 'status-cancelado';
      default: return 'status-desconhecido';
    }
  }

  getDescontoCupomText(cupom: any): string {
    if (cupom.tipoDesconto === 0) { // ValorFixo
      return `R$ ${cupom.valorDesconto.toFixed(2)}`;
    } else { // Porcentagem
      return `${cupom.valorDesconto}%`;
    }
  }

  formatarCPF(cpf?: number): string {
    if (!cpf) return '';
    const cpfStr = cpf.toString().padStart(11, '0');
    return cpfStr.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}
