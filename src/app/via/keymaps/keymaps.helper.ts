import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import * as errorsActions from '../errors/errors.actions';
import { Keymap, Layout } from '../interfaces';
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
                            fullKeymap[row][col] = Object.assign({},
                                fullKeymap[row][col],
                                key, {
                                code: keycodes[key.firstByte] && keycodes[key.firstByte][key.secondByte]
                                    ? keycodes[key.firstByte][key.secondByte] : keycodes[0][0],
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
}

