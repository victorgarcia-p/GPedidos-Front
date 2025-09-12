import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientesService } from '\.\.\/\.\.\/\.\.\/\.\.\/services/clientes.service';
import { Cliente } from '\.\.\/\.\.\/\.\.\/\.\.\/models/pedido.model';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="cliente-form-container">
      <div class="form-header">
        <h2>{{ isEdit ? 'Editar Cliente' : 'Novo Cliente' }}</h2>
        <div class="form-actions">
          <button class="btn btn-secondary" (click)="voltar()">Voltar</button>
          <button class="btn btn-primary" (click)="salvar()" [disabled]="!clienteForm.valid">
            {{ isEdit ? 'Atualizar' : 'Salvar' }}
          </button>
        </div>
      </div>

      <form [formGroup]="clienteForm" class="cliente-form">
        <div class="form-section">
          <div class="form-row">
            <div class="form-group">
              <label for="nome">Nome *</label>
              <input 
                type="text" 
                id="nome"
                formControlName="nome" 
                class="form-control"
                placeholder="Digite o nome completo">
              <div *ngIf="clienteForm.get('nome')?.invalid && clienteForm.get('nome')?.touched" 
                   class="error-message">
                Nome é obrigatório
              </div>
            </div>

            <div class="form-group">
              <label for="documento">CPF *</label>
              <input 
                type="text" 
                id="documento"
                formControlName="documento" 
                class="form-control"
                placeholder="000.000.000-00"
                maxlength="14"
                (input)="formatarCPF($event)">
              <div *ngIf="clienteForm.get('documento')?.invalid && clienteForm.get('documento')?.touched" 
                   class="error-message">
                CPF é obrigatório
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="email">Email *</label>
              <input 
                type="email" 
                id="email"
                formControlName="email" 
                class="form-control"
                placeholder="email@exemplo.com">
              <div *ngIf="clienteForm.get('email')?.invalid && clienteForm.get('email')?.touched" 
                   class="error-message">
                Email é obrigatório e deve ser válido
              </div>
            </div>

            <div class="form-group">
              <label for="telefone">Telefone *</label>
              <input 
                type="text" 
                id="telefone"
                formControlName="telefone" 
                class="form-control"
                placeholder="(00) 00000-0000"
                maxlength="15"
                (input)="formatarTelefone($event)">
              <div *ngIf="clienteForm.get('telefone')?.invalid && clienteForm.get('telefone')?.touched" 
                   class="error-message">
                Telefone é obrigatório
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="ativo">
                <span class="checkmark"></span>
                Cliente ativo
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./cliente-form.component.scss']
})
export class ClienteFormComponent implements OnInit {
  clienteForm: FormGroup;
  isEdit = false;
  clienteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private clientesService: ClientesService
  ) {
    this.clienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      documento: ['', [Validators.required, Validators.minLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.minLength(10)]],
      ativo: [true]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.clienteId = +params['id'];
        this.carregarCliente();
      }
    });
  }

  carregarCliente() {
    if (!this.clienteId) return;

    this.clientesService.getCliente(this.clienteId).subscribe({
      next: (cliente) => {
        this.clienteForm.patchValue({
          ...cliente,
          documento: this.formatarCPFDisplay(cliente.documento),
          telefone: this.formatarTelefoneDisplay(cliente.telefone)
        });
      },
      error: (error) => {
        console.error('Erro ao carregar cliente:', error);
        alert('Erro ao carregar cliente.');
      }
    });
  }

  formatarCPF(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      event.target.value = value;
      this.clienteForm.patchValue({ documento: value });
    }
  }

  formatarTelefone(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      event.target.value = value;
      this.clienteForm.patchValue({ telefone: value });
    }
  }

  formatarCPFDisplay(cpf: number): string {
    const cpfStr = cpf.toString().padStart(11, '0');
    return cpfStr.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatarTelefoneDisplay(telefone: string): string {
    const tel = telefone.replace(/\D/g, '');
    if (tel.length === 10) {
      return tel.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (tel.length === 11) {
      return tel.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  }

  salvar() {
    if (!this.clienteForm.valid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const formValue = this.clienteForm.value;
    const clienteData: Partial<Cliente> = {
      ...formValue,
      documento: parseInt(formValue.documento.replace(/\D/g, '')),
      telefone: formValue.telefone.replace(/\D/g, '')
    };

    if (this.isEdit && this.clienteId) {
      this.clientesService.atualizarCliente(this.clienteId, clienteData).subscribe({
        next: () => {
          alert('Cliente atualizado com sucesso!');
          this.voltar();
        },
        error: (error) => {
          console.error('Erro ao atualizar cliente:', error);
          alert('Erro ao atualizar cliente.');
        }
      });
    } else {
      this.clientesService.criarCliente(clienteData).subscribe({
        next: () => {
          alert('Cliente criado com sucesso!');
          this.voltar();
        },
        error: (error) => {
          console.error('Erro ao criar cliente:', error);
          alert('Erro ao criar cliente.');
        }
      });
    }
  }

  voltar() {
    this.router.navigate(['/clientes']);
  }
}
