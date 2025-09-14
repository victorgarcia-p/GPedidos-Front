import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PedidosService } from '../../../../services/pedidos.service';
import { Pedido, StatusPedido } from '../../../../models/pedido.model';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-pedidos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, ModalComponent],
  template: `
    <div class="pedidos-container">
      <app-data-table
        [data]="pedidos"
        [columns]="columns"
        title="Pedidos"
        addButtonText="Novo Pedido"
        [customActions]="customActions"
        (onAdd)="novoPedido()"
        (onEdit)="editarPedido($event)"
        (onDelete)="confirmarExclusao($event)">
        
        <ng-template #customActions let-pedido>
          <button class="btn btn-sm btn-info" (click)="verDetalhes(pedido)" title="Ver Detalhes">
            👁️
          </button>
          <button *ngIf="pedido.status === StatusPedido.Confirmado" 
                  class="btn btn-sm btn-success" 
                  (click)="baixarPedido(pedido)" 
                  title="Baixar Pedido">
            💰
          </button>
          <button *ngIf="pedido.status === StatusPedido.Confirmado" 
                  class="btn btn-sm btn-warning" 
                  (click)="faturarPedido(pedido)" 
                  title="Faturar Pedido">
            📄
          </button>
          <button *ngIf="pedido.status !== StatusPedido.Cancelado" 
                  class="btn btn-sm btn-danger" 
                  (click)="cancelarPedido(pedido)" 
                  title="Cancelar Pedido">
            ❌
          </button>
        </ng-template>
      </app-data-table>

      <!-- Modal de Confirmação -->
      <app-modal
        [isOpen]="showConfirmModal"
        [title]="modalTitle"
        [confirmText]="modalConfirmText"
        (onClose)="fecharModal()"
        (onConfirm)="executarAcao()">
        <p>{{ modalMessage }}</p>
      </app-modal>

      <!-- Modal de Baixa -->
      <app-modal
        [isOpen]="showBaixaModal"
        title="Baixar Pedido"
        confirmText="Confirmar Baixa"
        (onClose)="fecharModalBaixa()"
        (onConfirm)="confirmarBaixa()">
        <div class="form-group">
          <label>Valor da Baixa:</label>
          <input type="number" [(ngModel)]="valorBaixa" class="form-control" step="0.01" min="0">
        </div>
        <div class="form-group">
          <label>Data da Baixa:</label>
          <input type="date" [(ngModel)]="dataBaixa" class="form-control">
        </div>
      </app-modal>
    </div>
  `,
  styleUrls: ['./pedidos-list.component.scss']
})
export class PedidosListComponent implements OnInit {
  pedidos: Pedido[] = [];
  StatusPedido = StatusPedido;
  
  showConfirmModal = false;
  showBaixaModal = false;
  modalTitle = '';
  modalMessage = '';
  modalConfirmText = '';
  acaoAtual: any = null;
  pedidoSelecionado: Pedido | null = null;
  valorBaixa = 0;
  dataBaixa = new Date().toISOString().split('T')[0];

  columns = [
    { header: 'Número', field: 'numero' },
    { header: 'Cliente', field: 'cliente.nome' },
    { header: 'Status', field: 'status', template: 'status' },
    { header: 'Total', field: 'totalLiquido', template: 'currency' },
    { header: 'Data', field: 'criadoEm', template: 'date' }
  ];

  constructor(
    private pedidosService: PedidosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarPedidos();
  }

  carregarPedidos() {
    this.pedidosService.getPedidos().subscribe({
      next: (pedidos) => this.pedidos = pedidos,
      error: (error) => console.error('Erro ao carregar pedidos:', error)
    });
  }

  novoPedido() {
    this.router.navigate(['/pedidos/novo']);
  }

  editarPedido(pedido: Pedido) {
    if (pedido.status === StatusPedido.Cancelado || pedido.status === StatusPedido.Faturado) {
      alert('Não é possível editar pedidos cancelados ou faturados.');
      return;
    }
    this.router.navigate(['/pedidos/editar', pedido.id]);
  }

  verDetalhes(pedido: Pedido) {
    this.router.navigate(['/pedidos/detalhes', pedido.id]);
  }

  baixarPedido(pedido: Pedido) {
    this.pedidoSelecionado = pedido;
    this.valorBaixa = pedido.totalLiquido;
    this.showBaixaModal = true;
  }

  faturarPedido(pedido: Pedido) {
    this.acaoAtual = { tipo: 'faturar', pedido };
    this.modalTitle = 'Faturar Pedido';
    this.modalMessage = `Deseja faturar o pedido ${pedido.numero}?`;
    this.modalConfirmText = 'Faturar';
    this.showConfirmModal = true;
  }

  cancelarPedido(pedido: Pedido) {
    this.acaoAtual = { tipo: 'cancelar', pedido };
    this.modalTitle = 'Cancelar Pedido';
    this.modalMessage = `Deseja cancelar o pedido ${pedido.numero}? Esta ação desfará baixas e faturas.`;
    this.modalConfirmText = 'Cancelar';
    this.showConfirmModal = true;
  }

  confirmarExclusao(pedido: Pedido) {
    this.acaoAtual = { tipo: 'excluir', pedido };
    this.modalTitle = 'Excluir Pedido';
    this.modalMessage = `Deseja excluir o pedido ${pedido.numero}?`;
    this.modalConfirmText = 'Excluir';
    this.showConfirmModal = true;
  }

  executarAcao() {
    if (!this.acaoAtual) return;

    const { tipo, pedido } = this.acaoAtual;

    switch (tipo) {
      case 'faturar':
        this.pedidosService.faturarPedido(pedido.id).subscribe({
          next: () => {
            this.carregarPedidos();
            this.fecharModal();
            alert('Pedido faturado com sucesso!');
          },
          error: (error) => {
            console.error('Erro ao faturar pedido:', error);
            alert('Erro ao faturar pedido.');
          }
        });
        break;

      case 'cancelar':
        this.pedidosService.cancelarPedido(pedido.id).subscribe({
          next: () => {
            this.carregarPedidos();
            this.fecharModal();
            alert('Pedido cancelado com sucesso!');
          },
          error: (error) => {
            console.error('Erro ao cancelar pedido:', error);
            alert('Erro ao cancelar pedido.');
          }
        });
        break;

      case 'excluir':
        // Implementar exclusão se necessário
        this.fecharModal();
        break;
    }
  }

  confirmarBaixa() {
    if (!this.pedidoSelecionado) return;

    const dadosPagamento = {
      valor: this.valorBaixa,
      data: this.dataBaixa
    };

    // Método de baixar pedido não disponível no backend
    alert('Funcionalidade de baixar pedido não disponível no momento.');
    this.fecharModalBaixa();
  }

  fecharModal() {
    this.showConfirmModal = false;
    this.acaoAtual = null;
  }

  fecharModalBaixa() {
    this.showBaixaModal = false;
    this.pedidoSelecionado = null;
    this.valorBaixa = 0;
    this.dataBaixa = new Date().toISOString().split('T')[0];
  }

  getStatusText(status: StatusPedido): string {
    switch (status) {
      case StatusPedido.Rascunho: return 'Rascunho';
      case StatusPedido.Confirmado: return 'Confirmado';
      case StatusPedido.Cancelado: return 'Cancelado';
      case StatusPedido.Faturado: return 'Faturado';
      default: return 'Desconhecido';
    }
  }
}
