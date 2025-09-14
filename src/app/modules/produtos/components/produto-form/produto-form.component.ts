import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProdutosService } from '\.\.\/\.\.\/\.\.\/\.\.\/services/produtos.service';
import { Produto } from '\.\.\/\.\.\/\.\.\/\.\.\/models/pedido.model';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="produto-form-container">
      <div class="form-header">
        <h2>{{ isEdit ? 'Editar Produto' : 'Novo Produto' }}</h2>
        <div class="form-actions">
          <button class="btn btn-secondary" (click)="voltar()">Voltar</button>
          <button class="btn btn-primary" (click)="salvar()" [disabled]="!produtoForm.valid">
            {{ isEdit ? 'Atualizar' : 'Salvar' }}
          </button>
        </div>
      </div>

      <form [formGroup]="produtoForm" class="produto-form">
        <div class="form-section">
          <div class="form-row">
            <div class="form-group">
              <label for="nome">Nome *</label>
              <input 
                type="text" 
                id="nome"
                formControlName="NOME" 
                class="form-control"
                placeholder="Digite o nome do produto">
              <div *ngIf="produtoForm.get('NOME')?.invalid && produtoForm.get('NOME')?.touched" 
                   class="error-message">
                Nome é obrigatório
              </div>
            </div>

            <div class="form-group">
              <label for="sku">SKU *</label>
              <input 
                type="text" 
                id="sku"
                formControlName="SKU" 
                class="form-control"
                placeholder="Código do produto">
              <div *ngIf="produtoForm.get('SKU')?.invalid && produtoForm.get('SKU')?.touched" 
                   class="error-message">
                SKU é obrigatório
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="precoUnitario">Preço Unitário *</label>
              <input 
                type="number" 
                id="precoUnitario"
                formControlName="PRECO_UNITARIO" 
                class="form-control"
                step="0.01"
                min="0"
                placeholder="0,00">
              <div *ngIf="produtoForm.get('PRECO_UNITARIO')?.invalid && produtoForm.get('PRECO_UNITARIO')?.touched" 
                   class="error-message">
                Preço é obrigatório e deve ser maior que zero
              </div>
            </div>

            <div class="form-group">
              <label for="estoque">Estoque Inicial *</label>
              <input 
                type="number" 
                id="estoque"
                formControlName="ESTOQUE" 
                class="form-control"
                min="0"
                placeholder="0">
              <div *ngIf="produtoForm.get('ESTOQUE')?.invalid && produtoForm.get('ESTOQUE')?.touched" 
                   class="error-message">
                Estoque é obrigatório
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="estoqueSeparacao">Estoque para Separação</label>
              <input 
                type="number" 
                id="estoqueSeparacao"
                formControlName="estoquE_SEPARACAO" 
                class="form-control"
                min="0"
                placeholder="0">
            </div>

            <div class="form-group">
              <label for="estoqueAtual">Estoque Atual</label>
              <input 
                type="number" 
                id="estoqueAtual"
                formControlName="estoquE_ATUAL" 
                class="form-control"
                min="0"
                placeholder="0">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="ATIVO">
                <span class="checkmark"></span>
                Produto ativo
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./produto-form.component.scss']
})
export class ProdutoFormComponent implements OnInit {
  produtoForm: FormGroup;
  isEdit = false;
  produtoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private produtosService: ProdutosService
  ) {
    this.produtoForm = this.fb.group({
      NOME: ['', [Validators.required, Validators.minLength(2)]],
      SKU: ['', [Validators.required, Validators.minLength(2)]],
      PRECO_UNITARIO: [0, [Validators.required, Validators.min(0.01)]],
      ESTOQUE: [0, [Validators.required, Validators.min(0)]],
      ESTOQUE_SEPARACAO: [0, [Validators.min(0)]],
      ESTOQUE_ATUAL: [0, [Validators.min(0)]],
      ATIVO: [true]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['ID']) {
        this.isEdit = true;
        this.produtoId = +params['ID'];
        this.carregarProduto();
      } else {
        // Para novos produtos, estoque atual = estoque inicial
        this.produtoForm.get('ESTOQUE')?.valueChanges.subscribe(value => {
          this.produtoForm.patchValue({ estoquE_ATUAL: value }, { emitEvent: false });
        });
      }
    });
  }

  carregarProduto() {
    if (!this.produtoId) return;

    this.produtosService.getProduto(this.produtoId).subscribe({
      next: (produto) => {
        this.produtoForm.patchValue(produto);
      },
      error: (error) => {
        console.error('Erro ao carregar produto:', error);
        alert('Erro ao carregar produto.');
      }
    });
  }

  salvar() {
    if (!this.produtoForm.valid) {
      this.produtoForm.markAllAsTouched();
      return;
    }

    const produtoData = this.produtoForm.value;

    if (this.isEdit && this.produtoId) {
      this.produtosService.atualizarProduto(produtoData).subscribe({
        next: () => {
          alert('Produto atualizado com sucesso!');
          this.voltar();
        },
        error: (error) => {
          console.error('Erro ao atualizar produto:', error);
          alert('Erro ao atualizar produto.');
        }
      });
    } else {
      this.produtosService.criarProduto(produtoData).subscribe({
        next: () => {
          alert('Produto criado com sucesso!');
          this.voltar();
        },
        error: (error) => {
          console.error('Erro ao criar produto:', error);
          alert('Erro ao criar produto.');
        }
      });
    }
  }

  voltar() {
    this.router.navigate(['/produtos']);
  }
}
