import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { LucideAngularModule, X, Package, Target } from 'lucide-angular';
import { Order } from '../order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './order-detail.component.html',
  animations: [
    trigger('backdrop', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
    ]),
    trigger('modal', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95) translateY(10px)' }),
        animate(
          '300ms cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '150ms ease-in',
          style({ opacity: 0, transform: 'scale(0.95) translateY(10px)' })
        ),
      ]),
    ]),
  ],
})
export class OrderDetailComponent {
  @Input() order: Order | null = null;
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();

  readonly X = X;
  readonly Package = Package;
  readonly Target = Target;

  get progress(): number {
    if (!this.order || this.order.productionTarget === 0) return 0;
    return Math.min(
      (this.order.productionState / this.order.productionTarget) * 100,
      100
    );
  }

  close() {
    this.closeEvent.emit();
  }
}
