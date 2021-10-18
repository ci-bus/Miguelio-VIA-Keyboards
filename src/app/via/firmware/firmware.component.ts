import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

import { AppState } from '../../app.reducer';
import { FirmwareState, Keymapper, QmkKeyboardLayout, QmkKeyboardKeymapper, Layermapper, Colorway, Key } from '../interfaces';
import * as firmwareActions from './firmware.actions';
import onLetterKey from '../mapper/oneLetterKeys';
import mapperKeys from './firmware.keys';
import { QmkService } from '../services/qmk.service';
import { compileFirmwareResponse } from '../services/services.interfaces';
import { add } from '../errors/errors.actions';
import { RequestsService } from '../services/requests.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import colorways from 'src/assets/colorways/colorways';


@Component({
    selector: 'app-firmware',
    templateUrl: './firmware.component.html',
    styleUrls: ['./firmware.component.scss']
})
export class FirmwareComponent implements OnInit, OnDestroy {

    public firmware: FirmwareState;
    public layoutSelected: QmkKeyboardLayout;
    public compiling: compileFirmwareResponse;
    public urlFirmware: string;
    public activeTab: number = 0;
    public showLoading: boolean = true;
    public mapperKeys = mapperKeys;
    private draggingKey: Keymapper;
    public lastSelectedKey;
    private functionKeyDown: any;
    public sizeKeys: number = 48;
    // Colors
    public caseColor: string = '#c2c5c7';
    public plateColor: string = '#929597';
    public keycapsColor: Colorway = JSON.parse(localStorage.getItem("keycapsColor"));
    public colorways: Colorway[] = colorways;

    myControl = new FormControl();
    filteredOptions: Observable<String[]>;
    layoutsSelected: any[];

    // Progress spinner values config
    color: ThemePalette = 'accent';
    mode: ProgressSpinnerMode = 'indeterminate';
    diameter: number = 200;
    strokeWidth: number = 1;
    value: number = 0;
    loadingMessage: string;
    sliderTime: string;

    constructor(
        public translate: TranslateService,
        private store: Store<AppState>,
        private changeDetectorRef: ChangeDetectorRef,
        private qmkService: QmkService,
        private requestService: RequestsService,
        private elementRef: ElementRef
    ) { }

