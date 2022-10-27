import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'src/app/app.reducer';
import { clear } from '../firmware/firmware.actions';
import { disconnect, resetKeycodes } from '../mapper/mapper.actions';
import { RequestsService } from '../services/requests.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

    languages: Array<string> = ['es', 'us', 'en'];

    constructor(
        public translate: TranslateService,
        public router: Router,
        private store: Store<AppState>,
        private requestsService: RequestsService
    ) {
        window.process?.argv.forEach(arg => {
            if (arg.indexOf('--version=') === 0) {
                this.setVersion(arg.split('=')[1]);
            }
        })
    }

    changeLanguage(lang: string) {
        this.translate.use(lang);
    }

    disconnect() {
        this.store.dispatch(disconnect());
    }

    resetKeycodes() {
        this.store.dispatch(resetKeycodes());
    }

    compileFirmware() {
        this.router.navigate(['/firmware']);
    }

    testKeyboard() {
        this.router.navigate(['/testing']);
    }

    exitFirmware() {
        this.store.dispatch(clear());
        this.router.navigate(['/']);
    }

    exitTesting() {
        this.router.navigate(['/']);
    }

    setVersion(version: string) {
        switch (version) {
            case 'keebary': document.body.className = 'keebary'; break;
            case 'quark': document.body.className = 'quark'; break;
            case 'tecladitos': document.body.className = 'tecladitos'; break;
            case 'arq': document.body.className = 'arq'; break;
            case 'tecleate': document.body.className = 'tecleate'; break;
            default: document.body.className = ""; break;
        }
        this.requestsService.setVersion(version);
    }
}
