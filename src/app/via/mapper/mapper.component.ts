import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from '../../app.reducer';
import { Keymap, Keymapper, Layoutmapper } from '../interfaces';
import { Defs } from '../keyboard/defs.model';
import { keymapsHelper } from '../keymaps/keymaps.helper';
import onLetterKey from './oneLetterKeys';
import mapperKeys from './mapper.keys';
import * as keymapsActions from '../keymaps/keymaps.actions';
import * as mapperActions from './mapper.actions';
import { RequestsService } from '../services/requests.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
    selector: 'app-mapper',
    templateUrl: './mapper.component.html',
    styleUrls: ['./mapper.component.css']
})
export class MapperComponent implements OnInit {

    defs: Defs;
    keymaps: Keymap[] = [];
    layoutsmapper: Layoutmapper[] = [];
    mapperKeys = mapperKeys;
    activeTab: number = 0;

    draggingKey: Keymapper;

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
            this.createLayoutsmapper();
        });

        this.store.select('layoutsmapper').subscribe(layoutsmapper => {
            this.layoutsmapper = layoutsmapper;
        });

    }

    onLinkClick(event: MatTabChangeEvent) {
        this.activeTab = event.index;
    }

    createLayoutsmapper() {
        let layoutsmapper = [];
        if (this.defs.layouts.length && this.keymaps.length) {
            // Each json layouts
            this.defs.layouts.forEach(layout => {
                let tempLayout = {
                    ...layout,
                    rows: this.defs.rows,
                    cols: this.defs.cols
                },
                    tempLayers = [];
                // Each eeprom keymaps
                this.keymaps.forEach(keymap => {
                    tempLayers.push({
                        number: keymap.number,
                        keymap: this.keymapsHelper.makeKeymapper(tempLayout, keymap, keymap.number)
                    });
                });
                layoutsmapper.push({
                    name: layout.name,
                    layers: tempLayers
                });
            });

            this.store.dispatch(mapperActions.set({ layoutsmapper }));
        }

    }

    isModKey(key: Keymapper): boolean {
        return key.code && key.code.indexOf('(') > 0;
    }

    isSymbolKey(key: Keymapper): boolean {
        return key.code && onLetterKey.indexOf(key.code) >= 0;
    }

    drag(key: Keymapper) {
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
        event.target.style.color = '#c2185b';
        this.dragLeave(event);
        this.store.dispatch(mapperActions.changeKey({
            dragKey: this.draggingKey,
            dropKey: key
        }))
    }

    dragEnd() {
        this.changeDetectorRef.reattach();
    }

    changeModKey($event, key) {

    }

}