    ngOnInit(): void {

        this.store.dispatch(firmwareActions.clear());
        this.store.dispatch(firmwareActions.getKeyboardsList());

        this.store.select('firmware').subscribe(firmware => {
            this.firmware = firmware;
            if (firmware && firmware.keyboardsList) {
                this.showLoading = false;
                setTimeout(() => {
                    this.sliderTime = '400ms';
                }, 100);
                if (firmware.layers) {
                    this.lastSelectedKey = firmware.layers.map(layer => layer.keymap)
                        .flat().find(key => key.selected);
                }
            }
        });

        this.functionKeyDown = this.onKeyDown.bind(this);

        this.elementRef.nativeElement.ownerDocument
            .addEventListener('keydown', this.functionKeyDown);

        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
        );
    }

    private _filter(value: String): String[] {
        const filterValue = value.toLowerCase();
        return this.firmware.keyboardsList ? this.firmware.keyboardsList.filter(option => option.toLowerCase().includes(filterValue)) : [];
    }

    ngOnDestroy() {
        this.elementRef.nativeElement.ownerDocument
            .removeEventListener('keydown', this.functionKeyDown);
    }

    changeKeyboard(event: MatAutocompleteSelectedEvent) {
        this.store.dispatch(firmwareActions.getKeyboard({
            keyboardModel: event.option.value
        }));
        this.showLoading = true;
    }

    changeLayout(event: MatSelectChange) {
        this.showLoading = true;
        const qmkKeyboardsLayout: QmkKeyboardLayout = {
            ...event.value.value,
            name: event.value.key
        };
        this.store.dispatch(firmwareActions.setLayout({ qmkKeyboardsLayout }));
    }

    isSymbolKey(key: Keymapper): boolean {
        return key.code && onLetterKey.indexOf(key.code) >= 0;
    }

    isModKey(key: Keymapper): boolean {
        return key.code && key.code.indexOf('(') > 0;
    }

    drag(key: Keymapper) {
        if (key.f) return false;
        this.draggingKey = key;
        this.changeDetectorRef.detach();
    }

    dragOver(event) {
        event.preventDefault();
    }

    dragEnter(event) {
        if (event.target.className.indexOf('dragOver') < 0)
            event.target.className += ' dragOver';
        return false;
    }

    dragLeave(event) {
        event.target.className = event.target.className.replace(' dragOver', '');
    }

    drop(event, key: QmkKeyboardKeymapper) {
        this.dragLeave(event);
        this.changeKey(this.draggingKey, key);
        const ROKey = {
            ...key,
            firstByte: this.draggingKey.firstByte,
            secondByte: this.draggingKey.secondByte
        }
        this.setRollOverKey(ROKey);
    }

    dropInput(event, key: QmkKeyboardKeymapper) {
        event.preventDefault();
        event.stopPropagation();
        const fromKey = {
            ...key,
            code: key.code.split('(').shift() + `(${this.draggingKey.code})`,
            secondByte: this.draggingKey.code
        };
        this.changeKey(fromKey, key);
    }

    dragEnd() {
        this.changeDetectorRef.reattach();
    }

    changeModKey(event, key: QmkKeyboardKeymapper) {
        const fromKey = {
            ...key,
            secondByte: parseInt(event.target.value)
        };
        this.changeKey(fromKey, key);
        this.setRollOverKey(fromKey);
    }

    setRollOverKey(key) {
        if (key.firstByte > 80 && key.firstByte < 89) {
            const rollOverKey = {
                ...key,
                firstByte: 0,
                secondByte: 1,
                code: 'KC_TRNS',
                selected: false
            };
            const layerNumber = key.secondByte;
            this.changeKey(rollOverKey, key, layerNumber);
        }
    }

    onKeyDown(event) {
        if (event.target.nodeName != 'INPUT' && this.lastSelectedKey) {
            event.preventDefault();
            event.stopPropagation();
            const keys = [].concat([].concat(this.mapperKeys[0].keymap).reduce((ac, cu) => [].concat(ac, ...cu)));
            const key = keys.find(key => key.eventCode == event.code);
            this.selectNextKey();
            if (key) {
                this.changeKey(key, this.lastSelectedKey);
            }
        }
    }

    selectNextKey() {
        const allKeysLayer = this.firmware.layers[0].keymap.flat(),
            nextIndex = allKeysLayer.findIndex(key => key.selected) + 1;
        if (nextIndex && nextIndex < allKeysLayer.length) {
            const nextKey = allKeysLayer[nextIndex],
                fromKey = {
                    ...nextKey,
                    selected: true
                }
            this.changeKey(fromKey, nextKey);
        }
    }

    toggleSelectKey(event, toKey) {
        if (event.target.nodeName != 'INPUT') {
            if (this.lastSelectedKey) {
                this.store.dispatch(firmwareActions.unselect({
                    layerNumber: this.activeTab, toKey: this.lastSelectedKey
                }));
            }
            const fromKey = {
                ...toKey,
                selected: !toKey.selected
            }
            this.changeKey(fromKey, toKey);
        }
    }

    changeKey(fromKey, toKey, layerNumber = this.activeTab) {
        this.sliderTime = '0ms';
        this.store.dispatch(firmwareActions.changeKey({
            layerNumber, fromKey, toKey
        }));
    }

    compile() {
        this.showLoading = true;
        let request = {
            version: 1,
            notes: '',
            documentation: "\"This file is a QMK Configurator export. You can import this at <https://config.qmk.fm>. It can also be used directly with QMK's source code.\n\nTo setup your QMK environment check out the tutorial: <https://docs.qmk.fm/#/newbs>\n\nYou can convert this file to a keymap.c using this command: `qmk json2c {keymap}`\n\nYou can compile this keymap using this command: `qmk compile {keymap}`\"\n",
            keyboard: this.firmware.qmkKeyboard.keyboard_folder,
            keymap: this.firmware.layout.name.toLowerCase() + '_mine',
            layout: this.firmware.layout.name,
            layers: []
        };
        this.firmware.layers.forEach(layer => {
            const layerMapper = layer.keymap.map(key => {
                if (key.code && key.code.indexOf('(') > 0) {
                    return key.code.split('(')[0] + '(' + key.secondByte + ')'
                }
                return key.code || 'KC_NO'
            });
            if (layerMapper.find(keycode => keycode != 'KC_NO')) {
                request.layers.push(layerMapper);
            }
        });
        this.qmkService.compileFirmware(request).subscribe(response => {
            this.showLoading = false;
            this.compiling = response;
            this.checkCompileStatus();
        });
        this.loadingMessage = 'waiting';
    }

    checkCompileStatus() {
        setTimeout(() => {
            this.qmkService.checkStatus(this.compiling).subscribe(response => {
                if (response.status == 'queued') {
                    this.checkCompileStatus();
                    return;
                }
                if (response.status == 'running') {
                    this.loadingMessage = 'compiling';
                    this.checkCompileStatus();
                    return;
                }
                if (response.status == 'finished') {
                    this.loadingMessage = 'downloading';
                    this.urlFirmware = response.result.firmware_binary_url[0];
                    this.requestService.downloadFile(this.urlFirmware).finally(() => {
                        this.compiling = this.loadingMessage = undefined;
                    });
                } else {
                    this.store.dispatch(add({
                        textInfo: 'Error compilando el firmware, inténtelo de nuevo mas tarde.'
                    }));
                    this.compiling = this.loadingMessage = undefined;
                }
            });
        }, 3000);
    }

    containerSize(layer) {
        let fullWidth = 0,
            fullHeight = 0;
        layer.keymap.flat().map(key => {
            const width = key.x * this.sizeKeys + (key.w || 1) * this.sizeKeys,
                height = key.y * this.sizeKeys + (key.h || 1) * this.sizeKeys;
            fullWidth = width > fullWidth ? width : fullWidth;
            fullHeight = height > fullHeight ? height : fullHeight;
        });
        return [fullWidth, fullHeight];
    }

    addLayer() {
        this.store.dispatch(firmwareActions.addLayer());
    }

    changeKeycapsColor(event: MatSelectChange) {
        localStorage.setItem("keycapsColor", JSON.stringify(event.value));
        this.keycapsColor = event.value;
    }

    getKeycapColor(key: Keymapper, colorType: string) {
        if (this.keycapsColor) {
            if (key.code && this.keycapsColor.override[key.code]) {
                return this.keycapsColor.swatches[this.keycapsColor.override[key.code]][colorType];
            }
            if (key.w <= 1) {
                return this.keycapsColor.swatches.base[colorType];
            } else {
                return this.keycapsColor.swatches.mods[colorType];
            }
        }
    }

    trackByLayer(index: number, layer: Layermapper): number {
        return layer.number;
    }

    trackByKey(index: number, key: Keymapper) {
        return `key_${key.x}_${key.y}`;
    }
}

