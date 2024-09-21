import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private flightDetails = 'FlightDetails';
  private dataSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    const storedData = sessionStorage.getItem(this.flightDetails);
    this.dataSubject = new BehaviorSubject<any>(
      storedData ? JSON.parse(storedData) : null
    );
  }

  getFlights(): Observable<any> {
    return this.http.get('/assets/response.json');
  }

  getData() {
    return this.dataSubject.asObservable();
  }

  setData(newData: any) {
    this.dataSubject.next(newData);

    sessionStorage.setItem(this.flightDetails, JSON.stringify(newData));
  }
}
