import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';

import { AppState } from '../../app.reducer';
import { Keymap, Keymapper, Layout } from '../interfaces';
import { Defs } from '../keyboard/defs.model';
import { keymapsHelper } from '../keymaps/keymaps.helper';
import onLetterKey from './oneLetterKeys';

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

    constructor(
        private store: Store<AppState>,
        private keymapsHelper: keymapsHelper
    ) { }

    ngOnInit(): void {
        
        this.store.pipe(first()).subscribe(allData => {
            this.defs = allData.defs;
            this.keymaps = allData.keymaps;
            this.processLayoutsLayers();
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
                        keymap: this.keymapsHelper.makeKeymap(layout, keymap)
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
}


