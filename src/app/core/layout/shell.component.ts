import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';
import { ErrorLogsBannerComponent } from '../error-logs/error-logs-banner.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ErrorLogsBannerComponent],
  template: `
    <div class="min-h-screen bg-gray-100  relative overflow-hidden z-0">
      <div
        class="absolute top-0 -right-20 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-3xl animate-blob"
      ></div>
      <div
        class="absolute bottom-0 -left-20 w-[500px] h-[500px] bg-yellow-300/20 rounded-full blur-3xl animate-blob animation-delay-4000"
      ></div>
      <app-error-log-banner></app-error-log-banner>
      <app-header></app-header>
      <main class="p-4">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class ShellComponent {}
