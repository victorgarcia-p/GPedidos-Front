import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PedidosService } from '../../../../services/pedidos.service';
import { ClientesService } from '../../../../services/clientes.service';
import { ProdutosService } from '../../../../services/produtos.service';
import { CuponsService } from '../../../../services/cupons.service';
import { Pedido, ItemPedido, Cliente, Produto, Cupom, StatusPedido } from '../../../../models/pedido.model';
import { ClienteSelectorComponent } from '../cliente-selector/cliente-selector.component';
import { ProdutoSelectorComponent } from '../produto-selector/produto-selector.component';
import { CarrinhoComponent } from '../carrinho/carrinho.component';
import { CupomSelectorComponent } from '../cupom-selector/cupom-selector.component';

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClienteSelectorComponent,
    ProdutoSelectorComponent,
    CarrinhoComponent,
    CupomSelectorComponent,
  ],
  template: `
    <div class="pedido-form-container">
      <div class="form-header">
        <h2>{{ isEdit ? 'Editar Pedido' : 'Novo Pedido' }}</h2>
        <div class="form-actions">
          <button class="btn btn-secondary" (click)="voltar()">Voltar</button>
          <button class="btn btn-primary" (click)="salvar()" [disabled]="!pedidoForm.valid">
            {{ isEdit ? 'Atualizar' : 'Salvar' }}
          </button>
        </div>
      </div>

      <form [formGroup]="pedidoForm" class="pedido-form">
        <!-- Seleção de Cliente -->
        <div class="form-section">
          <h3>Cliente</h3>
          <app-cliente-selector
            [clienteSelecionado]="clienteSelecionado"
            (clienteSelecionadoChange)="onClienteSelecionado($event)">
          </app-cliente-selector>
        </div>

        <!-- Seleção de Produtos -->
        <div class="form-section">
          <h3>Produtos</h3>
          <app-produto-selector
            (produtoAdicionado)="adicionarProduto($event)">
          </app-produto-selector>
        </div>

        <!-- Carrinho -->
        <div class="form-section" *ngIf="itens.length > 0">
          <h3>Carrinho</h3>
          <app-carrinho
            [itens]="itens"
            [totalBruto]="totalBruto"
            [desconto]="desconto"
            [totalLiquido]="totalLiquido"
            (itemRemovido)="removerItem($event.id)"
            (itemAtualizado)="atualizarItem($event)">
          </app-carrinho>
        </div>

        <!-- Cupom -->
        <div class="form-section" *ngIf="itens.length > 0">
          <h3>Cupom de Desconto</h3>
          <app-cupom-selector
            [cupomSelecionado]="cupomSelecionado"
            (cupomSelecionadoChange)="onCupomSelecionado($event)">
          </app-cupom-selector>
        </div>

        <!-- Resumo -->
        <div class="form-section" *ngIf="itens.length > 0">
          <h3>Resumo do Pedido</h3>
          <div class="resumo-pedido">
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
      </form>
    </div>
  `,
  styleUrls: ['./pedido-form.component.scss']
})
export class PedidoFormComponent implements OnInit {
  pedidoForm: FormGroup;
  isEdit = false;
  pedidoid: number | null = null;
  
  clienteSelecionado: Cliente | null = null;
  cupomSelecionado: Cupom | null = null;
  itens: ItemPedido[] = [];
  
