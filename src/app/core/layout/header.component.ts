import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LayoutDashboard } from 'lucide-angular';
import { ConfigService } from '../config/config.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <header
      class="sticky top-0  w-full bg-white/90 backdrop-blur border-b border-gray-200"
    >
      <div
        class="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3"
      >
        <!-- Logo / Title -->
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold shadow"
          >
            <lucide-icon [img]="LayoutDashboard" class="w-6 h-6"></lucide-icon>
          </div>
          <h1 class="text-lg sm:text-xl font-semibold text-gray-800">
            Device Dashboard
          </h1>
        </div>

        <!-- Environment Badge -->
        <ng-container *ngIf="config$ | async as config">
          <div
            class="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-white shadow-md animate-pulse"
            [ngStyle]="{ backgroundColor: config.environmentColour }"
          >
            <span class="w-2.5 h-2.5 rounded-full bg-white/90"></span>
            {{ config.environmentName }}
          </div>
        </ng-container>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  config$ = this.configService.config$;
  readonly LayoutDashboard = LayoutDashboard;
  constructor(private configService: ConfigService) {}
}
