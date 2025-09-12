import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="data-table-container">
      <div class="table-header">
        <h3>{{ title }}</h3>
        <button *ngIf="showAddButton" class="btn btn-primary" (click)="onAdd.emit()">
          <span class="icon">➕</span>
          {{ addButtonText }}
        </button>
      </div>
      
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th *ngFor="let column of columns">{{ column.header }}</th>
              <th *ngIf="showActions" class="actions-column">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of data; trackBy: trackByFn">
              <td *ngFor="let column of columns">
                <ng-container *ngIf="column.template; else defaultCell">
                  <ng-container *ngTemplateOutlet="column.template; context: { $implicit: item, column: column }"></ng-container>
                </ng-container>
                <ng-template #defaultCell>
                  {{ getValue(item, column.field) }}
                </ng-template>
              </td>
              <td *ngIf="showActions" class="actions-column">
                <div class="action-buttons">
                  <button *ngIf="showEditButton" class="btn btn-sm btn-secondary" (click)="onEdit.emit(item)">
                    ✏️
                  </button>
                  <button *ngIf="showDeleteButton" class="btn btn-sm btn-danger" (click)="onDelete.emit(item)">
                    🗑️
                  </button>
                  <ng-container *ngIf="customActions">
                    <ng-container *ngTemplateOutlet="customActions; context: { $implicit: item }"></ng-container>
                  </ng-container>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div *ngIf="data.length === 0" class="no-data">
          <p>Nenhum registro encontrado.</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() title: string = '';
  @Input() showAddButton: boolean = true;
  @Input() showEditButton: boolean = true;
  @Input() showDeleteButton: boolean = true;
  @Input() showActions: boolean = true;
  @Input() addButtonText: string = 'Adicionar';
  @Input() customActions?: TemplateRef<any>;

  @Output() onAdd = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  getValue(item: any, field: string): any {
    return field.split('.').reduce((obj, key) => obj?.[key], item);
  }
}
