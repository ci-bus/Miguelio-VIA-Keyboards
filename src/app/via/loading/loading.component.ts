import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

import { RequestsService } from '../services/requests.service';
import { AppState } from '../../app.reducer';
import { Device } from '../devices/device.model';
import { Keyboard } from '../keyboard/keyboard.model';
import { Defs } from '../keyboard/defs.model';
import * as keyboardActions from '../keyboard/keyboard.actions';
import * as devicesActions from '../devices/devices.actions';
import * as layersActions from '../keymaps/keymaps.actions';
import * as firmwareActions from '../firmware/firmware.actions';
import { FirmwareState } from '../interfaces';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

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

    // Add support
    showAddSupport: boolean = false;
    showLoading: boolean = true;
    firmware: FirmwareState;
    rgbUnderglow: boolean = false;
    backlight: boolean = false;
    myControl = new FormControl();
    filteredOptions: Observable<String[]>;
    layoutsSelected: any[];

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
                this.getDevices();
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

        // Firmware store subscribe to add support
        this.store.select('firmware').subscribe(firmware => {
            this.firmware = firmware;
            if (firmware) {
                this.showLoading = this.loadingLayers = false;
                if (firmware.savedSupport) {
                    this.showAddSupport = false;
                }
            }
        });
        this.store.dispatch(firmwareActions.getKeyboardsList());

        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
        );
    }

    private _filter(value: String): String[] {
        const filterValue = value.toLowerCase();
        return this.firmware.keyboardsList.filter(option => option.toLowerCase().includes(filterValue));
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

    changeKeyboard(event: MatAutocompleteSelectedEvent) {
        this.store.dispatch(firmwareActions.getKeyboard({
            keyboardModel: event.option.value
        }));
        this.showLoading = true;
    }

    addSupport() {
        let rgblight = {
            brightness: { min: 0, max: 255 },
            effect: [
                { label: 'none', value: 0 },
                { label: 'static', value: 1 },
                { label: 'breathing', value: 2 },
                { label: 'rainbow', value: 6 },
                { label: 'swirl', value: 9 },
                { label: 'snake', value: 15 },
                { label: 'knightRider', value: 21 },
                { label: 'christmas', value: 24 },
                { label: 'staticGradient', value: 25 },
                { label: 'redGreenBlue', value: 35 }
            ],
            hue: { steps: 10 },
            sat: { steps: 17 }
        },
        backlight = {
            brightness: {
                min: 0, max: 255
            },
            effect: [
                { label: 'none', value: 0 },
                { label: 'breathing', value: 1 }
            ]
        },
        support = {
            name: this.firmware.qmkKeyboard.keyboard_name,
            vdoc: 2,
            lighting: {},
            ...this.firmware.qmkKeyboard.matrix_size,
            layouts: this.layoutsSelected.map(layoutData => ({
                name: layoutData.key,
                keymap: layoutData.value.layout
            }))
        },
        fileName = parseInt(this.firmware.qmkKeyboard.usb.vid) + '_' + parseInt(this.firmware.qmkKeyboard.usb.pid) + '.json',
        keyboardDir = this.firmware.qmkKeyboard.keyboard_name;

        if (this.rgbUnderglow) {
            support.lighting['rgblight'] = rgblight;
        }

        if (this.backlight) {
            support.lighting['backlight'] = backlight;
        }

        this.loadingLayers = true;
        this.store.dispatch(firmwareActions.addSupport({
            support, fileName, keyboardDir
        }));
    }

    selectionLayouts(ev) {
        this.layoutsSelected = ev.value;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}



