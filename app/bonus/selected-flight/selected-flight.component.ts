import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FlightService } from 'src/app/Core/Services/flight.service';

@Component({
  selector: 'app-selected-flight',
  templateUrl: './selected-flight.component.html',
  styleUrls: ['./selected-flight.component.scss'],
})
export class SelectedFlightComponent {
  flightDetails: any;
  totalPrice: number = 0;

  language: string = '';

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.getFlightDetails();
  }

  ngDoCheck(): void {
    this.language = localStorage.getItem('Language') || 'EN';
  }

  getFlightDetails() {
    this.flightService.getData().subscribe({
      next: (res) => {
        this.flightDetails = res.flightDetails;
        this.totalPrice = Math.trunc(res.totalPrice * 159.1 * 100) / 100;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  convertTimeToDate(date: string): Date {
    const newDate = new Date(date);

    return newDate;
  }

  calculateTravelDuration(
    depDate: any,
    depTime: any,
    arrDate: any,
    arrTime: any
  ) {
    if (depDate.includes('T')) {
      depDate = depDate.split('T')[0];
    }
    if (arrDate.includes('T')) {
      arrDate = arrDate.split('T')[0];
    }

    const depDateTimeString = `${depDate}T${depTime}`;
    const arrDateTimeString = `${arrDate}T${arrTime}`;

    const depDateTime = new Date(depDateTimeString);
    const arrDateTime = new Date(arrDateTimeString);

    const durationMs = arrDateTime.getTime() - depDateTime.getTime();

    const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
    const durationHours = Math.floor(
      (durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const durationMinutes = Math.floor(
      (durationMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    const durationMonths = Math.floor(durationDays / 30);
    const remainingDays = durationDays % 30;

    let result = [];

    if (durationMonths > 0) {
      result.push(`${durationMonths} ms`);
    }
    if (remainingDays > 0) {
      result.push(`${remainingDays} d`);
    }
    if (durationHours > 0) {
      result.push(`${durationHours} h`);
    }
    if (durationMinutes > 0) {
      result.push(`${durationMinutes} m`);
    }

    return result.length > 0 ? result.join(' ') : '';
  }
}
