import { createReducer, on } from '@ngrx/store';
import { Layoutmapper } from '../interfaces';
import { changeKey, set } from './mapper.actions';

export const initialState: Layoutmapper[] = [];

const _mapperReducer = createReducer(initialState,
    on(set, (state, { layoutsmapper }) => layoutsmapper),
    on(changeKey, (state, { dragKey, dropKey }) => state.map(layout => {
        let tempLayout = { ...layout };
        if (tempLayout.name === dropKey.layout) {
            tempLayout.layers = tempLayout.layers.map(layer => {
                let tempLayer = { ...layer };
                if (tempLayer.number === dropKey.layer) {
                    tempLayer.keymap = tempLayer.keymap.map(rowKeys => rowKeys.map(keyState => {
                        return keyState.row === dropKey.row && keyState.col === dropKey.col
                            ? Object.assign({ ...dropKey }, { 
                                code: dragKey.code,
                                firstByte: dragKey.firstByte,
                                secondByte: dragKey.secondByte 
                            }) : keyState;
                    }))
                }
                return tempLayer;
            });
        }
        return tempLayout;
    }))
);

export function mapperReducer(state, action) {
    return _mapperReducer(state, action);
}