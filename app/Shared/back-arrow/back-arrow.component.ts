import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-back-arrow',
  templateUrl: './back-arrow.component.html',
  styleUrls: ['./back-arrow.component.css'],
})
export class BackArrowComponent {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
