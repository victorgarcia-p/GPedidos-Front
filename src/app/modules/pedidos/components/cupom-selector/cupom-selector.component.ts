import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CuponsService } from '\.\.\/\.\.\/\.\.\/\.\.\/services/cupons.service';
import { Cupom, TipoDesconto } from '\.\.\/\.\.\/\.\.\/\.\.\/models/pedido.model';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-cupom-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="cupom-selector">
      <div class="selector-header">
        <label>Cupom de Desconto:</label>
        <button class="btn btn-primary" (click)="abrirModal()">
          {{ cupomSelecionado ? 'Alterar Cupom' : 'Aplicar Cupom' }}
        </button>
      </div>
      
      <div *ngIf="cupomSelecionado" class="cupom-info">
        <div class="cupom-details">
          <strong>{{ cupomSelecionado.codigo }}</strong>
          <span class="desconto">
            {{ getDescontoText(cupomSelecionado) }}
          </span>
          <span class="validade">
            Válido até: {{ cupomSelecionado.validadeFim | date:'dd/MM/yyyy' }}
          </span>
        </div>
        <button class="btn btn-sm btn-secondary" (click)="removerCupom()">Remover</button>
      </div>

      <!-- Modal de Seleção -->
      <app-modal
        [isOpen]="showModal"
        title="Selecionar Cupom"
        confirmText="Aplicar"
        [confirmDisabled]="!cupomTemporario"
        (onClose)="fecharModal()"
        (onConfirm)="aplicarCupom()">
        
        <div class="modal-content">
          <!-- Busca -->
          <div class="search-section">
            <input 
              type="text" 
              [(ngModel)]="termoBusca" 
              placeholder="Digite o código do cupom..."
              class="form-control"
              (input)="buscarCupons()">
          </div>

          <!-- Lista de Cupons -->
          <div class="cupons-list">
            <div 
              *ngFor="let cupom of cuponsFiltrados" 
              class="cupom-item"
              [class.selected]="cupomTemporario?.codigo === cupom.codigo"
              [class.invalido]="!isCupomValido(cupom)"
              (click)="selecionarCupomTemporario(cupom)">
              <div class="cupom-info">
                <div class="cupom-header">
                  <strong>{{ cupom.codigo }}</strong>
                  <span class="desconto">{{ getDescontoText(cupom) }}</span>
                </div>
                <div class="cupom-details">
                  <span class="validade">
                    Válido: {{ cupom.validadeInicio | date:'dd/MM/yyyy' }} - {{ cupom.validadeFim | date:'dd/MM/yyyy' }}
                  </span>
                  <span class="uso" *ngIf="cupom.usoMaximo > 0">
                    Uso máximo: {{ cupom.usoMaximo }}
                  </span>
                </div>
                <div *ngIf="!isCupomValido(cupom)" class="invalido-msg">
                  Cupom inválido ou expirado
                </div>
              </div>
            </div>
          </div>

          <!-- Botão para Novo Cupom -->
          <div class="new-cupom-section">
            <button class="btn btn-outline-primary" (click)="abrirFormularioNovoCupom()">
              ➕ Novo Cupom
            </button>
          </div>
        </div>
      </app-modal>

      <!-- Modal de Novo Cupom -->
      <app-modal
        [isOpen]="showNovoCupomModal"
        title="Novo Cupom"
        confirmText="Criar"
        [confirmDisabled]="!novoCupomForm.valid"
        (onClose)="fecharNovoCupomModal()"
        (onConfirm)="criarNovoCupom()">
        
        <div class="novo-cupom-form">
          <div class="form-group">
            <label>Código:</label>
            <input type="text" [(ngModel)]="novoCupom.codigo" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Tipo de Desconto:</label>
            <select [(ngModel)]="novoCupom.tipoDesconto" class="form-control" required>
              <option [value]="TipoDesconto.ValorFixo">Valor Fixo</option>
              <option [value]="TipoDesconto.Porcentagem">Porcentagem</option>
            </select>
          </div>
          <div class="form-group">
            <label>Valor do Desconto:</label>
            <input 
              type="number" 
              [(ngModel)]="novoCupom.valorDesconto" 
              class="form-control" 
              step="0.01" 
              min="0" 
              required>
          </div>
          <div class="form-group">
            <label>Data de Início:</label>
            <input type="date" [(ngModel)]="novoCupom.validadeInicio" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Data de Fim:</label>
            <input type="date" [(ngModel)]="novoCupom.validadeFim" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Uso Máximo:</label>
            <input type="number" [(ngModel)]="novoCupom.usoMaximo" class="form-control" min="0" required>
          </div>
        </div>
      </app-modal>
    </div>
  `,
  styleUrls: ['./cupom-selector.component.scss']
})
export class CupomSelectorComponent implements OnInit {
  @Input() cupomSelecionado: Cupom | null = null;
  @Output() cupomSelecionadoChange = new EventEmitter<Cupom | null>();

  showModal = false;
  showNovoCupomModal = false;
  cupons: Cupom[] = [];
  cuponsFiltrados: Cupom[] = [];
  cupomTemporario: Cupom | null = null;
  termoBusca = '';
  TipoDesconto = TipoDesconto;

  novoCupom: Partial<Cupom> = {
    codigo: '',
    tipoDesconto: TipoDesconto.ValorFixo,
    valorDesconto: 0,
    validadeInicio: new Date(),
    validadeFim: new Date(),
    usoMaximo: 0
  };

  get novoCupomForm() {
    return {
      valid: !!(this.novoCupom.codigo && this.novoCupom.valorDesconto !== undefined && 
                this.novoCupom.validadeInicio && this.novoCupom.validadeFim)
    };
  }

  constructor(private cuponsService: CuponsService) {}

  ngOnInit() {
    this.carregarCupons();
  }

  carregarCupons() {
    this.cuponsService.getCupons().subscribe({
      next: (cupons) => {
        this.cupons = cupons;
        this.cuponsFiltrados = cupons;
      },
      error: (error) => console.error('Erro ao carregar cupons:', error)
    });
  }

  abrirModal() {
    this.showModal = true;
    this.cupomTemporario = this.cupomSelecionado;
  }

  fecharModal() {
    this.showModal = false;
    this.cupomTemporario = null;
    this.termoBusca = '';
    this.cuponsFiltrados = this.cupons;
  }

  buscarCupons() {
    if (!this.termoBusca.trim()) {
      this.cuponsFiltrados = this.cupons;
      return;
    }

    const termo = this.termoBusca.toLowerCase();
    this.cuponsFiltrados = this.cupons.filter(cupom =>
      cupom.codigo.toLowerCase().includes(termo)
    );
  }

  selecionarCupomTemporario(cupom: Cupom) {
    if (this.isCupomValido(cupom)) {
      this.cupomTemporario = cupom;
    }
  }

  aplicarCupom() {
    if (this.cupomTemporario && this.isCupomValido(this.cupomTemporario)) {
      this.cupomSelecionado = this.cupomTemporario;
      this.cupomSelecionadoChange.emit(this.cupomSelecionado);
      this.fecharModal();
    }
  }

  removerCupom() {
    this.cupomSelecionado = null;
    this.cupomSelecionadoChange.emit(null);
  }

  isCupomValido(cupom: Cupom): boolean {
    const agora = new Date();
    return cupom.validadeInicio <= agora && cupom.validadeFim >= agora;
  }

  getDescontoText(cupom: Cupom): string {
    if (cupom.tipoDesconto === TipoDesconto.ValorFixo) {
      return `R$ ${cupom.valorDesconto.toFixed(2)}`;
    } else {
      return `${cupom.valorDesconto}%`;
    }
  }

  abrirFormularioNovoCupom() {
    this.showNovoCupomModal = true;
    this.novoCupom = {
      codigo: '',
      tipoDesconto: TipoDesconto.ValorFixo,
      valorDesconto: 0,
      validadeInicio: new Date(),
      validadeFim: new Date(),
      usoMaximo: 0
    };
  }

  fecharNovoCupomModal() {
    this.showNovoCupomModal = false;
  }

  criarNovoCupom() {
    this.cuponsService.criarCupom(this.novoCupom).subscribe({
      next: (cupom) => {
        this.cupons.push(cupom);
        this.cupomTemporario = cupom;
        this.fecharNovoCupomModal();
        this.aplicarCupom();
        alert('Cupom criado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao criar cupom:', error);
        alert('Erro ao criar cupom.');
      }
    });
  }
}
