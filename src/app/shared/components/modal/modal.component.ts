import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="modal-overlay" (click)="onClose.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button class="close-btn" (click)="onClose.emit()">×</button>
        </div>
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
        <div *ngIf="showFooter" class="modal-footer">
          <button class="btn btn-secondary" (click)="onClose.emit()">
            {{ cancelText }}
          </button>
          <button class="btn btn-primary" (click)="onConfirm.emit()" [disabled]="confirmDisabled">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() showFooter: boolean = true;
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  @Input() confirmDisabled: boolean = false;

  @Output() onClose = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();
}
