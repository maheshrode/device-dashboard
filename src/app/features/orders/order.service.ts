import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { ConfigService } from '../../core/config/config.service';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getOrder(orderId: string): Observable<Order> {
    return this.configService.config$.pipe(
      filter((config) => !!config),
      switchMap(() => {
        const url = this.configService.resolveEndpoint('order', { orderId });
        if (!url) {
          throw new Error('Order endpoint not configured');
        }
        return this.http.get<Order>(url);
      })
    );
  }
}
