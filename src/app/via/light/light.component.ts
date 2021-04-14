import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { first, map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { Lighting, LightValues } from '../interfaces';
import * as lightActions from './light.actions';
import lightProps from './light.props';

@Component({
    selector: 'app-light',
    templateUrl: './light.component.html',
    styleUrls: ['./light.component.scss']
})

export class LightComponent implements OnInit {

    lightingDefs: Lighting;

    // Forms values
    values: LightValues = { }

    constructor(
        public translate: TranslateService,
        private store: Store<AppState>
    ) { }

    ngOnInit(): void {

        this.store.select('defs').pipe(
            first(),
            map(defs => defs.lighting)
        ).subscribe(lighting => {
            if (lighting) {
                this.lightingDefs = lighting;
                this.store.dispatch(lightActions.get({ lighting }));
            }
        });

        this.store.select('light').subscribe(lightValues => {
            this.values = lightValues;
        });

    }

    changeBacklightBrightness(brightness) {
        this.store.dispatch(lightActions.changePropValue({
            prop: lightProps.backlight.brightness,
            firstByte: brightness, secondByte: 0
        }));
    }

    changeBacklightEffect(effect) {
        this.store.dispatch(lightActions.changePropValue({
            prop: lightProps.backlight.effect,
            firstByte: parseInt(effect), secondByte: 0
        }));
    }
}
