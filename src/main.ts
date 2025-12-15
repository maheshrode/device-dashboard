import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { ConfigService } from './app/core/config/config.service';
import { ErrorLogInterceptor } from './app/core/error-logs/error-logs.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([ErrorLogInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: (config: ConfigService) => () => config.init(),
      deps: [ConfigService],
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
