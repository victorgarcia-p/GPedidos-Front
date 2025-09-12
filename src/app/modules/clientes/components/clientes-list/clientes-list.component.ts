import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClientesService } from '\.\.\/\.\.\/\.\.\/\.\.\/services/clientes.service';
import { Cliente } from '\.\.\/\.\.\/\.\.\/\.\.\/models/pedido.model';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ModalComponent],
  template: `
    <div class="clientes-container">
      <app-data-table
        [data]="clientes"
        [columns]="columns"
        title="Clientes"
        addButtonText="Novo Cliente"
        (onAdd)="novoCliente()"
        (onEdit)="editarCliente($event)"
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
  styleUrls: ['./clientes-list.component.scss']
})
export class ClientesListComponent implements OnInit {
  clientes: Cliente[] = [];
  
  showConfirmModal = false;
  modalTitle = '';
  modalMessage = '';
  modalConfirmText = '';
  clienteParaExcluir: Cliente | null = null;

  columns = [
    { header: 'Nome', field: 'nome' },
    { header: 'CPF', field: 'documento', template: 'cpf' },
    { header: 'Email', field: 'email' },
    { header: 'Telefone', field: 'telefone' },
    { header: 'Status', field: 'ativo', template: 'status' }
  ];

  constructor(
    private clientesService: ClientesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarClientes();
  }

  carregarClientes() {
    this.clientesService.getClientes().subscribe({
      next: (clientes) => this.clientes = clientes,
      error: (error) => console.error('Erro ao carregar clientes:', error)
    });
  }

  novoCliente() {
    this.router.navigate(['/clientes/novo']);
  }

  editarCliente(cliente: Cliente) {
    this.router.navigate(['/clientes/editar', cliente.id]);
  }

  confirmarExclusao(cliente: Cliente) {
    this.clienteParaExcluir = cliente;
    this.modalTitle = 'Excluir Cliente';
    this.modalMessage = `Deseja excluir o cliente ${cliente.nome}?`;
    this.modalConfirmText = 'Excluir';
    this.showConfirmModal = true;
  }

  executarExclusao() {
    if (!this.clienteParaExcluir) return;

    this.clientesService.excluirCliente(this.clienteParaExcluir.id).subscribe({
      next: () => {
        this.carregarClientes();
        this.fecharModal();
        alert('Cliente excluído com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao excluir cliente:', error);
        alert('Erro ao excluir cliente.');
      }
    });
  }

  fecharModal() {
    this.showConfirmModal = false;
    this.clienteParaExcluir = null;
  }

  formatarCPF(cpf: number): string {
    const cpfStr = cpf.toString().padStart(11, '0');
    return cpfStr.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  getStatusText(ativo: boolean): string {
    return ativo ? 'Ativo' : 'Inativo';
  }
}
