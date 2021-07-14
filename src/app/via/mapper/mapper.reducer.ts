import { createReducer, on } from '@ngrx/store';
import { Layoutmapper } from '../interfaces';
import { changeKey, clear, set } from './mapper.actions';

export const initialState: Layoutmapper[] = [];

const _mapperReducer = createReducer(initialState,
    on(set, (state, { layoutsmapper }) => layoutsmapper),
    on(changeKey, (state, { fromKey, toKey }) => state.map(layout => {
        let tempLayout = { ...layout };
        if (tempLayout.name === toKey.layout) {
            tempLayout.layers = tempLayout.layers.map(layer => {
                let tempLayer = { ...layer };
                if (tempLayer.number === toKey.layer) {
                    tempLayer.keymap = tempLayer.keymap.map(rowKeys => rowKeys.map(keyState => {
                        return keyState.row === toKey.row && keyState.col === toKey.col
                            ? Object.assign({ ...toKey }, {
                                code: fromKey.code,
                                firstByte: fromKey.firstByte,
                                secondByte: fromKey.secondByte
                            }) : keyState;
                    }))
                }
                return tempLayer;
            });
        }
        return tempLayout;
    })),
    on(clear, (state) => [])
);

export function mapperReducer(state, action) {
    return _mapperReducer(state, action);
}