  totalBruto = 0;
  desconto = 0;
  totalLiquido = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pedidosService: PedidosService,
    private clientesService: ClientesService,
    private produtosService: ProdutosService,
    private cuponsService: CuponsService
  ) {
    this.pedidoForm = this.fb.group({
      numero: ['', Validators.required],
      clienteId: [null, Validators.required],
      cupomId: [null],
      totalBruto: [0],
      desconto: [0],
      totalLiquido: [0]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.pedidoid = +params['id'];
        this.carregarPedido();
      } else {
        this.gerarNumeroPedido();
      }
    });
  }

  carregarPedido() {
    if (!this.pedidoid) return;

    this.pedidosService.getPedido(this.pedidoid).subscribe({
      next: (pedido) => {
        this.pedidoForm.patchValue(pedido);
        this.clienteSelecionado = pedido.cliente || null;
        this.cupomSelecionado = pedido.cupomObj || null;
        this.itens = pedido.itens || [];
        this.calcularTotais();
      },
      error: (error) => {
        console.error('Erro ao carregar pedido:', error);
        alert('Erro ao carregar pedido.');
      }
    });
  }

  gerarNumeroPedido() {
    const numero = 'PED' + Date.now();
    this.pedidoForm.patchValue({ numero });
  }

  onClienteSelecionado(cliente: Cliente | null) {
    this.clienteSelecionado = cliente;
    this.pedidoForm.patchValue({ clienteId: cliente?.id || null });
  }

  onCupomSelecionado(cupom: Cupom | null) {
    this.cupomSelecionado = cupom;
    this.pedidoForm.patchValue({ cupomId: cupom?.codigo || null });
    this.calcularTotais();
  }

  adicionarProduto(produto: Produto) {
    const itemExistente = this.itens.find(item => item.produtoId === produto.id);
    
    if (itemExistente) {
      itemExistente.quantidade += 1;
      this.calcularItem(itemExistente);
    } else {
      const novoItem: ItemPedido = {
        id: 0,
        produtoId: produto.id,
        precoUnitario: produto.precoUnitario,
        quantidade: 1,
        valorBruto: produto.precoUnitario,
        desconto: 0,
        valorLiquido: produto.precoUnitario,
        pedidoId: 0,
        produto: produto
      };
      this.itens.push(novoItem);
    }
    
    this.calcularTotais();
  }

  removerItem(itemId: number) {
    this.itens = this.itens.filter(item => item.id !== itemId);
    this.calcularTotais();
  }

  atualizarItem(itemAtualizado: ItemPedido) {
    const index = this.itens.findIndex(item => item.id === itemAtualizado.id);
    if (index !== -1) {
      this.calcularItem(itemAtualizado);
      this.itens[index] = itemAtualizado;
      this.calcularTotais();
    }
  }

  calcularItem(item: ItemPedido) {
    item.valorBruto = item.precoUnitario * item.quantidade;
    item.valorLiquido = item.valorBruto - item.desconto;
  }

  calcularTotais() {
    // Total bruto: soma dos valores brutos dos itens (preço x quantidade)
    this.totalBruto = this.itens.reduce((total, item) => total + (item.valorBruto || 0), 0);

    // Desconto de itens: soma dos descontos individuais informados em cada item
    const descontoItens = this.itens.reduce((total, item) => total + (item.desconto || 0), 0);

    // Desconto de cupom calculado sobre o valor após descontos dos itens
    const baseParaCupom = Math.max(this.totalBruto - descontoItens, 0);
    const descontoCupom = this.calcularDescontoCupom(baseParaCupom);

    this.desconto = descontoItens + descontoCupom;
    this.totalLiquido = Math.max(this.totalBruto - this.desconto, 0);

    this.pedidoForm.patchValue({
      totalBruto: this.totalBruto,
      desconto: this.desconto,
      totalLiquido: this.totalLiquido
    });
  }

  private calcularDescontoCupom(base: number): number {
    if (!this.cupomSelecionado) return 0;
    const { tipoDesconto, valorDesconto } = this.cupomSelecionado;
    if (tipoDesconto === 0) {
      return Math.min(valorDesconto, base);
    }
    return (base * valorDesconto) / 100;
  }

  salvar() {
    if (!this.pedidoForm.valid || !this.clienteSelecionado || this.itens.length === 0) {
      alert('Preencha todos os campos obrigatórios e adicione pelo menos um produto.');
      return;
    }

    // Recalcular todos os itens antes de enviar
    this.itens.forEach(item => this.calcularItem(item));
    this.calcularTotais();

    // Converter para o formato esperado pelo frontend (será convertido pelo ApiService)
    const pedidoData: Partial<Pedido> = {
      clienteId: this.clienteSelecionado!.id,
      itens: this.itens,
      status: StatusPedido.Rascunho,
      cupom: this.cupomSelecionado?.codigo || undefined,
      totalBruto: this.totalBruto,
      desconto: this.desconto,
      totalLiquido: this.totalLiquido
    };

    if (this.isEdit && this.pedidoid) {
      // Método de atualização não disponível no backend
      alert('Funcionalidade de atualização não disponível no momento.');
      this.voltar();
    } else {
      this.pedidosService.criarPedido(pedidoData).subscribe({
        next: () => {
          alert('Pedido criado com sucesso!');
          this.voltar();
        },
        error: (error) => {
          console.error('Erro ao criar pedido:', error);
          alert('Erro ao criar pedido: ' + (error.error?.message || error.message || 'Erro desconhecido'));
        }
      });
    }
  }

  voltar() {
    this.router.navigate(['/pedidos']);
  }
}
