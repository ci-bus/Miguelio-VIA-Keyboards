import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import * as errorsActions from '../errors/errors.actions';
import { Keymap, Keymapper, Layout, LayoutV2 } from '../interfaces';
import keycodes from '../keycodes';

@Injectable()
export class keymapsHelper {

    keycodes: Array<string> = keycodes;

    constructor(
        private store: Store<AppState>
    ) { }

    private createKeymapObjects(keymap) {
        return keymap.map(row => row.map(key => {
            return typeof key == 'number' ? { u: key} : key;
        }));
    }

    public compileKeymapper(layout: Layout, keymap: Keymap, layerNumber: number): Layout {
        let matrix = layout.matrix,
            fullKeymap = this.createKeymapObjects(layout.keymap);
        try {
            for (let matrixRow = 0; matrixRow < layout.rows; matrixRow ++) {
                for (let matrixCol = 0; matrixCol < layout.cols; matrixCol ++) {
                    let index = matrixRow * layout.cols + matrixCol;
                    let key = keymap.keys[index];
                    if (!key) console.log('no esta la key', index);
                    if (matrix[matrixRow][matrixCol]) {
                        let row = matrix[matrixRow][matrixCol][0],
                            col = matrix[matrixRow][matrixCol][1];
                        if (!fullKeymap[row][col]) {
                            this.store.dispatch(errorsActions.add({
                                textInfo: `Layout mal definido en json, no hay keymap en la posición ${row}, ${col}`
                            }));
                        } else {
                            let code = keycodes[0][0];
                            if (keycodes[key.firstByte]) {
                                if (typeof keycodes[key.firstByte] == 'string') {
                                    code = keycodes[key.firstByte];
                                } else if (keycodes[key.firstByte][key.secondByte]) {
                                    code = keycodes[key.firstByte][key.secondByte];
                                }
                            }
                            fullKeymap[row][col] = Object.assign({},
                                fullKeymap[row][col],
                                key, {
                                code,
                                layer: layerNumber,
                                row: matrixRow, col: matrixCol,
                                layout: layout.name
                            });
                        }
                    } else if (matrix[matrixRow][matrixCol] !== null) {
                        this.store.dispatch(errorsActions.add({
                            textInfo: `Layout mal definido en json, falta matrix en la posición ${matrixRow} ${matrixCol}`
                        }));
                    }
                }
            }
        } catch (err) {
            this.store.dispatch(errorsActions.add({
                textInfo: 'Layout mal definido en json'
            }));
            return layout;
        }
        return fullKeymap;
    }

    public compileKeymapperV2(layout: Layout | LayoutV2, keymap: Keymap, layerNumber: number): any {
        let fullKeymap = [ ...layout.keymap ];
        try {
            fullKeymap = fullKeymap.map((key: Keymapper) => ({
                ...key,
                ...keymap.keys[(key.matrix[0] * layout.cols + key.matrix[1])],
                row: key.matrix[0],
                col: key.matrix[1],
                w: key.w || 1,
                h: key.h || 1,
                layer: layerNumber,
                layout: layout.name
            }));
            fullKeymap = fullKeymap.map((key: Keymapper) => ({
                ...key,
                code: keycodes[key.firstByte] && keycodes[key.firstByte][key.secondByte]
                    ? keycodes[key.firstByte][key.secondByte] : keycodes[0][0]
            }));
        } catch (err) {
            this.store.dispatch(errorsActions.add({
                textInfo: 'Layout mal definido en json'
            }));
            return layout;
        }
        return fullKeymap;
    }
}

