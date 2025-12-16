import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfigService } from './core/config/config.service';
import { AppConfig } from './core/config/config.model';
import { ErrorLogsBannerComponent } from './core/error-logs/error-logs-banner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'device-dashboard';
  private configService = inject(ConfigService);

  ngOnInit() {
    this.configService.config$.subscribe((cfg) => {
      console.log('Environment:', cfg?.environment);
    });
  }
}
