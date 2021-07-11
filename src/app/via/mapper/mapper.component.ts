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
    activeMainTab: number = 1;
    activeTab: number = 0;

    draggingKey: Keymapper;

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
            this.layoutsmapper = layoutsmapper;
        });

    }

    createLayoutsmapper() {
        let layoutsmapper = [];
        if (this.defs.layouts.length && this.keymaps.length) {
            if (this.defs.vdoc == 2) {
                debugger;
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
                            keymap: this.keymapsHelper.compileKeymapperV2(tempLayout, keymap, keymap.number)
                        });
                    });
                    layoutsmapper.push({
                        name: layout.name,
                        layers: tempLayers
                    });
                });
                debugger;
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

                debugger;

                this.store.dispatch(mapperActions.set({ layoutsmapper }));
            }


            /*
[
    {
        "name": "ALL",
        "layers": [
            {
                "number": 0,
                "keymap": [
                    [
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 41,
                            "code": "KC_ESCAPE",
                            "layer": 0,
                            "row": 0,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 30,
                            "code": "KC_1",
                            "layer": 0,
                            "row": 1,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 31,
                            "code": "KC_2",
                            "layer": 0,
                            "row": 0,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 32,
                            "code": "KC_3",
                            "layer": 0,
                            "row": 1,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 33,
                            "code": "KC_4",
                            "layer": 0,
                            "row": 0,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 34,
                            "code": "KC_5",
                            "layer": 0,
                            "row": 1,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 35,
                            "code": "KC_6",
                            "layer": 0,
                            "row": 0,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 36,
                            "code": "KC_7",
                            "layer": 0,
                            "row": 1,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 37,
                            "code": "KC_8",
                            "layer": 0,
                            "row": 0,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 38,
                            "code": "KC_9",
                            "layer": 0,
                            "row": 1,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 39,
                            "code": "KC_0",
                            "layer": 0,
                            "row": 0,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 45,
                            "code": "KC_MINUS",
                            "layer": 0,
                            "row": 1,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 46,
                            "code": "KC_EQUAL",
                            "layer": 0,
                            "row": 0,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 2,
                            "firstByte": 0,
                            "secondByte": 42,
                            "code": "KC_BSPACE",
                            "layer": 0,
                            "row": 1,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 74,
                            "code": "KC_HOME",
                            "layer": 0,
                            "row": 0,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ],
                    [
                        {
                            "u": 1.5,
                            "firstByte": 0,
                            "secondByte": 43,
                            "code": "KC_TAB",
                            "layer": 0,
                            "row": 2,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 20,
                            "code": "KC_Q",
                            "layer": 0,
                            "row": 3,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 26,
                            "code": "KC_W",
                            "layer": 0,
                            "row": 2,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 8,
                            "code": "KC_E",
                            "layer": 0,
                            "row": 3,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 21,
                            "code": "KC_R",
                            "layer": 0,
                            "row": 2,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 23,
                            "code": "KC_T",
                            "layer": 0,
                            "row": 3,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 28,
                            "code": "KC_Y",
                            "layer": 0,
                            "row": 2,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 24,
                            "code": "KC_U",
                            "layer": 0,
                            "row": 3,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 12,
                            "code": "KC_I",
                            "layer": 0,
                            "row": 2,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 18,
                            "code": "KC_O",
                            "layer": 0,
                            "row": 3,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 19,
                            "code": "KC_P",
                            "layer": 0,
                            "row": 2,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 47,
                            "code": "KC_LBRACKET",
                            "layer": 0,
                            "row": 3,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 48,
                            "code": "KC_RBRACKET",
                            "layer": 0,
                            "row": 2,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.5,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 0,
                            "row": 3,
                            "col": 7,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 77,
                            "code": "KC_END",
                            "layer": 0,
                            "row": 5,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ],
                    [
                        {
                            "u": 1.75,
                            "firstByte": 0,
                            "secondByte": 57,
                            "code": "KC_CAPSLOCK",
                            "layer": 0,
                            "row": 4,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 4,
                            "code": "KC_A",
                            "layer": 0,
                            "row": 5,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 22,
                            "code": "KC_S",
                            "layer": 0,
                            "row": 4,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 7,
                            "code": "KC_D",
                            "layer": 0,
                            "row": 5,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 9,
                            "code": "KC_F",
                            "layer": 0,
                            "row": 4,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 10,
                            "code": "KC_G",
                            "layer": 0,
                            "row": 5,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 11,
                            "code": "KC_H",
                            "layer": 0,
                            "row": 4,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 13,
                            "code": "KC_J",
                            "layer": 0,
                            "row": 5,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 14,
                            "code": "KC_K",
                            "layer": 0,
                            "row": 4,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 15,
                            "code": "KC_L",
                            "layer": 0,
                            "row": 5,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 51,
                            "code": "KC_SCOLON",
                            "layer": 0,
                            "row": 4,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 52,
                            "code": "KC_QUOTE",
                            "layer": 0,
                            "row": 5,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 50,
                            "code": "KC_NONUS_HASH",
                            "layer": 0,
                            "row": 4,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.25,
                            "firstByte": 0,
                            "secondByte": 40,
                            "code": "KC_ENTER",
                            "layer": 0,
                            "row": 5,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 76,
                            "code": "KC_DELETE",
                            "layer": 0,
                            "row": 4,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ],
                    [
                        {
                            "u": 1.25,
                            "firstByte": 0,
                            "secondByte": 225,
                            "code": "KC_LSHIFT",
                            "layer": 0,
                            "row": 6,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 100,
                            "code": "KC_NONUS_BSLASH",
                            "layer": 0,
                            "row": 7,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 29,
                            "code": "KC_Z",
                            "layer": 0,
                            "row": 6,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 27,
                            "code": "KC_X",
                            "layer": 0,
                            "row": 7,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 6,
                            "code": "KC_C",
                            "layer": 0,
                            "row": 6,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 25,
                            "code": "KC_V",
                            "layer": 0,
                            "row": 7,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 5,
                            "code": "KC_B",
                            "layer": 0,
                            "row": 6,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 17,
                            "code": "KC_N",
                            "layer": 0,
                            "row": 7,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 16,
                            "code": "KC_M",
                            "layer": 0,
                            "row": 6,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 54,
                            "code": "KC_COMMA",
                            "layer": 0,
                            "row": 7,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 55,
                            "code": "KC_DOT",
                            "layer": 0,
                            "row": 6,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 56,
                            "code": "KC_SLASH",
                            "layer": 0,
                            "row": 7,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.75,
                            "firstByte": 0,
                            "secondByte": 229,
                            "code": "KC_RSHIFT",
                            "layer": 0,
                            "row": 6,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 82,
                            "code": "KC_UP",
                            "layer": 0,
                            "row": 7,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 81,
                            "secondByte": 2,
                            "code": "MO(2)",
                            "layer": 0,
                            "row": 6,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ],
                    [
                        {
                            "u": 1.25,
                            "firstByte": 0,
                            "secondByte": 224,
                            "code": "KC_LCTRL",
                            "layer": 0,
                            "row": 8,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.25,
                            "firstByte": 0,
                            "secondByte": 227,
                            "code": "KC_LGUI",
                            "layer": 0,
                            "row": 8,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.25,
                            "firstByte": 0,
                            "secondByte": 226,
                            "code": "KC_LALT",
                            "layer": 0,
                            "row": 8,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 6.25,
                            "firstByte": 0,
                            "secondByte": 44,
                            "code": "KC_SPACE",
                            "layer": 0,
                            "row": 8,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 230,
                            "code": "KC_RALT",
                            "layer": 0,
                            "row": 8,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 0,
                            "row": 8,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 81,
                            "secondByte": 1,
                            "code": "MO(1)",
                            "layer": 0,
                            "row": 3,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 80,
                            "code": "KC_LEFT",
                            "layer": 0,
                            "row": 8,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 81,
                            "code": "KC_DOWN",
                            "layer": 0,
                            "row": 8,
                            "col": 7,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 79,
                            "code": "KC_RIGHT",
                            "layer": 0,
                            "row": 7,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ]
                ]
            },
            {
                "number": 1,
                "keymap": [
                    [
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 53,
                            "code": "KC_GRAVE",
                            "layer": 1,
                            "row": 0,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 58,
                            "code": "KC_F1",
                            "layer": 1,
                            "row": 1,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 59,
                            "code": "KC_F2",
                            "layer": 1,
                            "row": 0,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 60,
                            "code": "KC_F3",
                            "layer": 1,
                            "row": 1,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 61,
                            "code": "KC_F4",
                            "layer": 1,
                            "row": 0,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 62,
                            "code": "KC_F5",
                            "layer": 1,
                            "row": 1,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 63,
                            "code": "KC_F6",
                            "layer": 1,
                            "row": 0,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 64,
                            "code": "KC_F7",
                            "layer": 1,
                            "row": 1,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 65,
                            "code": "KC_F8",
                            "layer": 1,
                            "row": 0,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 66,
                            "code": "KC_F9",
                            "layer": 1,
                            "row": 1,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 67,
                            "code": "KC_F10",
                            "layer": 1,
                            "row": 0,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 68,
                            "code": "KC_F11",
                            "layer": 1,
                            "row": 1,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 69,
                            "code": "KC_F12",
                            "layer": 1,
                            "row": 0,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 2,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 1,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 167,
                            "code": "KC_SYSTEM_WAKE",
                            "layer": 1,
                            "row": 0,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ],
                    [
                        {
                            "u": 1.5,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 2,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 3,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 189,
                            "code": "KC_BRIGHTNESS_UP",
                            "layer": 1,
                            "row": 2,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 3,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 2,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 3,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 2,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 3,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 2,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 3,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 2,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 3,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 2,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.5,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 3,
                            "col": 7,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 165,
                            "code": "KC_SYSTEM_POWER",
                            "layer": 1,
                            "row": 5,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ],
                    [
                        {
                            "u": 1.75,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 4,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 5,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 190,
                            "code": "KC_BRIGHTNESS_DOWN",
                            "layer": 1,
                            "row": 4,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 5,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 4,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 5,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 4,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 5,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 4,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 5,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 4,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 5,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 4,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.25,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 5,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 166,
                            "code": "KC_SYSTEM_SLEEP",
                            "layer": 1,
                            "row": 4,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ],
                    [
                        {
                            "u": 1.25,
                            "firstByte": 0,
                            "secondByte": 225,
                            "code": "KC_LSHIFT",
                            "layer": 1,
                            "row": 6,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 7,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 6,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 7,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 6,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 7,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 6,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 7,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 6,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 7,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 6,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 7,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.75,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 6,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 169,
                            "code": "KC_AUDIO_VOL_UP",
                            "layer": 1,
                            "row": 7,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 6,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ],
                    [
                        {
                            "u": 1.25,
                            "firstByte": 0,
                            "secondByte": 224,
                            "code": "KC_LCTRL",
                            "layer": 1,
                            "row": 8,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.25,
                            "firstByte": 0,
                            "secondByte": 227,
                            "code": "KC_LGUI",
                            "layer": 1,
                            "row": 8,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.25,
                            "firstByte": 0,
                            "secondByte": 226,
                            "code": "KC_LALT",
                            "layer": 1,
                            "row": 8,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 6.25,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 8,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 230,
                            "code": "KC_RALT",
                            "layer": 1,
                            "row": 8,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 8,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 1,
                            "row": 3,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 168,
                            "code": "KC_AUDIO_MUTE",
                            "layer": 1,
                            "row": 8,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 170,
                            "code": "KC_AUDIO_VOL_DOWN",
                            "layer": 1,
                            "row": 8,
                            "col": 7,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 174,
                            "code": "KC_MEDIA_PLAY_PAUSE",
                            "layer": 1,
                            "row": 7,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ]
                ]
            },
            {
                "number": 2,
                "keymap": [
                    [
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 0,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 92,
                            "secondByte": 205,
                            "code": "RGB_MODE_PLAIN",
                            "layer": 2,
                            "row": 1,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 92,
                            "secondByte": 206,
                            "code": "RGB_MODE_BREATHE",
                            "layer": 2,
                            "row": 0,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 92,
                            "secondByte": 207,
                            "code": "RGB_MODE_RAINBOW",
                            "layer": 2,
                            "row": 1,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 92,
                            "secondByte": 208,
                            "code": "RGB_MODE_SWIRL",
                            "layer": 2,
                            "row": 0,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 92,
                            "secondByte": 209,
                            "code": "RGB_MODE_SNAKE",
                            "layer": 2,
                            "row": 1,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 92,
                            "secondByte": 210,
                            "code": "RGB_MODE_KNIGHT",
                            "layer": 2,
                            "row": 0,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 92,
                            "secondByte": 211,
                            "code": "RGB_MODE_XMAS",
                            "layer": 2,
                            "row": 1,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 92,
                            "secondByte": 212,
                            "code": "RGB_MODE_GRADIENT",
                            "layer": 2,
                            "row": 0,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 92,
                            "secondByte": 213,
                            "code": "RGB_MODE_RGBTEST",
                            "layer": 2,
                            "row": 1,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 0,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 1,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 0,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 2,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 1,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 0,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ],
                    [
                        {
                            "u": 1.5,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 2,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 92,
                            "secondByte": 194,
                            "code": "RGB_TOG",
                            "layer": 2,
                            "row": 3,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 92,
                            "secondByte": 195,
                            "code": "RGB_MODE_FORWARD",
                            "layer": 2,
                            "row": 2,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 92,
                            "secondByte": 196,
                            "code": "RGB_MODE_REVERSE",
                            "layer": 2,
                            "row": 3,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 92,
                            "secondByte": 197,
                            "code": "RGB_HUI",
                            "layer": 2,
                            "row": 2,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 92,
                            "secondByte": 198,
                            "code": "RGB_HUD",
                            "layer": 2,
                            "row": 3,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 92,
                            "secondByte": 199,
                            "code": "RGB_SAI",
                            "layer": 2,
                            "row": 2,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 92,
                            "secondByte": 200,
                            "code": "RGB_SAD",
                            "layer": 2,
                            "row": 3,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 92,
                            "secondByte": 201,
                            "code": "RGB_VAI",
                            "layer": 2,
                            "row": 2,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 92,
                            "secondByte": 202,
                            "code": "RGB_VAD",
                            "layer": 2,
                            "row": 3,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 2,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 3,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 2,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.5,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 3,
                            "col": 7,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 5,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ],
                    [
                        {
                            "u": 1.75,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 4,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 5,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 4,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 5,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 4,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 5,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 4,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 5,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 4,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 5,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 4,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 5,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 4,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.25,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 5,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 4,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ],
                    [
                        {
                            "u": 1.25,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 6,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 7,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 6,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 7,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 6,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 7,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 6,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 7,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 6,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 7,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 6,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 7,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.75,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 6,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 7,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 6,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ],
                    [
                        {
                            "u": 1.25,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 8,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.25,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 8,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.25,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 8,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 6.25,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 8,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 8,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 8,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 3,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 8,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 8,
                            "col": 7,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 1,
                            "code": "KC_TRNS",
                            "layer": 2,
                            "row": 7,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ]
                ]
            },
            {
                "number": 3,
                "keymap": [
                    [
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 0,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 1,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 0,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 1,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 0,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 1,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 0,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 1,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 43,
                            "secondByte": 42,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 0,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 1,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 40,
                            "code": "KC_ENTER",
                            "layer": 3,
                            "row": 0,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 41,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 1,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 0,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 2,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 1,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 0,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ],
                    [
                        {
                            "u": 1.5,
                            "firstByte": 30,
                            "secondByte": 44,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 2,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 30,
                            "secondByte": 39,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 3,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 32,
                            "secondByte": 52,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 2,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 32,
                            "secondByte": 31,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 3,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 34,
                            "secondByte": 33,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 2,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 34,
                            "secondByte": 33,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 3,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 52,
                            "secondByte": 36,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 2,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 36,
                            "secondByte": 35,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 3,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 39,
                            "secondByte": 38,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 2,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 38,
                            "secondByte": 37,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 3,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 46,
                            "secondByte": 37,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 2,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 51,
                            "secondByte": 51,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 3,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 45,
                            "secondByte": 54,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 2,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.5,
                            "firstByte": 56,
                            "secondByte": 55,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 3,
                            "col": 7,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 45,
                            "secondByte": 35,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 5,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ],
                    [
                        {
                            "u": 1.75,
                            "firstByte": 4,
                            "secondByte": 31,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 4,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 20,
                            "secondByte": 19,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 5,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 6,
                            "secondByte": 5,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 4,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 22,
                            "secondByte": 21,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 5,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 8,
                            "secondByte": 7,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 4,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 24,
                            "secondByte": 23,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 5,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 10,
                            "secondByte": 9,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 4,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 26,
                            "secondByte": 25,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 5,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 12,
                            "secondByte": 11,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 4,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 28,
                            "secondByte": 27,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 5,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 14,
                            "secondByte": 13,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 4,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 47,
                            "secondByte": 29,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 5,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 16,
                            "secondByte": 15,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 4,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.25,
                            "firstByte": 48,
                            "secondByte": 49,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 5,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 18,
                            "secondByte": 17,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 4,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ],
                    [
                        {
                            "u": 1.25,
                            "firstByte": 4,
                            "secondByte": 53,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 6,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 20,
                            "secondByte": 19,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 7,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 6,
                            "secondByte": 5,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 6,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 22,
                            "secondByte": 21,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 7,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 8,
                            "secondByte": 7,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 6,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 24,
                            "secondByte": 23,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 7,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 10,
                            "secondByte": 9,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 6,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 26,
                            "secondByte": 25,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 7,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 12,
                            "secondByte": 11,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 6,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 28,
                            "secondByte": 27,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 7,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 14,
                            "secondByte": 13,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 6,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 47,
                            "secondByte": 29,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 7,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.75,
                            "firstByte": 16,
                            "secondByte": 15,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 6,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 48,
                            "secondByte": 49,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 7,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 18,
                            "secondByte": 17,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 6,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ],
                    [
                        {
                            "u": 1.25,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 8,
                            "col": 0,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.25,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 8,
                            "col": 1,
                            "layout": "ALL"
                        },
                        {
                            "u": 1.25,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 8,
                            "col": 2,
                            "layout": "ALL"
                        },
                        {
                            "u": 6.25,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 8,
                            "col": 3,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 8,
                            "col": 4,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 8,
                            "col": 5,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 46,
                            "secondByte": 54,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 3,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 8,
                            "col": 6,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 0,
                            "secondByte": 0,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 8,
                            "col": 7,
                            "layout": "ALL"
                        },
                        {
                            "u": 1,
                            "firstByte": 76,
                            "secondByte": 53,
                            "code": "KC_NO",
                            "layer": 3,
                            "row": 7,
                            "col": 7,
                            "layout": "ALL"
                        }
                    ]
                ]
            }
        ]
    }
]
            */
        }

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

