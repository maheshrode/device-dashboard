import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, RadioReceiver } from 'lucide-angular';
import { DeviceService } from './device.service';

@Component({
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  selector: 'app-device-list',
  template: `
    <div class="max-w-7xl mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Available Devices</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          *ngFor="let device of devices$ | async"
          class="bg-white rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between"
        >
          <div class="p-4 flex items-center gap-3">
            <!-- Icon -->
            <lucide-icon
              [img]="RadioReceiver"
              class="w-8 h-8 text-blue-500"
            ></lucide-icon>

            <!-- Device data -->
            <div class="flex-1">
              <h3 class="text-lg font-semibold break-words">
                {{ device }}
              </h3>
            </div>
          </div>

          <!-- Button to navigate -->
          <div class="p-4 pt-0">
            <button
              (click)="goToDetail(device)"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DeviceListComponent {
  devices$ = this.deviceService.getDevices();
  readonly RadioReceiver = RadioReceiver;

  constructor(private deviceService: DeviceService, private router: Router) {}

  goToDetail(deviceName: string) {
    this.router.navigate(['/devices', deviceName]);
  }
}
