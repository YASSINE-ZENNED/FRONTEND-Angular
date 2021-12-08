import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { of, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService
  ) {}

  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(environment.baseUrl + 'dishes').pipe(
      map((dishes) => {
        dishes.forEach((dish) => {
          dish.image = `${environment.baseUrl}${dish.image}`;
        });
        return dishes;
      }),
      catchError(this.processHTTPMsgService.handelError)
    );
  }

  getDish(id: string): Observable<Dish> {
    return this.http.get<Dish>(environment.baseUrl + 'dishes/' + id).pipe(
      map((dish) => {
        dish.image = `${environment.baseUrl}${dish.image}`;
        return dish;
      }),
      catchError(this.processHTTPMsgService.handelError)
    );
  }

  getFeaturedDish(): Observable<Dish> {
    return this.http
      .get<Dish[]>(environment.baseUrl + 'dishes?featured=true')
      .pipe(
        map((dishes) => dishes[0]),

        map((dish) => {
          dish.image = `${environment.baseUrl}${dish.image}`;
          return dish;
        })
      );
  }
  getDishIds(): Observable<string[] | any> {
    return this.getDishes().pipe(
      map((dishes) => dishes.map((dish) => dish.id)),
      catchError((error) => error)
    );
  }
  putDish(dish: Dish): Observable<Dish> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
      }),
    };
    return this.http
      .put<Dish>(environment.baseUrl + 'dishes/' + dish.id, dish, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handelError));
  }
}
