import { createReducer, on } from '@ngrx/store';
import { Layoutmapper } from '../interfaces';
import { changeKey, clear, keyChanged, pressKey, releaseKey, set, toogleSelected } from './mapper.actions';

export const initialState: Layoutmapper[] = [];

const _mapperReducer = createReducer(initialState,
  on(set, (state, { layoutsmapper }) => layoutsmapper),
  on(changeKey, (state, { fromKey, toKey }) => state.map(layout => {
    let tempLayout = { ...layout, loading: true };
    if (tempLayout.name === toKey.layout) {
      tempLayout.layers = tempLayout.layers.map(layer => {
        let tempLayer = { ...layer };
        if (tempLayer.number === toKey.layer) {
          tempLayer.keymap = tempLayer.keymap.map(rowKeys => rowKeys.map(tempKey => {
            return tempKey.row !== toKey.row || tempKey.col !== toKey.col
              ? {
                ...tempKey,
                selected: false
              } : {
                ...toKey,
                code: fromKey.code,
                firstByte: fromKey.firstByte,
                secondByte: fromKey.secondByte,
                selected: false
              };
          }))
        }
        return tempLayer;
      });
    }
    return tempLayout;
  })),
  on(clear, (state) => []),
  on(keyChanged, state => state.map(layout => ({ ...layout, loading: false }))),
  on(pressKey, (state, { key }) => state.map(layout => {
    return layout.name !== key.layout ? layout
      : {
        ...layout,
        layers: layout.layers.map(layer => {
          return layer.number !== key.layer ? layer
            : {
              ...layer,
              keymap: layer.keymap.map(rowKeys => rowKeys.map(tempKey => {
                return tempKey.code !== key.code ? tempKey
                  : {
                    ...tempKey,
                    pressed: true
                  }
              }))
            }
        })
      }
  })),
  on(releaseKey, (state, { key }) => state.map(layout => {
    return layout.name !== key.layout ? layout
      : {
        ...layout,
        layers: layout.layers.map(layer => {
          return layer.number !== key.layer ? layer
            : {
              ...layer,
              keymap: layer.keymap.map(rowKeys => rowKeys.map(tempKey => {
                return tempKey.code !== key.code ? tempKey
                  : {
                    ...tempKey,
                    pressed: false
                  }
              }))
            }
        })
      }
  })),
  on(toogleSelected, (state, { key }) => state.map(layout => {
    return layout.name !== key.layout ? layout
      : {
        ...layout,
        layers: layout.layers.map(layer => {
          return layer.number !== key.layer ? layer
            : {
              ...layer,
              keymap: layer.keymap.map(rowKeys => rowKeys.map(tempKey => ({
                ...tempKey,
                selected: tempKey.row === key.row && tempKey.col === key.col
                  ? !tempKey.selected
                  : false
              })))
            }
        })
      }
  }))
);

export function mapperReducer(state, action) {
  return _mapperReducer(state, action);
}
