import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

import { AppState } from '../../app.reducer';
import { FirmwareState, Keymapper, QmkKeyboardLayout, QmkKeyboardKeymapper } from '../interfaces';
import * as firmwareActions from './firmware.actions';
import onLetterKey from '../mapper/oneLetterKeys';
import mapperKeys from '../mapper/mapper.keys';
import { QmkService } from '../services/qmk.service';
import { compileFirmwareResponse } from '../services/services.interfaces';
import { add } from '../errors/errors.actions';
import { RequestsService } from '../services/requests.service';


@Component({
    selector: 'app-firmware',
    templateUrl: './firmware.component.html',
    styleUrls: ['./firmware.component.css']
})
export class FirmwareComponent implements OnInit {

    public firmware: FirmwareState;
    public layoutSelected: QmkKeyboardLayout;
    public compiling: compileFirmwareResponse;
    public urlFirmware: string;
    public activeTab: number = 0;
    public showLoading: boolean = true;
    public mapperKeys = mapperKeys;
    private draggingKey: Keymapper;
    public lastSelectedKey;

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

        this.store.dispatch(firmwareActions.getKeyboardsList());

        this.store.select('firmware').subscribe(firmware => {
            this.firmware = firmware;
            if (firmware) {
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

        this.elementRef.nativeElement.ownerDocument
            .addEventListener('keydown', this.onKeyDown.bind(this));
    }

    changeKeyboard(event: MatSelectChange) {
        this.store.dispatch(firmwareActions.getKeyboard({
            keyboardModel: event.value
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
        event.target.style.color = '#c2185b';
        this.dragLeave(event);
        this.changeKey(this.draggingKey, key);
    }

    dropInput(event, key: QmkKeyboardKeymapper) {
        event.preventDefault();
        event.stopPropagation();
        event.target.style.color = '#c2185b';
        let fromKey = { ...key };
        fromKey.secondByte = this.draggingKey.code;
        this.changeKey(fromKey, key);
    }

    dragEnd() {
        this.changeDetectorRef.reattach();
    }

    changeModKey(event, key: QmkKeyboardKeymapper) {
        event.target.style.color = '#c2185b';
        let fromKey = { ...key };
        fromKey.secondByte = parseInt(event.target.value);
        this.changeKey(fromKey, key);
    }

    onKeyDown(event) {
        if (event.target.nodeName != 'INPUT' && this.lastSelectedKey) {
            event.preventDefault();
            event.stopPropagation();
            const keys = [].concat(this.mapperKeys[0].keymap.reduce((ac, cu) => [].concat(ac, ...cu)));
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

    changeKey(fromKey, toKey) {
        this.sliderTime = '0ms';
        this.store.dispatch(firmwareActions.changeKey({
            layerNumber: this.activeTab,
            fromKey: fromKey,
            toKey: toKey
        }));
    }

    compile() {
        this.showLoading = true;
        let request = {
            keyboard: this.firmware.qmkKeyboard.keyboard_folder,
            keymap: this.firmware.layout.name,
            layout: this.firmware.layout.name,
            layers: []
        };
        this.firmware.layers.forEach(layer => {
            const layerMapper = layer.keymap.map(key => {
                if (key.code && key.code.indexOf('(') > 0) {
                    return key.code.split('(')[0] + '(' + key.secondByte + ')'
                }
                return key.code || 'KC_TRNS'
            });
            if (layerMapper.find(keycode => keycode != 'KC_TRNS')) {
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
}

