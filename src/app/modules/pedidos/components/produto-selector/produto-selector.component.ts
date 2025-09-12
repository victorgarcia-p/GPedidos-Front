import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutosService } from '\.\.\/\.\.\/\.\.\/\.\.\/services/produtos.service';
import { Produto } from '\.\.\/\.\.\/\.\.\/\.\.\/models/pedido.model';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-produto-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="produto-selector">
      <button class="btn btn-primary" (click)="abrirModal()">
        ➕ Adicionar Produto
      </button>

      <!-- Modal de Seleção -->
      <app-modal
        [isOpen]="showModal"
        title="Selecionar Produto"
        confirmText="Adicionar"
        [confirmDisabled]="!produtoSelecionado"
        (onClose)="fecharModal()"
        (onConfirm)="adicionarProduto()">
        
        <div class="modal-content">
          <!-- Busca -->
          <div class="search-section">
            <input 
              type="text" 
              [(ngModel)]="termoBusca" 
              placeholder="Buscar por nome ou SKU..."
              class="form-control"
              (input)="buscarProdutos()">
          </div>

          <!-- Lista de Produtos -->
          <div class="produtos-list">
            <div 
              *ngFor="let produto of produtosFiltrados" 
              class="produto-item"
              [class.selected]="produtoSelecionado?.id === produto.id"
              (click)="selecionarProduto(produto)">
              <div class="produto-info">
                <div class="produto-header">
                  <strong>{{ produto.nome }}</strong>
                  <span class="sku">{{ produto.sku }}</span>
                </div>
                <div class="produto-details">
                  <span class="preco">{{ produto.precoUnitario | currency:'BRL' }}</span>
                  <span class="estoque" [class.baixo]="produto.estoqueAtual < 10">
                    Estoque: {{ produto.estoqueAtual }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Botão para Novo Produto -->
          <div class="new-product-section">
            <button class="btn btn-outline-primary" (click)="abrirFormularioNovoProduto()">
              ➕ Novo Produto
            </button>
          </div>
        </div>
      </app-modal>

      <!-- Modal de Novo Produto -->
      <app-modal
        [isOpen]="showNovoProdutoModal"
        title="Novo Produto"
        confirmText="Criar"
        [confirmDisabled]="!novoProdutoForm.valid"
        (onClose)="fecharNovoProdutoModal()"
        (onConfirm)="criarNovoProduto()">
        
        <div class="novo-produto-form">
          <div class="form-group">
            <label>Nome:</label>
            <input type="text" [(ngModel)]="novoProduto.nome" class="form-control" required>
          </div>
          <div class="form-group">
            <label>SKU:</label>
            <input type="text" [(ngModel)]="novoProduto.sku" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Preço Unitário:</label>
            <input type="number" [(ngModel)]="novoProduto.precoUnitario" class="form-control" step="0.01" min="0" required>
          </div>
          <div class="form-group">
            <label>Estoque:</label>
            <input type="number" [(ngModel)]="novoProduto.estoque" class="form-control" min="0" required>
          </div>
        </div>
      </app-modal>
    </div>
  `,
  styleUrls: ['./produto-selector.component.scss']
})
export class ProdutoSelectorComponent implements OnInit {
  @Output() produtoAdicionado = new EventEmitter<Produto>();

  showModal = false;
  showNovoProdutoModal = false;
  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  produtoSelecionado: Produto | null = null;
  termoBusca = '';

  novoProduto: Partial<Produto> = {
    nome: '',
    sku: '',
    precoUnitario: 0,
    estoque: 0,
    estoqueSeparacao: 0,
    estoqueAtual: 0,
    ativo: true
  };

  get novoProdutoForm() {
    return {
      valid: !!(this.novoProduto.nome && this.novoProduto.sku && this.novoProduto.precoUnitario !== undefined)
    };
  }

  constructor(private produtosService: ProdutosService) {}

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.produtosService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos.filter(p => p.ativo);
        this.produtosFiltrados = this.produtos;
      },
      error: (error) => console.error('Erro ao carregar produtos:', error)
    });
  }

  abrirModal() {
    this.showModal = true;
    this.produtoSelecionado = null;
  }

  fecharModal() {
    this.showModal = false;
    this.produtoSelecionado = null;
    this.termoBusca = '';
    this.produtosFiltrados = this.produtos;
  }

  buscarProdutos() {
    if (!this.termoBusca.trim()) {
      this.produtosFiltrados = this.produtos;
      return;
    }

    const termo = this.termoBusca.toLowerCase();
    this.produtosFiltrados = this.produtos.filter(produto =>
      produto.nome.toLowerCase().includes(termo) ||
      produto.sku.toLowerCase().includes(termo)
    );
  }

  selecionarProduto(produto: Produto) {
    this.produtoSelecionado = produto;
  }

  adicionarProduto() {
    if (this.produtoSelecionado) {
      this.produtoAdicionado.emit(this.produtoSelecionado);
      this.fecharModal();
    }
  }

  abrirFormularioNovoProduto() {
    this.showNovoProdutoModal = true;
    this.novoProduto = {
      nome: '',
      sku: '',
      precoUnitario: 0,
      estoque: 0,
      estoqueSeparacao: 0,
      estoqueAtual: 0,
      ativo: true
    };
  }

  fecharNovoProdutoModal() {
    this.showNovoProdutoModal = false;
  }

  criarNovoProduto() {
    this.produtosService.criarProduto(this.novoProduto).subscribe({
      next: (produto) => {
        this.produtos.push(produto);
        this.produtoSelecionado = produto;
        this.fecharNovoProdutoModal();
        this.adicionarProduto();
        alert('Produto criado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao criar produto:', error);
        alert('Erro ao criar produto.');
      }
    });
  }
}
