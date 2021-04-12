import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-menu-language',
    templateUrl: './menuLanguage.component.html',
    styleUrls: ['./menuLanguage.component.css']
})
export class MenuLanguageComponent implements OnInit {

    languages: Array<string> = ['es', 'en'];

    constructor(
        public translate: TranslateService
    ) { }

    ngOnInit(): void {
    }

    changeLanguage(lang: string) {
        this.translate.use(lang);
    }

}
