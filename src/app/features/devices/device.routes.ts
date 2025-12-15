import { Routes } from '@angular/router';
import { DeviceListComponent } from './device-list.component';
import { DeviceDetailComponent } from './device-detail/device-detail.component';

export const deviceRoutes: Routes = [
  {
    path: '',
    component: DeviceListComponent,
  },
  {
    path: ':id',
    component: DeviceDetailComponent,
  },
];
