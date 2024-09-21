import { Component, DoCheck } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements DoCheck {
  title = 'online-travel';
  languge: string = '';

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    let langs = localStorage.getItem('Language') || '';

    if (langs == null || langs == '') {
      localStorage.setItem('Language', 'EN');
      this.translate.setDefaultLang('EN');
      this.languge = 'EN';
    } else {
      this.translate.use(langs);
      this.languge = langs;
    }
  }

  ngDoCheck(): void {
    this.languge = localStorage.getItem('Language') || '';
  }
}
