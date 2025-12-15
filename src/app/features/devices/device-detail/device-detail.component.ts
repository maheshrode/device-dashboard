import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-device-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h2 class="text-xl font-bold">Device Details</h2>
      <p>Device ID: {{ deviceId }}</p>
    </div>
  `,
})
export class DeviceDetailComponent {
  deviceId: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.deviceId = this.route.snapshot.paramMap.get('id');
  }
}
