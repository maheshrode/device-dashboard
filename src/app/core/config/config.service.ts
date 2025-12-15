import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, EMPTY, timer } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { AppConfig } from './config.model';

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    private readonly CONFIG_URL =
        'https://mock-api.assessment.sfsdm.org/config';

    private configSubject = new BehaviorSubject<AppConfig | null>(null);
    config$ = this.configSubject.asObservable().pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );

    constructor(private http: HttpClient) { }

    /** Start polling config at runtime */
    init(): void {
        timer(0, 30000) // polling as soon as &  every 30s
            .pipe(
                switchMap(() =>
                    this.http.get<AppConfig>(this.CONFIG_URL).pipe(
                        catchError(err => {
                            console.error('Config load failed', err);
                            return EMPTY;
                        })
                    )
                ),
                tap(config => this.configSubject.next(config))
            )
            .subscribe();
    }

    /** get config when needed */
    get currentConfig(): AppConfig | null {
        return this.configSubject.value;
    }
}
