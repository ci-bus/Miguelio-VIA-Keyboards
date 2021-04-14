import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'src/app/app.reducer';
import { disconnect, resetKeycodes } from '../mapper/mapper.actions';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

    languages: Array<string> = ['es', 'en'];

    constructor(
        public translate: TranslateService,
        public router: Router,
        private store:Store<AppState>
    ) { }

    ngOnInit(): void { }

    changeLanguage(lang: string) {
        this.translate.use(lang);
    }

    disconnect() {
        this.store.dispatch(disconnect());
    }

    resetKeycodes() {
        this.store.dispatch(resetKeycodes());
    }
}
