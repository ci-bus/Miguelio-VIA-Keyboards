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

  public compileKeymapperV2(layout: Layout | LayoutV2, keymap: Keymap, layerNumber: number): any {
    let fullKeymap = [...layout.keymap];
    try {
      fullKeymap = fullKeymap
        .filter((key: Keymapper) => key.matrix)
        .map((key: Keymapper) => ({
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
      console.error(err);
      this.store.dispatch(errorsActions.add({
        textInfo: 'Layout mal definido en json'
      }));
      return layout;
    }
    return fullKeymap;
  }
}

