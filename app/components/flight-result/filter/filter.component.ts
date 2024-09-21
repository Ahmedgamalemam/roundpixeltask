import { Component, EventEmitter, Output } from '@angular/core';
import { FlightService } from 'src/app/Core/Services/flight.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  @Output() sendSearchNameToParent: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() applyFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() resetFlightFilter: EventEmitter<undefined> =
    new EventEmitter<undefined>();

  airLineNames: string[] = [];

  filteredAirLineNames: string[] = [];
  checkboxStates: boolean[] = [];

  ValueMaxRange: any = 10000;
  ValueMinRange: any = 1000;
  MaxPrice: any = 10000;
  MinPrice: any = 1000;

  SearchText: string = '';

  language: string = '';

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.getAirLineNames();
  }

  ngDoCheck(): void {
    this.language = localStorage.getItem('Language') || 'EN';
  }

  getAirLineNames() {
    this.flightService.getFlights().subscribe({
      next: (res) => {
        this.airLineNames = res.airlines;
        this.getMaxMinPrice(res.airItineraries);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getMaxMinPrice(airItineraries: any) {
    const amounts = airItineraries.map(
      (airItinerary: any) => airItinerary.itinTotalFare.amount
    );

    const maxAmount = Math.max(...amounts);
    const minAmount = Math.min(...amounts);

    this.ValueMaxRange = maxAmount * 159.1;
    this.ValueMinRange = minAmount * 159.1;
    this.MaxPrice = maxAmount * 159.1;
    this.MinPrice = minAmount * 159.1;
  }

  validateInput(event: any) {
    const inputElement = event.target as HTMLInputElement;

    const englishOnlyPattern = /^[A-Za-z\s]*$/;

    if (!englishOnlyPattern.test(event.target.value)) {
      inputElement.value = event.target.value.replace(/[^A-Za-z\s]/g, '');
      this.SearchText = inputElement.value;
    } else {
      this.SearchText = inputElement.value;
    }
  }

  filterByName() {
    if (this.SearchText.trim() != '') {
      this.sendSearchNameToParent.emit(this.SearchText);
    }
  }

  controlPrice(inputName: string, event: Event) {
    let inputvalue = (event.target as HTMLInputElement).value;

    if (inputName == 'max') {
      if (this.ValueMaxRange <= this.ValueMinRange + 100) {
        this.ValueMaxRange = this.ValueMinRange + 100;
      }
    } else {
      if (this.ValueMinRange >= this.ValueMaxRange - 100) {
        this.ValueMinRange = this.ValueMaxRange - 100;
      }
    }
  }

  filterByAirlineName(event: Event, index: number): void {
    const checkbox = event.target as HTMLInputElement;
    const airline = checkbox.value;

    if (checkbox.checked) {
      this.filteredAirLineNames.push(airline);
    } else {
      this.filteredAirLineNames = this.filteredAirLineNames.filter(
        (a) => a !== airline
      );
    }

    this.checkboxStates[index] = checkbox.checked;
  }

  applyFilters() {
    let SearchCreateria = {
      searchName: this.SearchText,
      minPrice: this.ValueMinRange,
      maxPrice: this.ValueMaxRange,
      airLineNames: this.filteredAirLineNames,
    };

    this.applyFilter.emit(SearchCreateria);
  }

  resetFilter(): void {
    this.SearchText = '';

    this.ValueMaxRange = this.MaxPrice;
    this.ValueMinRange = this.MinPrice;

    this.filteredAirLineNames = [];
    this.checkboxStates = new Array(this.airLineNames.length).fill(false);

    this.resetFlightFilter.emit();
  }

  openFilterSide() {}
}
