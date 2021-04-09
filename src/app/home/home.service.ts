import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) {}

  getTimeSeries(): Observable<any> {
    return this.http.get("https://api.covid19india.org/v4/min/data.min.json")
  }

  getCompleteTimeSeries(): Observable<any> {
    return this.http.get("https://api.covid19india.org/v4/min/timeseries.min.json");
  }

}
