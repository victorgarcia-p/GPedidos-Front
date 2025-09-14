import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CuponsService } from '\.\.\/\.\.\/\.\.\/\.\.\/services/cupons.service';
import { Cupom, TipoDesconto } from '\.\.\/\.\.\/\.\.\/\.\.\/models/pedido.model';

@Component({
  selector: 'app-cupom-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="cupom-form-container">
      <div class="form-header">
        <h2>{{ isEdit ? 'Editar Cupom' : 'Novo Cupom' }}</h2>
        <div class="form-actions">
          <button class="btn btn-secondary" (click)="voltar()">Voltar</button>
          <button class="btn btn-primary" (click)="salvar()" [disabled]="!cupomForm.valid">
            {{ isEdit ? 'Atualizar' : 'Salvar' }}
          </button>
        </div>
      </div>

      <form [formGroup]="cupomForm" class="cupom-form">
        <div class="form-section">
          <div class="form-row">
            <div class="form-group">
              <label for="codigo">Código do Cupom *</label>
              <input 
                type="text" 
                id="codigo"
                formControlName="codigo" 
                class="form-control"
                placeholder="Ex: DESCONTO10"
                [readonly]="isEdit">
              <div *ngIf="cupomForm.get('codigo')?.invalid && cupomForm.get('codigo')?.touched" 
                   class="error-message">
                Código é obrigatório
              </div>
            </div>

            <div class="form-group">
              <label for="tipoDesconto">Tipo de Desconto *</label>
              <select 
                id="tipoDesconto"
                formControlName="tipoDesconto" 
                class="form-control">
                <option [value]="TipoDesconto.ValorFixo">Valor Fixo</option>
                <option [value]="TipoDesconto.Porcentagem">Porcentagem</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="valorDesconto">Valor do Desconto *</label>
              <input 
                type="number" 
                id="valorDesconto"
                formControlName="valorDesconto" 
                class="form-control"
                step="0.01"
                min="0"
                [placeholder]="getValorPlaceholder()">
              <div *ngIf="cupomForm.get('valorDesconto')?.invalid && cupomForm.get('valorDesconto')?.touched" 
                   class="error-message">
                Valor é obrigatório e deve ser maior que zero
              </div>
            </div>

            <div class="form-group">
              <label for="usoMaximo">Uso Máximo</label>
              <input 
                type="number" 
                id="usoMaximo"
                formControlName="usoMaximo" 
                class="form-control"
                min="0"
                placeholder="0 = ilimitado">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="validadeInicio">Data de Início *</label>
              <input 
                type="date" 
                id="validadeInicio"
                formControlName="validadeInicio" 
                class="form-control">
              <div *ngIf="cupomForm.get('validadeInicio')?.invalid && cupomForm.get('validadeInicio')?.touched" 
                   class="error-message">
                Data de início é obrigatória
              </div>
            </div>

            <div class="form-group">
              <label for="validadeFim">Data de Fim *</label>
              <input 
                type="date" 
                id="validadeFim"
                formControlName="validadeFim" 
                class="form-control">
              <div *ngIf="cupomForm.get('validadeFim')?.invalid && cupomForm.get('validadeFim')?.touched" 
                   class="error-message">
                Data de fim é obrigatória
              </div>
            </div>
          </div>

          <div class="form-row" *ngIf="cupomForm.get('tipoDesconto')?.value === TipoDesconto.Porcentagem">
            <div class="form-group">
              <div class="info-box">
                <strong>💡 Dica:</strong> Para porcentagem, use valores de 0 a 100. 
                Exemplo: 10 para 10% de desconto.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./cupom-form.component.scss']
})
export class CupomFormComponent implements OnInit {
  cupomForm: FormGroup;
  isEdit = false;
  cupomCodigo: string | null = null;
  TipoDesconto = TipoDesconto;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cuponsService: CuponsService
  ) {
    this.cupomForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(2)]],
      tipoDesconto: [TipoDesconto.ValorFixo, Validators.required],
      valorDesconto: [0, [Validators.required, Validators.min(0.01)]],
      validadeInicio: ['', Validators.required],
      validadeFim: ['', Validators.required],
      usoMaximo: [0, [Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['codigo']) {
        this.isEdit = true;
        this.cupomCodigo = params['codigo'];
        this.carregarCupom();
      } else {
        // Para novos cupons, definir data de início como hoje
        const hoje = new Date().toISOString().split('T')[0];
        this.cupomForm.patchValue({ validadeInicio: hoje });
      }
    });
  }

  carregarCupom() {
    if (!this.cupomCodigo) return;

    this.cuponsService.getCupom(this.cupomCodigo).subscribe({
      next: (cupom) => {
        this.cupomForm.patchValue({
          ...cupom,
          validadeInicio: this.formatarDataParaInput(cupom.validadeInicio),
          validadeFim: this.formatarDataParaInput(cupom.validadeFim)
        });
      },
      error: (error) => {
        console.error('Erro ao carregar cupom:', error);
        alert('Erro ao carregar cupom.');
      }
    });
  }

  formatarDataParaInput(data: Date): string {
    return new Date(data).toISOString().split('T')[0];
  }

  getValorPlaceholder(): string {
    const tipo = this.cupomForm.get('tipoDesconto')?.value;
    return tipo === TipoDesconto.ValorFixo ? 'Ex: 10.00' : 'Ex: 10 (para 10%)';
  }

  salvar() {
    if (!this.cupomForm.valid) {
      this.cupomForm.markAllAsTouched();
      return;
    }

    const formValue = this.cupomForm.value;
    const cupomData: Partial<Cupom> = {
      ...formValue,
      validadeInicio: new Date(formValue.validadeInicio),
      validadeFim: new Date(formValue.validadeFim)
    };

    if (this.isEdit && this.cupomCodigo) {
      this.cuponsService.atualizarCupom(cupomData).subscribe({
        next: () => {
          alert('Cupom atualizado com sucesso!');
          this.voltar();
        },
        error: (error) => {
          console.error('Erro ao atualizar cupom:', error);
          alert('Erro ao atualizar cupom.');
        }
      });
    } else {
      this.cuponsService.criarCupom(cupomData).subscribe({
        next: () => {
          alert('Cupom criado com sucesso!');
          this.voltar();
        },
        error: (error) => {
          console.error('Erro ao criar cupom:', error);
          alert('Erro ao criar cupom.');
        }
      });
    }
  }

  voltar() {
    this.router.navigate(['/cupons']);
  }
}
