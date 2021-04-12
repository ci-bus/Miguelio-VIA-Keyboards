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

    public makeKeymap(layout: Layout, keymap: Keymap): Layout {
        let matrix = layout.matrix,
            fullKeymap = this.createKeymapObjects(layout.keymap);
        try {
            for (let i = 0; i < keymap.keys.length; i ++) {
                let key = keymap.keys[i];
                if (matrix[i]) {
                    let row = matrix[i][0],
                        col = matrix[i][1];
                    if (!fullKeymap[row][col]) {
                        this.store.dispatch(errorsActions.add({
                            textInfo: `Layout matrix mal definido en json, no hay keymap en la posición ${row}, ${col}`
                        }));
                    } else {
                        fullKeymap[row][col] = Object.assign({}, 
                            fullKeymap[row][col], 
                            key, 
                            { code: keycodes[key.firstByte] && keycodes[key.firstByte][key.secondByte]
                                ? keycodes[key.firstByte][key.secondByte] : keycodes[0][0]
                        });
                    }
                } else if (matrix[i] !== null) {
                    this.store.dispatch(errorsActions.add({
                        textInfo: `Layout mal definido en json, falta matrix en la posición ${i}`
                    }));
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

