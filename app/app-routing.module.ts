import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SelectedFlightComponent } from './bonus/selected-flight/selected-flight.component';
import { FlightResultComponent } from './components/flight-result/flight-result.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'flightresult', component: FlightResultComponent },
  { path: 'flightdetails', component: SelectedFlightComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
