import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from '../../app.reducer';
import { Keymapper, QmkKeyboard, QmkKeyboardLayout, QmkKeyboardLayoutDef } from '../interfaces';
import * as firmwareActions from './firmware.actions';
import onLetterKey from '../mapper/oneLetterKeys';
import mapperKeys from '../mapper/mapper.keys';
import { QmkService } from '../services/qmk.service';
import { compileFirmwareResponse } from '../services/services.interfaces';
import { add } from '../errors/errors.actions';
import { RequestsService } from '../services/requests.service';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';


@Component({
    selector: 'app-firmware',
    templateUrl: './firmware.component.html',
    styleUrls: ['./firmware.component.css']
})
export class FirmwareComponent implements OnInit {

    public qmkKeyboard: QmkKeyboard;
    public layoutSelected: QmkKeyboardLayout;
    public compiling: compileFirmwareResponse;
    public urlFirmware: string;

    public mapperKeys = mapperKeys;
    private draggingKey: Keymapper;

    // Progress spinner values config
    color: ThemePalette = 'accent';
    mode: ProgressSpinnerMode = 'indeterminate';
    diameter: number = 200;
    strokeWidth: number = 1;
    value: number = 0;

    constructor(
        public translate: TranslateService,
        private store: Store<AppState>,
        private changeDetectorRef: ChangeDetectorRef,
        private qmkService: QmkService,
        private requestService: RequestsService
    ) { }

    ngOnInit(): void {

        this.store.dispatch(firmwareActions.getKeyboard({
            keyboardModel: 'dz60'
        }));

        this.store.select('firmware').subscribe(firmware => {
            if (firmware && firmware.qmkKeyboard) {
                this.qmkKeyboard = firmware.qmkKeyboard;
                this.layoutSelected = firmware.layout;
            }
        });
    }

    changeLayout(event: MatSelectChange) {
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

    drop(event, key: QmkKeyboardLayoutDef) {
        event.target.style.color = '#c2185b';
        this.dragLeave(event);
        this.store.dispatch(firmwareActions.changeKey({
            fromKey: this.draggingKey,
            toKey: key
        }));
    }

    dropInput(event, key: QmkKeyboardLayoutDef) {
        event.preventDefault();
        event.stopPropagation();
        event.target.style.color = '#c2185b';
        let fromKey = { ...key };
        fromKey.secondByte = this.draggingKey.secondByte;
        this.store.dispatch(firmwareActions.changeKey({
            fromKey: fromKey,
            toKey: key
        }));
    }

    dragEnd() {
        this.changeDetectorRef.reattach();
    }

    changeModKey(event, key: QmkKeyboardLayoutDef) {
        event.target.style.color = '#c2185b';
        let fromKey = { ...key };
        fromKey.secondByte = parseInt(event.target.value);
        this.store.dispatch(firmwareActions.changeKey({
            fromKey: fromKey,
            toKey: key
        }));
    }

    compile() {
        const layer = this.layoutSelected.layout.map(layout => layout.code || 'KC_TRNS');
        const request = {
            keyboard: this.qmkKeyboard.keyboard_folder,
            keymap: this.layoutSelected.name,
            "layout": this.layoutSelected.name,
            "layers": [
                layer
            ]
        };
        this.qmkService.compileFirmware(request).subscribe(response => {
            this.compiling = response;
            this.checkCompileStatus();
        });
    }

    checkCompileStatus() {
        setTimeout(() => {
            this.qmkService.checkStatus(this.compiling).subscribe(response => {
                if (response.status == 'running' || response.status == 'queued') {
                    this.checkCompileStatus();
                    return;
                }
                if (response.status == 'finished') {
                    this.urlFirmware = response.result.firmware_binary_url[0];
                    this.requestService.downloadFile(this.urlFirmware);
                } else {
                    this.store.dispatch(add({
                        textInfo: 'Error compilando el firmware, inténtelo de nuevo mas tarde.'
                    }))
                }
                this.compiling.finished = true;
            });
        }, 3000);
    }
}

