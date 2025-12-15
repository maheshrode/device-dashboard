import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorLogService } from './error-logs.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-error-log-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="error$ | async as error"
      class="fixed top-2 right-5 z-50! w-[90%] sm:w-96
             bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg
             flex items-start gap-3
             animate-slide-in"
    >
      <div class="flex-1">
        <p class="font-semibold">Error</p>
        <p class="text-sm mt-1">{{ error.message }}</p>
      </div>

      <button
        (click)="close()"
        class="text-white hover:text-gray-200 transition"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  `,
})
export class ErrorLogsBannerComponent implements OnDestroy {
  error$ = this.errorService.error$;
  private autoCloseSub?: Subscription;

  constructor(private errorService: ErrorLogService) {
    this.error$.subscribe((error) => {
      if (error) {
        this.startAutoClose();
      }
    });
  }

  private startAutoClose() {
    this.autoCloseSub?.unsubscribe();
    this.autoCloseSub = timer(5000).subscribe(() => this.close());
  }

  close() {
    this.errorService.clear();
  }

  ngOnDestroy() {
    this.autoCloseSub?.unsubscribe();
  }
}
