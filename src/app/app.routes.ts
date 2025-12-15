import { Routes } from '@angular/router';
import { ShellComponent } from './core/layout/shell.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'devices',
    pathMatch: 'full',
  },
  {
    path: 'devices',
    component: ShellComponent,
    loadChildren: () =>
      import('./features/devices/device.routes').then((m) => m.deviceRoutes),
  },
];
