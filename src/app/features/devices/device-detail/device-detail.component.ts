import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  Activity,
  ArrowLeft,
  Clock,
  ClockAlert,
  LucideAngularModule,
  Pause,
  Play,
  Server,
} from 'lucide-angular';
import { Observable, of } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';
import { EventService } from '../../../core/events/event.service';
import { DeviceEvent } from '../device-event.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { ErrorLogService } from '../../../core/error-logs/error-logs.service';
import { PerformanceChartComponent } from '../../charts/performance-chart.component';
import { StatusTimelineComponent } from '../../charts/status-timeline.component';
import { OrderDetailComponent } from '../../orders/order-detail/order-detail.component';
import { Order } from '../../orders/order.model';
import { OrderService } from '../../orders/order.service';

@Component({
  selector: 'app-device-detail',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    DatePipe,
    RouterLink,
    OrderDetailComponent,
    PerformanceChartComponent,
    StatusTimelineComponent,
  ],
  templateUrl: './device-detail.component.html',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'scale(0.95)' })
        ),
      ]),
      transition('* => *', [
        style({ transform: 'scale(1.05)' }),
        animate('200ms ease-out', style({ transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class DeviceDetailComponent implements OnInit {
  deviceId: string | null = null;
  latestEvent$: Observable<DeviceEvent | null> = of(null);

  // Order Modal State
  selectedOrder: Order | null = null;
  isOrderModalOpen = false;

  // Icons for template
  readonly Activity = Activity;
  readonly Clock = Clock;
  readonly Server = Server;
  readonly ArrowLeft = ArrowLeft;

  // Status Configuration with strong typing for styles
  readonly statusStyles: Record<string, string> = {
    running: 'bg-green-100 text-green-700 border-2 border-green-700',
    stopped: 'bg-yellow-100 text-yellow-700 border-2 border-yellow-700',
    maintenance: 'bg-red-100 text-red-700 border-2 border-red-700',
  };

  // Data History for Charts
  eventHistory: DeviceEvent[] = [];

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private orderService: OrderService,
    private errorService: ErrorLogService
  ) {}

  ngOnInit() {
    this.latestEvent$ = this.route.paramMap.pipe(
      tap((params) => {
        this.deviceId = params.get('id');
        this.eventHistory = []; // Reset history on device change
      }),
      switchMap((params) => {
        const id = params.get('id');
        return id ? this.eventService.getDeviceEvents(id) : of(null);
      }),
      tap((event) => {
        if (event) {
          this.eventHistory = [...this.eventHistory, event].slice(-50); // Keep last 50 events
        }
      }),
      shareReplay(1)
    );
  }

  openOrderDetails(orderId: string) {
    this.orderService.getOrder(orderId).subscribe({
      next: (order) => {
        this.selectedOrder = order;
        this.isOrderModalOpen = true;
      },
      error: (err) => {
        console.error('Failed to fetch order', err);
        this.errorService.setError(`Failed to load order #${orderId}`);
      },
    });
  }

  closeOrderModal() {
    this.isOrderModalOpen = false;
    this.selectedOrder = null;
  }

  getStatusIcon(status: string) {
    const icons: Record<string, any> = {
      running: Play,
      stopped: Pause,
      maintenance: ClockAlert,
    };
    return icons[status] || Activity;
  }

  getStatusStyle(status: string): string {
    return this.statusStyles[status] || 'bg-gray-100 text-gray-700';
  }
}
