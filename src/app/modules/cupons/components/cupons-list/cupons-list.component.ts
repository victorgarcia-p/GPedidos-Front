import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CuponsService } from '\.\.\/\.\.\/\.\.\/\.\.\/services/cupons.service';
import { Cupom, TipoDesconto } from '\.\.\/\.\.\/\.\.\/\.\.\/models/pedido.model';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-cupons-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ModalComponent],
  template: `
    <div class="cupons-container">
      <app-data-table
        [data]="cupons"
        [columns]="columns"
        title="Cupons de Desconto"
        addButtonText="Novo Cupom"
        (onAdd)="novoCupom()"
        (onEdit)="editarCupom($event)"
        (onDelete)="confirmarExclusao($event)">
      </app-data-table>

      <!-- Modal de Confirmação -->
      <app-modal
        [isOpen]="showConfirmModal"
        [title]="modalTitle"
        [confirmText]="modalConfirmText"
        (onClose)="fecharModal()"
        (onConfirm)="executarExclusao()">
        <p>{{ modalMessage }}</p>
      </app-modal>
    </div>
  `,
  styleUrls: ['./cupons-list.component.scss']
})
export class CuponsListComponent implements OnInit {
  cupons: Cupom[] = [];
  TipoDesconto = TipoDesconto;
  
  showConfirmModal = false;
  modalTitle = '';
  modalMessage = '';
  modalConfirmText = '';
  cupomParaExcluir: Cupom | null = null;

  columns = [
    { header: 'Código', field: 'codigo' },
    { header: 'Tipo', field: 'tipoDesconto', template: 'tipo' },
    { header: 'Valor', field: 'valorDesconto', template: 'valor' },
    { header: 'Válido Até', field: 'validadeFim', template: 'date' },
    { header: 'Uso Máximo', field: 'usoMaximo' },
    { header: 'Status', field: 'validadeFim', template: 'status' }
  ];

  constructor(
    private cuponsService: CuponsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarCupons();
  }

  carregarCupons() {
    this.cuponsService.getCupons().subscribe({
      next: (cupons) => this.cupons = cupons,
      error: (error) => console.error('Erro ao carregar cupons:', error)
    });
  }

  novoCupom() {
    this.router.navigate(['/cupons/novo']);
  }

  editarCupom(cupom: Cupom) {
    this.router.navigate(['/cupons/editar', cupom.codigo]);
  }

  confirmarExclusao(cupom: Cupom) {
    this.cupomParaExcluir = cupom;
    this.modalTitle = 'Excluir Cupom';
    this.modalMessage = `Deseja excluir o cupom ${cupom.codigo}?`;
    this.modalConfirmText = 'Excluir';
    this.showConfirmModal = true;
  }

  executarExclusao() {
    if (!this.cupomParaExcluir) return;

    this.cuponsService.excluirCupom(this.cupomParaExcluir.codigo).subscribe({
      next: () => {
        this.carregarCupons();
        this.fecharModal();
        alert('Cupom excluído com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao excluir cupom:', error);
        alert('Erro ao excluir cupom.');
      }
    });
  }

  fecharModal() {
    this.showConfirmModal = false;
    this.cupomParaExcluir = null;
  }

  getTipoText(tipo: TipoDesconto): string {
    return tipo === TipoDesconto.ValorFixo ? 'Valor Fixo' : 'Porcentagem';
  }

  getValorText(cupom: Cupom): string {
    if (cupom.tipoDesconto === TipoDesconto.ValorFixo) {
      return `R$ ${cupom.valorDesconto.toFixed(2)}`;
    } else {
      return `${cupom.valorDesconto}%`;
    }
  }

  getStatusText(cupom: Cupom): string {
    const agora = new Date();
    if (cupom.validadeFim < agora) {
      return 'Expirado';
    } else if (cupom.validadeInicio > agora) {
      return 'Futuro';
    } else {
      return 'Válido';
    }
  }

  getStatusClass(cupom: Cupom): string {
    const agora = new Date();
    if (cupom.validadeFim < agora) {
      return 'status-expirado';
    } else if (cupom.validadeInicio > agora) {
      return 'status-futuro';
    } else {
      return 'status-valido';
    }
  }
}
