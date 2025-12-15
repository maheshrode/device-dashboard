import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppError } from './error-logs.model';

@Injectable({
  providedIn: 'root',
})
export class ErrorLogService {
  private errorSubject = new BehaviorSubject<AppError | null>(null);
  error$ = this.errorSubject.asObservable();

  setError(message: string, status?: number): void {
    this.errorSubject.next({
      message,
      status,
      timestamp: new Date(),
    });
  }

  clear(): void {
    this.errorSubject.next(null);
  }
}
