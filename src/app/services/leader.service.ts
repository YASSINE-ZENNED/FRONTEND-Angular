import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root',
})
export class LeaderService {
  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService
  ) {}

  getLeaders(): Observable<Leader[]> {
    return this.http.get<Leader[]>(environment.baseUrl + 'leader').pipe(
      map((Leaders) => {
        Leaders.forEach((Leader) => {
          Leader.image = `${environment.baseUrl}${Leader.image}`;
        });
        return Leaders;
      }),
      catchError(this.processHTTPMsgService.handelError)
    );
  }

  getLeader(id: string): Observable<Leader> {
    return this.http.get<Leader>(environment.baseUrl + 'leader/' + id).pipe(
      map((Leader) => {
        Leader.image = `${environment.baseUrl}${Leader.image}`;
        return Leader;
      }),
      catchError(this.processHTTPMsgService.handelError)
    );
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.http
      .get<Leader[]>(environment.baseUrl + 'leader?featured=true')
      .pipe(
        map((Leaders) => Leaders[0]),
        map((Leader) => {
          Leader.image = `${environment.baseUrl}${Leader.image}`;
          return Leader;
        })
      );
  }
}
