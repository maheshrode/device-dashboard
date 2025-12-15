import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, switchMap } from 'rxjs/operators';
import { ConfigService } from '../../core/config/config.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getDevices() {
    return this.configService.config$.pipe(
      filter((config) => !!config),
      switchMap(() =>
        this.http.get<string[]>(this.configService.resolveEndpoint('devices')!)
      )
    );
  }
}
