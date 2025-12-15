import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Activity,
  Clock,
  ClockAlert,
  LucideAngularModule,
  Pause,
  Play,
  Server,
} from 'lucide-angular';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { EventService } from '../../../core/events/event.service';
import { DeviceEvent } from '../device-event.model';

@Component({
  selector: 'app-device-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DatePipe],
  templateUrl: './device-detail.component.html',
})
export class DeviceDetailComponent implements OnInit {
  deviceId: string | null = null;
  latestEvent$: Observable<DeviceEvent | null> = of(null);

  // Icons for template
  readonly Activity = Activity;
  readonly Clock = Clock;
  readonly Server = Server;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.latestEvent$ = this.route.paramMap.pipe(
      tap((params) => (this.deviceId = params.get('id'))),
      switchMap((params) => {
        const id = params.get('id');
        return id ? this.eventService.getDeviceEvents(id) : of(null);
      })
    );
  }

  getStatusIcon(status: string) {
    switch (status) {
      case 'running':
        return Play;
      case 'stopped':
        return Pause;
      case 'maintenance':
        return ClockAlert;
      default:
        return Activity;
    }
  }
}
