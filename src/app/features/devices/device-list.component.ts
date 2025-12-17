import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  RadioReceiver,
  Search,
  ChevronRight,
  X,
} from 'lucide-angular';
import { DeviceService } from './device.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, RouterLink],
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
})
export class DeviceListComponent implements OnInit {
  devices$ = this.deviceService.getDevices();
  searchTerm = '';
  allDevices: string[] = [];
  isLoading = true; // Add loading state

  readonly RadioReceiver = RadioReceiver;
  readonly Search = Search;
  readonly ChevronRight = ChevronRight;
  readonly X = X;

  constructor(private deviceService: DeviceService, private router: Router) {}

  ngOnInit() {
    this.deviceService.getDevices().subscribe({
      next: (devices) => {
        this.allDevices = devices;
        this.isLoading = false; // Turn off loading
      },
      error: () => {
        this.isLoading = false; // Turn off loading on error too
      },
    });
  }

  filteredDevices() {
    if (!this.searchTerm) return this.allDevices;
    return this.allDevices.filter((d) =>
      d.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  clearSearch() {
    this.searchTerm = '';
  }

  trackByDevice(index: number, device: string): string {
    return device;
  }
}
