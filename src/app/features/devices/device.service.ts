import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ConfigService } from '../../core/config/config.service';
import { ErrorLogService } from '../../core/error-logs/error-logs.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private errorService: ErrorLogService
  ) {}

  getDevices() {
    return this.configService.config$.pipe(
      filter((config) => !!config),
      switchMap(() => {
        const url = this.configService.resolveEndpoint('devices');
        if (!url) {
          return throwError(() => new Error('Devices endpoint not configured'));
        }
        return this.http.get<string[]>(url);
      }),
      catchError((error) => {
        this.errorService.setError('Failed to load devices');
        return throwError(() => error);
      })
    );
  }
}
