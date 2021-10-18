import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from '../../app.reducer';
import { Keymap, Keymapper, Layermapper, Layout, Layoutmapper } from '../interfaces';
import { Defs } from '../keyboard/defs.model';
import { keymapsHelper } from '../keymaps/keymaps.helper';
import onLetterKey from './oneLetterKeys';
import mapperKeys from './mapper.keys';
import * as mapperActions from './mapper.actions';
import { add } from '../errors/errors.actions';

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
    changingTransToNo: Keymapper;

    constructor(
        public translate: TranslateService,
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
            if (!layoutsmapper[0]?.loading) {
                this.layoutsmapper = layoutsmapper;
                if (this.changingTransToNo) {
                    this.AllTransToNo();
                }
            }
        });

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

    dragStart(key: Keymapper) {
        try {
            if (key.f) return false;
            this.draggingKey = key;
            this.changeDetectorRef?.detach();
        } catch (err) {
            this.store.dispatch(add({
                textInfo: err
            }));
        }

    }

    dragEnter(event) {
        try {
            event.target.classList.add('dragOver');
        } catch (err) {
            this.store.dispatch(add({
                textInfo: err
            }));
        }
    }

    dragLeave(event) {
        try {
            event.target.classList.remove('dragOver');
        } catch (err) {
            this.store.dispatch(add({
                textInfo: err
            }));
        }
    }

    drop(event, key: Keymapper) {
        try {
            if (event.target && !this.layoutsmapper[0]?.loading) {
                this.store.dispatch(mapperActions.changeKey({
                    fromKey: this.draggingKey,
                    toKey: key
                }));
            }
            event.target.classList.remove('dragOver');
        } catch (err) {
            this.store.dispatch(add({
                textInfo: err
            }));
        }
    }

    dropInput(event, key: Keymapper) {
        event.stopImmediatePropagation();
        try {
            if (event?.target && !this.layoutsmapper[0]?.loading) {
                event.target.style.color = '#c2185b';
                let fromKey = { ...key };
                fromKey.secondByte = this.draggingKey.secondByte;
                this.store.dispatch(mapperActions.changeKey({
                    fromKey: fromKey,
                    toKey: key
                }));
            }
        } catch (err) {
            this.store.dispatch(add({
                textInfo: err
            }));
        }
    }

    dragEnd() {
        try {
            this.changeDetectorRef.reattach();
        } catch (err) {
            this.store.dispatch(add({
                textInfo: err
            }));
        }
    }

    changeModKey(event, key: Keymapper) {
        try {
            if (!this.layoutsmapper[0]?.loading) {
                event.target.style.color = '#c2185b';
                let fromKey = { ...key };
                fromKey.secondByte = parseInt(event.target.value);
                this.store.dispatch(mapperActions.changeKey({
                    fromKey: fromKey,
                    toKey: key
                }));
            }
        } catch (err) {
            this.store.dispatch(add({
                textInfo: err
            }));
        }
    }

    trackByLayout(index: number, layout: Layout): string {
        return layout.name;
    }

    trackByLayer(index: number, layer: Layermapper): number {
        return layer.number;
    }

    trackByKeymap(index: number, keymap: Keymapper[]) {
        return index;
    }

    trackByKey(index: number, key: Keymapper) {
        return `key_${key.col}_${key.row}`;
    }

    onRightClick(event) {
        event?.preventDefault();
        event?.stopPropagation();
        return false;
    }

    AllTransToNo() {
        const keys = this.layoutsmapper[this.activeMainTab]?.layers[this.activeTab]?.keymap?.flat();
        this.changingTransToNo = keys.find(key => !key.firstByte && key.secondByte === 1);
        if (this.changingTransToNo) {
            this.store.dispatch(mapperActions.changeKey({
                fromKey: {
                    code: 'KC_NO',
                    firstByte: 0,
                    secondByte: 0
                },
                toKey: this.changingTransToNo
            }));
        }
    }
}

