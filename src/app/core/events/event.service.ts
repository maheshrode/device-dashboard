import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, retry, switchMap } from 'rxjs/operators';
import { DeviceEvent } from '../../features/devices/device-event.model';
import { ErrorLogService } from '../error-logs/error-logs.service';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(
    private configService: ConfigService,
    private zone: NgZone,
    private errorService: ErrorLogService
  ) {}

  getDeviceEvents(deviceId: string): Observable<DeviceEvent> {
    return this.configService.config$.pipe(
      filter((config) => !!config),
      switchMap(() => {
        return new Observable<DeviceEvent>((observer) => {
          const url = this.configService.resolveEndpoint('events', {
            deviceId,
          });

          if (!url) {
            observer.error('Configuration invalid or missing');
            return;
          }

          const eventSource = new EventSource(url);

          eventSource.onmessage = (event) => {
            this.zone.run(() => {
              try {
                const data: DeviceEvent = JSON.parse(event.data);
                observer.next(data);
              } catch (e) {
                console.error('Failed to parse event data', e);
                this.errorService.setError('Failed to parse real-time data');
              }
            });
          };

          eventSource.onerror = (error) => {
            this.zone.run(() => {
              console.error('EventSource error', error);
              this.errorService.setError(
                'Connection to device stream lost. Retrying...'
              );
              eventSource.close();
              observer.error(error);
            });
          };

          return () => {
            eventSource.close();
          };
        }).pipe(retry({ delay: 3000 }));
      })
    );
  }
}
