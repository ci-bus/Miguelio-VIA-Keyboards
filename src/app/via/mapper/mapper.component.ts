import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from '../../app.reducer';
import { Keymap, Keymapper } from '../interfaces';
import { Defs } from '../keyboard/defs.model';
import { keymapsHelper } from '../keymaps/keymaps.helper';
import onLetterKey from './oneLetterKeys';
import mapperKeys from './mapper.keys';
import * as keymapsActions from '../keymaps/keymaps.actions';
import { RequestsService } from '../services/requests.service';

@Component({
    selector: 'app-mapper',
    templateUrl: './mapper.component.html',
    styleUrls: ['./mapper.component.css']
})
export class MapperComponent implements OnInit {

    defs: Defs;
    keymaps: Keymap[] = [];
    layoutsLayers = [];
    inited: boolean = false;
    mapperKeys = mapperKeys;

    draggingKey: Keymapper;
    settingKey: Keymapper;
    saving: boolean = false;

    constructor(
        public translate: TranslateService,
        private requestService: RequestsService,
        private store: Store<AppState>,
        private keymapsHelper: keymapsHelper,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.store.pipe(first()).subscribe(allData => {
            this.defs = allData.defs;
            this.keymaps = allData.keymaps;
            this.processLayoutsLayers();
        });

        this.requestService.on('setKeycodeFinish', () => {
            this.saving = false;
        });
    }

    processLayoutsLayers() {
        if (this.defs.layouts.length && this.keymaps.length) {
            // Each json layouts
            this.defs.layouts.forEach(layout => {
                let tempLayers = [];
                // Each eeprom keymaps
                this.keymaps.forEach(keymap => {
                    tempLayers.push({
                        number: keymap.number,
                        keymap: this.keymapsHelper.makeKeymap(layout, keymap, keymap.number)
                    });
                });
                this.layoutsLayers.push({
                    name: layout.name,
                    keymaps: tempLayers
                });
            });
            this.inited = this.layoutsLayers.length > 0;
        }

    }

    isModKey(key: Keymapper): boolean {
        return key.code && key.code.indexOf('(') > 0;
    }

    isSymbolKey(key: Keymapper): boolean {
        return key.code && onLetterKey.indexOf(key.code) >= 0;
    }

    drag(key: Keymapper) {
        if (this.saving) return false;
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

    drop(event, key: Keymapper) {
        key.code = this.draggingKey.code;
        key.firstByte = this.draggingKey.firstByte;
        key.secondByte = this.draggingKey.secondByte;
        this.dragLeave(event);
        this.saving = true;
        this.settingKey = key;
        this.store.dispatch(keymapsActions.setKeycode({
            key
        }));
    }

    dragEnd() {
        this.changeDetectorRef.reattach();
    }

    applyChanges() {
        //this.requestService.applyChanges();
        return false;
    }
}

//void dynamic_keymap_set_keycode(uint8_t layer, uint8_t row, uint8_t column, uint16_t keycode) {


