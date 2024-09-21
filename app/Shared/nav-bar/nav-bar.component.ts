import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  constructor(private translate: TranslateService) {}

  switchLang(lang: string) {
    localStorage.setItem('Language', lang);
    this.translate.use(lang);
  }
}
