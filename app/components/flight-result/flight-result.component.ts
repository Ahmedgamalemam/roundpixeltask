import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlightService } from 'src/app/Core/Services/flight.service';

@Component({
  selector: 'app-flight-result',
  templateUrl: './flight-result.component.html',
  styleUrls: ['./flight-result.component.scss'],
})
export class FlightResultComponent implements OnInit {
  airItineraries: any[] = [];
  copyOfAirItineraries: any[] = [];

  language: string = '';

  constructor(private flightService: FlightService, private router: Router) {}

  ngOnInit(): void {
    this.getFlights();
  }

  ngDoCheck(): void {
    this.language = localStorage.getItem('Language') || 'EN';
  }

  getFlights() {
    this.flightService.getFlights().subscribe({
      next: (res) => {
        this.airItineraries = res.airItineraries;
        this.copyOfAirItineraries = res.airItineraries;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  convertTimeToDate(time: string): Date {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
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

  truncPrice(num: any) {
    return Math.trunc(num * 159.1 * 100) / 100;
  }

  filterFlightsByAirlineName(name: string) {
    this.airItineraries = this.copyOfAirItineraries;

    this.airItineraries = this.airItineraries?.filter((airItinerary: any) =>
      airItinerary?.allJourney?.flights?.every((flight: any) =>
        flight?.flightDTO?.[0]?.flightAirline?.airlineName
          ?.toLowerCase()
          .includes(name.toLowerCase())
      )
    );
  }

  filterFlightsByAirlineNames(airLineNames: any) {
    this.airItineraries = this.airItineraries?.filter((airItinerary: any) =>
      airItinerary?.allJourney?.flights?.every((flight: any) =>
        airLineNames?.includes(
          flight?.flightDTO?.[0]?.flightAirline?.airlineName
        )
      )
    );
  }

  filterFlightsByPrice(minPrice: any, maxPrice: any) {
    this.airItineraries = this.airItineraries?.filter((airItinerary: any) => {
      const price = airItinerary.itinTotalFare.amount * 159.1;

      return price >= minPrice && price <= maxPrice;
    });
  }

  applyFilters(filters: any) {
    this.airItineraries = this.copyOfAirItineraries;

    if (filters.searchName && filters.searchName.trim() != '') {
      this.filterFlightsByAirlineName(filters.searchName);
    } else {
      if (filters.airLineNames && filters.airLineNames.length > 0) {
        this.filterFlightsByAirlineNames(filters.airLineNames);
      }

      this.filterFlightsByPrice(filters.minPrice, filters.maxPrice);
    }
  }

  resetFlightFilter() {
    this.airItineraries = this.copyOfAirItineraries;
  }

  sendItemToFlightDetails(flight: any, totalPrice: string) {
    let flightDetails = { flightDetails: flight, totalPrice: totalPrice };
    this.flightService.setData(flightDetails);

    this.router.navigate(['/flightdetails']);
  }
}
