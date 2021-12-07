import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { of, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  constructor(private http: HttpClient) {}

  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(environment.baseUrl + 'dishes').pipe(
      map((dishes) => {
        dishes.forEach((dish) => {
          dish.image = `${environment.baseUrl}${dish.image}`;
        });
        return dishes;
      })
    );
  }

  getDish(id: string): Observable<Dish> {
    return this.http.get<Dish>(environment.baseUrl + 'dishes/' + id).pipe(map((dish) =>{
          dish.image = `${environment.baseUrl}${dish.image}`;
          return dish;
        }));
       
      
  }

  getFeaturedDish(): Observable<Dish> {
    return this.http
      .get<Dish[]>(environment.baseUrl + 'dishes?featured=true')
      .pipe(map((dishes) => dishes[0])).pipe(map((dish) =>{
        dish.image = `${environment.baseUrl}${dish.image}`;
        return dish;
      }));
  }
  getDishIds(): Observable<string[] | any> {
    return this.getDishes().pipe(
      map((dishes) => dishes.map((dish) => dish.id))

    );

  }
}
