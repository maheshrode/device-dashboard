import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorLogService } from './error-logs.service';

export const ErrorLogInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorLogService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      errorService.setError(
        error.message || 'Unexpected error occurred',
        error.status
      );
      return throwError(() => error);
    })
  );
};
