import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, EMPTY, timer } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { AppConfig } from './config.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly BASE_URL = 'https://mock-api.assessment.sfsdm.org';

  private configSubject = new BehaviorSubject<AppConfig | null>(null);

  config$ = this.configSubject
    .asObservable()
    .pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );

  constructor(private http: HttpClient) {}

  init(): void {
    timer(0, 30000)
      .pipe(
        switchMap(() =>
          this.http.get<AppConfig>(`${this.BASE_URL}/config`).pipe(
            catchError((err) => {
              console.error('Config load failed', err);
              return EMPTY;
            })
          )
        ),
        tap((config) => this.configSubject.next(config))
      )
      .subscribe();
  }

  /** Resolve API endpoint dynamically */
  resolveEndpoint(
    endpoint: keyof AppConfig['endpoints'],
    params?: Record<string, string>
  ): string | null {
    const config = this.configSubject.value;
    if (!config) return null;

    let path = config.endpoints[endpoint];

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        path = path.replace(`{${key}}`, value);
      });
    }

    return `${this.BASE_URL}${path}`;
  }
}
