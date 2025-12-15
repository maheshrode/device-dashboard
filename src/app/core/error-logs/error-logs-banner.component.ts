import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorLogService } from './error-logs.service';

@Component({
  selector: 'app-error-log-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="error$ | async as error" class="error-banner">
      <span>{{ error.message }}</span>
      <button (click)="close()">✖</button>
    </div>
  `,
  styles: [
    `
      .error-banner {
        background: #ffdddd;
        color: #900;
        padding: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    `,
  ],
})
export class ErrorLogsBannerComponent {
  error$ = this.errorService.error$;

  constructor(private errorService: ErrorLogService) {}

  close() {
    this.errorService.clear();
  }
}
