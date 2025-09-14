import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LancamentosService } from '../../../../services/lancamentos.service';
import { Lancamento, StatusLancamento } from '../../../../models/pedido.model';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-lancamentos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, ModalComponent],
  template: `
    <div class="lancamentos-container">
      <app-data-table
        [data]="lancamentos"
        [columns]="columns"
        title="Lançamentos"
        [showAddButton]="false"
        [customActions]="customActions">
        
        <ng-template #customActions let-lancamento>
          <button *ngIf="lancamento.status === StatusLancamento.Aguardando" 
                  class="btn btn-sm btn-success" 
                  (click)="baixarLancamento(lancamento)" 
                  title="Baixar Lançamento">
            💰
          </button>
          <button *ngIf="lancamento.status !== StatusLancamento.Cancelado" 
                  class="btn btn-sm btn-danger" 
                  (click)="cancelarLancamento(lancamento)" 
                  title="Cancelar Lançamento">
            ❌
          </button>
        </ng-template>
      </app-data-table>

      <!-- Modal de Baixa -->
      <app-modal
        [isOpen]="showBaixaModal"
        title="Baixar Lançamento"
        confirmText="Confirmar Baixa"
        (onClose)="fecharModalBaixa()"
        (onConfirm)="confirmarBaixa()">
        <div class="lancamento-info">
          <p><strong>Pedido:</strong> {{ lancamentoSelecionado?.pedido?.numero }}</p>
          <p><strong>Parcela:</strong> {{ lancamentoSelecionado?.parcela }}</p>
          <p><strong>Valor:</strong> {{ lancamentoSelecionado?.valor | currency:'BRL' }}</p>
          <p><strong>Vencimento:</strong> {{ lancamentoSelecionado?.vencimento | date:'dd/MM/yyyy' }}</p>
        </div>
        
        <div class="form-group">
          <label>Valor da Baixa:</label>
          <input type="number" [(ngModel)]="valorBaixa" class="form-control" step="0.01" min="0" max="{{ lancamentoSelecionado?.valor }}">
        </div>
        <div class="form-group">
          <label>Data da Baixa:</label>
          <input type="date" [(ngModel)]="dataBaixa" class="form-control">
        </div>
      </app-modal>

      <!-- Modal de Confirmação -->
      <app-modal
        [isOpen]="showConfirmModal"
        [title]="modalTitle"
        [confirmText]="modalConfirmText"
        (onClose)="fecharModal()"
        (onConfirm)="executarAcao()">
        <p>{{ modalMessage }}</p>
      </app-modal>
    </div>
  `,
  styleUrls: ['./lancamentos-list.component.scss']
})
export class LancamentosListComponent implements OnInit {
  lancamentos: Lancamento[] = [];
  StatusLancamento = StatusLancamento;
  
  showBaixaModal = false;
  showConfirmModal = false;
  lancamentoSelecionado: Lancamento | null = null;
  valorBaixa = 0;
  dataBaixa = new Date().toISOString().split('T')[0];
  
  modalTitle = '';
  modalMessage = '';
  modalConfirmText = '';
  acaoAtual: any = null;

  columns = [
    { header: 'Pedido', field: 'pedido.numero' },
    { header: 'Parcela', field: 'parcela' },
    { header: 'Vencimento', field: 'vencimento', template: 'date' },
    { header: 'Valor', field: 'valor', template: 'currency' },
    { header: 'Status', field: 'status', template: 'status' }
  ];

  constructor(private lancamentosService: LancamentosService) {}

  ngOnInit() {
    this.carregarLancamentos();
  }

  carregarLancamentos() {
    this.lancamentosService.getLancamentos().subscribe({
      next: (lancamentos) => this.lancamentos = lancamentos,
      error: (error) => console.error('Erro ao carregar lançamentos:', error)
    });
  }

  baixarLancamento(lancamento: Lancamento) {
    this.lancamentoSelecionado = lancamento;
    this.valorBaixa = lancamento.valor;
    this.showBaixaModal = true;
  }

  cancelarLancamento(lancamento: Lancamento) {
    this.acaoAtual = { tipo: 'cancelar', lancamento };
    this.modalTitle = 'Cancelar Lançamento';
    this.modalMessage = `Deseja cancelar o lançamento do pedido ${lancamento.pedido?.numero}, parcela ${lancamento.parcela}?`;
    this.modalConfirmText = 'Cancelar';
    this.showConfirmModal = true;
  }

  confirmarBaixa() {
    if (!this.lancamentoSelecionado) return;

    const dadosBaixa = {
      valorBaixa: this.valorBaixa,
      dataBaixa: new Date(this.dataBaixa)
    };

    this.lancamentosService.baixarLancamento(dadosBaixa).subscribe({
      next: () => {
        this.carregarLancamentos();
        this.fecharModalBaixa();
        alert('Lançamento baixado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao baixar lançamento:', error);
        alert('Erro ao baixar lançamento.');
      }
    });
  }

  executarAcao() {
    if (!this.acaoAtual) return;

    const { tipo, lancamento } = this.acaoAtual;

    switch (tipo) {
      case 'cancelar':
        this.lancamentosService.cancelarLancamento({ id: lancamento.id, parcela: lancamento.parcela }).subscribe({
          next: () => {
            this.carregarLancamentos();
            this.fecharModal();
            alert('Lançamento cancelado com sucesso!');
          },
          error: (error) => {
            console.error('Erro ao cancelar lançamento:', error);
            alert('Erro ao cancelar lançamento.');
          }
        });
        break;
    }
  }

  fecharModalBaixa() {
    this.showBaixaModal = false;
    this.lancamentoSelecionado = null;
    this.valorBaixa = 0;
    this.dataBaixa = new Date().toISOString().split('T')[0];
  }

  fecharModal() {
    this.showConfirmModal = false;
    this.acaoAtual = null;
  }

  getStatusText(status: StatusLancamento): string {
    switch (status) {
      case StatusLancamento.Aguardando: return 'Aguardando';
      case StatusLancamento.Parcial: return 'Parcial';
      case StatusLancamento.Baixado: return 'Baixado';
      case StatusLancamento.Cancelado: return 'Cancelado';
      default: return 'Desconhecido';
    }
  }

  getStatusClass(status: StatusLancamento): string {
    switch (status) {
      case StatusLancamento.Aguardando: return 'status-aguardando';
      case StatusLancamento.Parcial: return 'status-parcial';
      case StatusLancamento.Baixado: return 'status-baixado';
      case StatusLancamento.Cancelado: return 'status-cancelado';
      default: return 'status-desconhecido';
    }
  }
}
