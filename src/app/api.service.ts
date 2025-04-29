import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  httpClient = inject(HttpClient);

  constructor() { }

  getTodayAsteroids(): Observable<any> {
    return this.httpClient.get('https://www.neowsapp.com/rest/v1/feed/today');
  }
  
  getAsteroidStats(): Observable<any> {
    return this.httpClient.get('https://www.neowsapp.com/rest/v1/stats');
  }
}
