import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppDataProvider {
    constructor(private http: HttpClient) {}
    completeTimeSeries = new BehaviorSubject<any>(null);
    stateData = new BehaviorSubject<any>(null)

    updateCompleteTimeSeries(data) {
        this.completeTimeSeries.next(data)
    }

    updateStateData(data) {
        this.stateData.next(data)
    }

    getCompleteTimeSeries() {
        this.http.get("https://api.covid19india.org/v4/min/timeseries.min.json").subscribe( data => {
            this.updateCompleteTimeSeries(data)
        })

    }
    getStateData(){
        return this.http.get("https://api.covid19india.org/v4/min/data.min.json").subscribe( data => {
            this.updateStateData(data)
        })
      }
}