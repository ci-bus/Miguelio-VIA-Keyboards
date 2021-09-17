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
import * as mapperActions from './mapper.actions';

import threeApp from "../../3d/three/index";
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-mapper',
    templateUrl: './mapper.component.html',
    styleUrls: ['./mapper.component.scss']
})
export class MapperComponent implements OnInit {

    defs: Defs;
    keymaps: Keymap[] = [];
    layoutsmapper: Layoutmapper[] = [];
    mapperKeys = mapperKeys;
    activeMainTab: number = 0;
    activeTab: number = 0;
    public sizeKeys: number = 48;

    draggingKey: Keymapper;

    keyboard3dCallbacks = new BehaviorSubject(undefined);

    // Three js keyboard
    private keyboard3dInited: boolean;
    private layout3d: Keymapper[] = [];

    constructor(
        public translate: TranslateService,
        private store: Store<AppState>,
        private keymapsHelper: keymapsHelper,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.translate.onLangChange.subscribe(() => {
            this.keyboard3d('updateKeys');
        });

        this.store.pipe(first()).subscribe(allData => {
            this.defs = allData.defs;
            this.keymaps = allData.keymaps;
            this.createLayoutsmapper();
        });

        this.store.select('layoutsmapper').subscribe(layoutsmapper => {
            this.layoutsmapper = layoutsmapper;
            if (!this.keyboard3dInited) {
                this.keyboard3dInited = true;
                this.keyboard3d('init');
            } else {
                this.keyboard3d('updateKeys');
            }
        });

        this.keyboard3dCallbacks.subscribe(event => {
            switch (event?.action) {
                case 'drop':
                    this.drop(event.data.e, event.data.key);
                    break;
            }
        });
    }

    keyboard3d(action: string) {
        const layout = this.create3dLayout();
        const keymap = this.create3dKeymap();
        if (layout && keymap) {
            threeApp(document.getElementById('keyboard3d'), action, {
                layout, keymap,
                callbacks: this.keyboard3dCallbacks
            });
        }
    }

    create3dKeymap() {
        return this.layoutsmapper[this.activeMainTab]?.layers[this.activeTab]?.keymap.flat().map(key => ({
            ...key,
            serigraphy: this.translate.instant(`keycode.${key.code}`) != `keycode.${key.code}`
                ? this.translate.instant(`keycode.${key.code}`)
                : key.code
        }));
    }

    create3dLayout() {
        let layoutNumber = 0;
        let layout3d = [];
        if (this.defs.layouts.length && this.keymaps.length) {
            // V2
            if (this.defs.vdoc == 2) {

                // V1
            } else {
                for (let row = 0; row < this.defs.layouts[layoutNumber].keymap.length; row++) {
                    let offsetX = 0;
                    for (let col = 0; col < this.defs.layouts[layoutNumber].keymap[row].length; col++) {
                        const tempKey = this.defs.layouts[layoutNumber].keymap[row][col];
                        let tempLayoutKey = undefined;
                        if (typeof tempKey == "number") {
                            tempLayoutKey = {
                                x: col + offsetX,
                                y: row,
                                w: <number>tempKey
                            };
                        } else {
                            if (!tempKey.f) {
                                tempLayoutKey = {
                                    ...tempKey,
                                    h: tempKey.s == "ISO_ENTER" ? 2 : 0,
                                    w: tempKey.u || tempKey.w
                                };
                            } else if (tempLayoutKey.u) {
                                offsetX += tempLayoutKey.u - 1;
                            }
                        }
                        if (tempLayoutKey?.w > 1) {
                            offsetX += tempLayoutKey.w - 1;
                        }
                        if (tempLayoutKey) {
                            layout3d.push(tempLayoutKey);
                        }
                    }
                }
            }
        }
        return layout3d;
    }

    createLayoutsmapper() {
        let layoutsmapper = [];
        if (this.defs.layouts.length && this.keymaps.length) {
            // V2
            if (this.defs.vdoc == 2) {
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
                            keymap: [this.keymapsHelper.compileKeymapperV2(tempLayout, keymap, keymap.number)]
                        });
                    });
                    layoutsmapper.push({
                        name: layout.name,
                        layers: tempLayers
                    });
                });

                this.store.dispatch(mapperActions.set({ layoutsmapper }));

                // V1
            } else {
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
                            keymap: this.keymapsHelper.compileKeymapper(tempLayout, keymap, keymap.number)
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
    }

    changeMap(newTabIndex) {
        this.activeTab = newTabIndex;
        this.keyboard3d('updateKeys');
    }

    changeLayout(newMainTapIndex) {
        this.activeMainTab = newMainTapIndex;
        this.keyboard3d('updateKeys');
    }

    containerSize(layout) {
        let maxWidth = 0,
            maxHeight = 0;
        layout.layers[0].keymap.flat().map(key => {
            let width = key.x * this.sizeKeys + key.w * this.sizeKeys,
                height = key.y * this.sizeKeys + key.h * this.sizeKeys;
            maxWidth = width > maxWidth ? width : maxWidth;
            maxHeight = height > maxHeight ? height : maxHeight;
        });
        return [maxWidth, maxHeight];
    }

    isModKey(key: Keymapper): boolean {
        return key.code && key.code.indexOf('(') > 0;
    }

    isSymbolKey(key: Keymapper): boolean {
        return key.code && onLetterKey.indexOf(key.code) >= 0;
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

    drop(event, key: Keymapper) {
        event.target.style.color = '#c2185b';
        this.dragLeave(event);
        this.store.dispatch(mapperActions.changeKey({
            fromKey: this.draggingKey,
            toKey: key
        }));
    }

    dropInput(event, key: Keymapper) {
        event.preventDefault();
        event.stopPropagation();
        event.target.style.color = '#c2185b';
        let fromKey = { ...key };
        fromKey.secondByte = this.draggingKey.secondByte;
        this.store.dispatch(mapperActions.changeKey({
            fromKey: fromKey,
            toKey: key
        }));
    }

    dragEnd() {
        this.changeDetectorRef.reattach();
    }

    changeModKey(event, key: Keymapper) {
        event.target.style.color = '#c2185b';
        let fromKey = { ...key };
        fromKey.secondByte = parseInt(event.target.value);
        this.store.dispatch(mapperActions.changeKey({
            fromKey: fromKey,
            toKey: key
        }));
    }
}

