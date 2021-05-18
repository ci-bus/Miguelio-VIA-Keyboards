import { createReducer, on } from '@ngrx/store';
import { FirmwareState } from '../interfaces';
import { getKeyboard, setKeyboard, changeKey, setLayout, setKeyboardsList } from './firmware.actions';

const initialState: FirmwareState = undefined;

const _firmwareReducer = createReducer(
    initialState,
    on(setKeyboardsList, (state, { keyboardsList }) => ({
        ...state,
        keyboardsList
    })),
    on(getKeyboard, (state, { keyboardModel }) => ({
        ...state,
        model: keyboardModel,
        qmkKeyboard: undefined,
        layout: undefined
    })),
    on(setKeyboard, (state, { qmkKeyboards }) => ({
        ...state,
        qmkKeyboard: {
            ...qmkKeyboards[state.model]
        }
    })),
    on(setLayout, (state, { qmkKeyboardsLayout }) => ({
        ...state,
        layout: qmkKeyboardsLayout
    })),
    on(changeKey, (state, { fromKey, toKey }) => {
        return ({
            ...state,
            layout: {
                ...state.layout,
                layout: state.layout.layout.map(layoutDef => {
                    return layoutDef.label == toKey.label
                        ? { ...toKey, ...fromKey }
                        : layoutDef;
                })
            }
        })
    })
);

export function firmwareReducer(state, action) {
    return _firmwareReducer(state, action);
}
