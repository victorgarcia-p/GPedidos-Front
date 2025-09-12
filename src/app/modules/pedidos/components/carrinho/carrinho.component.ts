import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemPedido } from '\.\.\/\.\.\/\.\.\/\.\.\/models/pedido.model';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="carrinho-container">
      <div class="carrinho-header">
        <h4>Itens do Pedido</h4>
        <span class="total-itens">{{ itens.length }} item(s)</span>
      </div>

      <div class="itens-list">
        <div *ngFor="let item of itens; trackBy: trackByFn" class="item-row">
          <div class="item-info">
            <div class="item-header">
              <strong>{{ item.produto?.nome }}</strong>
              <span class="sku">{{ item.produto?.sku }}</span>
            </div>
            <div class="item-details">
              <span class="preco-unitario">{{ item.precoUnitario | currency:'BRL' }} cada</span>
            </div>
          </div>

          <div class="item-controls">
            <div class="quantidade-control">
              <label>Qtd:</label>
              <input 
                type="number" 
                [(ngModel)]="item.quantidade" 
                (ngModelChange)="atualizarItem(item)"
                min="1" 
                class="quantidade-input">
            </div>

            <div class="desconto-control">
              <label>Desc.:</label>
              <input 
                type="number" 
                [(ngModel)]="item.desconto" 
                (ngModelChange)="atualizarItem(item)"
                min="0" 
                step="0.01"
                class="desconto-input">
            </div>

            <div class="item-total">
              <strong>{{ calcularTotalItem(item) | currency:'BRL' }}</strong>
            </div>

            <button class="btn btn-sm btn-danger" (click)="removerItem(item)" title="Remover item">
              🗑️
            </button>
          </div>
        </div>
      </div>

      <div class="carrinho-resumo">
        <div class="resumo-item">
          <span>Total Bruto:</span>
          <span>{{ totalBruto | currency:'BRL' }}</span>
        </div>
        <div class="resumo-item" *ngIf="desconto > 0">
          <span>Desconto:</span>
          <span>-{{ desconto | currency:'BRL' }}</span>
        </div>
        <div class="resumo-item total">
          <span>Total Líquido:</span>
          <span>{{ totalLiquido | currency:'BRL' }}</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./carrinho.component.scss']
})
export class CarrinhoComponent {
  @Input() itens: ItemPedido[] = [];
  @Input() totalBruto: number = 0;
  @Input() desconto: number = 0;
  @Input() totalLiquido: number = 0;

  @Output() itemRemovido = new EventEmitter<ItemPedido>();
  @Output() itemAtualizado = new EventEmitter<ItemPedido>();

  trackByFn(index: number, item: ItemPedido): any {
    return item.id || index;
  }

  atualizarItem(item: ItemPedido) {
    // Recalcular valores do item
    item.valorBruto = item.precoUnitario * item.quantidade;
    item.valorLiquido = item.valorBruto - item.desconto;

    // Emitir evento para o componente pai recalcular totais
    this.itemAtualizado.emit(item);
  }

  removerItem(item: ItemPedido) {
    this.itemRemovido.emit(item);
  }

  calcularTotalItem(item: ItemPedido): number {
    return item.valorLiquido;
  }
}
