import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';
import { environment } from '../../environments/environment';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService
  ) {}

  getPromotions(): Observable<Promotion[] > {
    return this.http.get<Promotion[]>(environment.baseUrl + 'promotion').pipe(
      map((Promotions) => {
        Promotions.forEach((Promotion) => {
          Promotion.image = `${environment.baseUrl}${Promotion.image}`;
        });
        return Promotions;
      }),
      catchError(this.processHTTPMsgService.handelError)
    );
  }

  getPromotion(id: string): Observable<Promotion> {
    return this.http
      .get<Promotion>(environment.baseUrl + 'Promotion/' + id)
      .pipe(
        map((Promotion) => {
          Promotion.image = `${environment.baseUrl}${Promotion.image}`;
          return Promotion;
        }),
        catchError(this.processHTTPMsgService.handelError)
      );
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http
      .get<Promotion[]>(environment.baseUrl + 'Promotions?featured=true')
      .pipe(
        map((Promotions) => Promotions[0]),
        map((Promotion) => {
          Promotion.image = `${environment.baseUrl}${Promotion.image}`;
          return Promotion;
        })
      );
  }
}
