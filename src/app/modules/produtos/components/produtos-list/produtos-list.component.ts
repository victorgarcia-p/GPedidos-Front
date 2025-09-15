import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProdutosService } from '\.\.\/\.\.\/\.\.\/\.\.\/services/produtos.service';
import { Produto } from '\.\.\/\.\.\/\.\.\/\.\.\/models/pedido.model';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-produtos-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ModalComponent],
  template: `
    <div class="produtos-container">
      <app-data-table
        [data]="produtos"
        [columns]="columns"
        title="Produtos"
        addButtonText="Novo Produto"
        (onAdd)="novoProduto()"
        (onEdit)="editarProduto($event)"
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
  styleUrls: ['./produtos-list.component.scss']
})
export class ProdutosListComponent implements OnInit {
  produtos: Produto[] = [];
  
  showConfirmModal = false;
  modalTitle = '';
  modalMessage = '';
  modalConfirmText = '';
  produtoParaExcluir: Produto | null = null;

  columns = [
    { header: 'Nome', field: 'nome' },
    { header: 'SKU', field: 'sku' },
    { header: 'Preço', field: 'precoUnitario', template: 'currency' },
    { header: 'Estoque', field: 'estoque' },
    { header: 'Separado', field: 'estoqueSeparacao' },
    { header: 'Estoque Atual', field: 'estoqueAtual' },
    { header: 'Status', field: 'ativo', template: 'status' }
  ];

  constructor(
    private produtosService: ProdutosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.produtosService.getProdutos().subscribe({
      next: (produtos) => this.produtos = produtos,
      error: (error) => console.error('Erro ao carregar produtos:', error)
    });
  }

  novoProduto() {
    this.router.navigate(['/produtos/novo']);
  }

  editarProduto(produto: Produto) {
    this.router.navigate(['/produtos/editar', produto.id]);
  }

  confirmarExclusao(produto: Produto) {
    this.produtoParaExcluir = produto;
    this.modalTitle = 'Excluir Produto';
    this.modalMessage = `Deseja excluir o produto ${produto.nome}?`;
    this.modalConfirmText = 'Excluir';
    this.showConfirmModal = true;
  }

  executarExclusao() {
    // Método de exclusão não disponível no backend
    alert('Funcionalidade de exclusão não disponível no momento.');
    this.fecharModal();
  }

  fecharModal() {
    this.showConfirmModal = false;
    this.produtoParaExcluir = null;
  }

  getStatusText(ativo: boolean): string {
    return ativo ? 'Ativo' : 'Inativo';
  }
}
