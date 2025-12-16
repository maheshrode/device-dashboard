import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';
import { ErrorLogsBannerComponent } from '../error-logs/error-logs-banner.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ErrorLogsBannerComponent],
  template: `
    <div class="min-h-screen bg-gray-100">
      <app-error-log-banner></app-error-log-banner>
      <app-header></app-header>
      <main class="p-4">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class ShellComponent {}
