import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ThemePalette } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

import { RequestsService } from '../services/requests.service';
import { AppState } from '../../app.reducer';
import { Device } from '../devices/device.model';
import { Keyboard } from '../keyboard/keyboard.model';
import { Defs } from '../keyboard/defs.model';
import * as keyboardActions from '../keyboard/keyboard.actions';
import * as devicesActions from '../devices/devices.actions';
import * as layersActions from '../keymaps/keymaps.actions';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit, OnDestroy {

    // From store
    devices$: Observable<Device[]> = this.store.select(state => state.devices);
    defs$: Observable<Defs> = this.store.select(state => state.defs);
    keyboard: Keyboard;

    // Progress spinner values config
    color: ThemePalette = 'accent';
    mode: ProgressSpinnerMode = 'indeterminate';
    diameter: number = 200;
    strokeWidth: number = 1;
    value: number = 0;

    // Texts values
    loadingLayers: boolean = false;
    msgInfo: string = '';
    msgInfoSecond: string = '';

    subscriptions: Subscription[] = [];

    constructor(
        public translate: TranslateService,
        private requestService: RequestsService,
        private store: Store<AppState>,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.subscriptions.push(
            this.devices$.subscribe(devices => {
                if (!devices.length) this.getDevices();
            })
        );

        this.subscriptions.push(
            this.defs$.subscribe(defs => {
                this.msgInfo = defs.name;
            })
        );

        // Listener to receive layers porcent loaded
        this.requestService.on('layersPorcent', (event, layersPorcent: number) => {
            this.value = layersPorcent;
            this.changeDetectorRef.detectChanges();
        });

        this.subscriptions.push(
            this.store.select('errors').subscribe(errors => {
                if (errors.filter(error => !error.readed).length) {
                    this.clearAll();
                }
            })
        );
    }

    selectDevice(device: Device) {
        this.store.dispatch(keyboardActions.create({ device }));
        this.mode = 'determinate';
        this.strokeWidth = 2;
        this.msgInfoSecond = 'loadingLayer';
        this.loadingLayers = true;
    }

    clearAll() {
        this.store.dispatch(devicesActions.clear());
        this.store.dispatch(keyboardActions.clear());
        this.store.dispatch(layersActions.clear());

        this.loadingLayers = false;
        this.msgInfo = '';
        this.mode = 'indeterminate';
        this.strokeWidth = 1;
        this.msgInfoSecond = 'error';
        this.getDevices();
    }

    getDevices() {
        setTimeout(() => this.store.dispatch(devicesActions.get()), 500);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}



