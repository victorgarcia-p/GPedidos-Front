import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '\.\.\/\.\.\/\.\.\/\.\.\/services/clientes.service';
import { Cliente } from '\.\.\/\.\.\/\.\.\/\.\.\/models/pedido.model';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-cliente-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="cliente-selector">
      <div class="selector-header">
        <label>Cliente:</label>
        <button class="btn btn-primary" (click)="abrirModal()">
          {{ clienteSelecionado ? 'Alterar Cliente' : 'Selecionar Cliente' }}
        </button>
      </div>
      
      <div *ngIf="clienteSelecionado" class="cliente-info">
        <div class="cliente-details">
          <strong>{{ clienteSelecionado.nome }}</strong>
          <span class="documento">CPF: {{ formatarCPF(clienteSelecionado.documento) }}</span>
          <span class="email">{{ clienteSelecionado.email }}</span>
          <span class="telefone">{{ clienteSelecionado.telefone }}</span>
        </div>
        <button class="btn btn-sm btn-secondary" (click)="limparSelecao()">Remover</button>
      </div>

      <!-- Modal de Seleção -->
      <app-modal
        [isOpen]="showModal"
        title="Selecionar Cliente"
        confirmText="Selecionar"
        [confirmDisabled]="!clienteTemporario"
        (onClose)="fecharModal()"
        (onConfirm)="confirmarSelecao()">
        
        <div class="modal-content">
          <!-- Busca -->
          <div class="search-section">
            <input 
              type="text" 
              [(ngModel)]="termoBusca" 
              placeholder="Buscar por nome, CPF ou email..."
              class="form-control"
              (input)="buscarClientes()">
          </div>

          <!-- Lista de Clientes -->
          <div class="clientes-list">
            <div 
              *ngFor="let cliente of clientesFiltrados" 
              class="cliente-item"
              [class.selected]="clienteTemporario?.id === cliente.id"
              (click)="selecionarClienteTemporario(cliente)">
              <div class="cliente-info">
                <strong>{{ cliente.nome }}</strong>
                <span class="documento">CPF: {{ formatarCPF(cliente.documento) }}</span>
                <span class="email">{{ cliente.email }}</span>
              </div>
            </div>
          </div>

          <!-- Botão para Novo Cliente -->
          <div class="new-client-section">
            <button class="btn btn-outline-primary" (click)="abrirFormularioNovoCliente()">
              ➕ Novo Cliente
            </button>
          </div>
        </div>
      </app-modal>

      <!-- Modal de Novo Cliente -->
      <app-modal
        [isOpen]="showNovoClienteModal"
        title="Novo Cliente"
        confirmText="Criar"
        [confirmDisabled]="!novoClienteForm.valid"
        (onClose)="fecharNovoClienteModal()"
        (onConfirm)="criarNovoCliente()">
        
        <div class="novo-cliente-form">
          <div class="form-group">
            <label>Nome:</label>
            <input type="text" [(ngModel)]="novoCliente.nome" class="form-control" required>
          </div>
          <div class="form-group">
            <label>CPF:</label>
            <input type="text" [(ngModel)]="novoCliente.documento" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" [(ngModel)]="novoCliente.email" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Telefone:</label>
            <input type="text" [(ngModel)]="novoCliente.telefone" class="form-control" required>
          </div>
        </div>
      </app-modal>
    </div>
  `,
  styleUrls: ['./cliente-selector.component.scss']
})
export class ClienteSelectorComponent implements OnInit {
  @Input() clienteSelecionado: Cliente | null = null;
  @Output() clienteSelecionadoChange = new EventEmitter<Cliente | null>();

  showModal = false;
  showNovoClienteModal = false;
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  clienteTemporario: Cliente | null = null;
  termoBusca = '';

  novoCliente: Partial<Cliente> = {
    nome: '',
    documento: 0,
    email: '',
    telefone: '',
    ativo: true
  };

  get novoClienteForm() {
    return {
      valid: !!(this.novoCliente.nome && this.novoCliente.documento && this.novoCliente.email && this.novoCliente.telefone)
    };
  }

  constructor(private clientesService: ClientesService) {}

  ngOnInit() {
    this.carregarClientes();
  }

  carregarClientes() {
    this.clientesService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.clientesFiltrados = clientes;
      },
      error: (error) => console.error('Erro ao carregar clientes:', error)
    });
  }

  abrirModal() {
    this.showModal = true;
    this.clienteTemporario = this.clienteSelecionado;
  }

  fecharModal() {
    this.showModal = false;
    this.clienteTemporario = null;
    this.termoBusca = '';
    this.clientesFiltrados = this.clientes;
  }

  buscarClientes() {
    if (!this.termoBusca.trim()) {
      this.clientesFiltrados = this.clientes;
      return;
    }

    const termo = this.termoBusca.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(termo) ||
      cliente.documento.toString().includes(termo) ||
      cliente.email.toLowerCase().includes(termo)
    );
  }

  selecionarClienteTemporario(cliente: Cliente) {
    this.clienteTemporario = cliente;
  }

  confirmarSelecao() {
    this.clienteSelecionado = this.clienteTemporario;
    this.clienteSelecionadoChange.emit(this.clienteSelecionado);
    this.fecharModal();
  }

  limparSelecao() {
    this.clienteSelecionado = null;
    this.clienteSelecionadoChange.emit(null);
  }

  abrirFormularioNovoCliente() {
    this.showNovoClienteModal = true;
    this.novoCliente = {
      nome: '',
      documento: 0,
      email: '',
      telefone: '',
      ativo: true
    };
  }

  fecharNovoClienteModal() {
    this.showNovoClienteModal = false;
  }

  criarNovoCliente() {
    this.clientesService.criarCliente(this.novoCliente).subscribe({
      next: (cliente) => {
        this.clientes.push(cliente);
        this.clienteSelecionado = cliente;
        this.clienteSelecionadoChange.emit(cliente);
        this.fecharNovoClienteModal();
        this.fecharModal();
        alert('Cliente criado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao criar cliente:', error);
        alert('Erro ao criar cliente.');
      }
    });
  }

  formatarCPF(cpf: number): string {
    const cpfStr = cpf.toString().padStart(11, '0');
    return cpfStr.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}
