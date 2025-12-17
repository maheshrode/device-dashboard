import { Routes } from '@angular/router';

export const deviceRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./device-list.component').then((m) => m.DeviceListComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./device-detail/device-detail.component').then(
        (m) => m.DeviceDetailComponent
      ),
  },
];
