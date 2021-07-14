import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
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

export class LightComponent implements OnInit, OnDestroy {

    lightingDefs: Lighting;

    // Forms values
    values: LightValues = {};
    hue: number;
    sat: number;

    subscription: Subscription;

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
                this.lightingDefs = { ...lighting };
                this.store.dispatch(lightActions.get({
                    lighting: this.lightingDefs
                }));
            }
        });

        this.subscription = this.store.select('light').subscribe(lightValues => {
            if (lightValues) {
                this.values = lightValues;
                this.hue = lightValues.rgblight?.color.hue;
                this.sat = lightValues.rgblight?.color.sat;
            }
        });

    }

    changeBacklightBrightness(brightness) {
        this.store.dispatch(lightActions.changePropValue({
            prop: lightProps.backlight.brightness,
            firstByte: brightness, secondByte: 0
        }));
    }

    changeBacklightEffect(effect: string) {
        this.store.dispatch(lightActions.changePropValue({
            prop: lightProps.backlight.effect,
            firstByte: parseInt(effect), secondByte: 0
        }));
    }

    changeRGBlightBrightness(brightness: number) {
        this.store.dispatch(lightActions.changePropValue({
            prop: lightProps.rgblight.brightness,
            firstByte: brightness, secondByte: 0
        }));
    }

    changeRGBlightEffect(effect: string) {
        this.store.dispatch(lightActions.changePropValue({
            prop: lightProps.rgblight.effect,
            firstByte: parseInt(effect), secondByte: 1
        }));
    }

    changeRGBlightEffectSpeed(speed: number) {
        this.store.dispatch(lightActions.changePropValue({
            prop: lightProps.rgblight.effectSpeed,
            firstByte: speed, secondByte: 0
        }));
    }

    changeRGBlightColor() {
        this.store.dispatch(lightActions.changePropValue({
            prop: lightProps.rgblight.color,
            firstByte: this.hue,
            secondByte: this.sat
        }));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}


