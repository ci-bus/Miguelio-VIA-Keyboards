import { createReducer, on } from '@ngrx/store';
import { FirmwareState } from '../interfaces';
import { getKeyboard, setKeyboard, changeKey, setLayout, setKeyboardsList, clear, unselect, addLayer, addSupport, addSupportSuccess, getKeyboardsList } from './firmware.actions';

const initialState: FirmwareState = undefined;

const _firmwareReducer = createReducer(
    initialState,
    on(getKeyboardsList, state => ({
        ...state,
        savedSupport: false
    })),
    on(setKeyboardsList, (state, { keyboardsList }) => ({
        ...state,
        keyboardsList
    })),
    on(getKeyboard, (state, { keyboardModel }) => ({
        ...state,
        model: keyboardModel,
        qmkKeyboard: undefined,
        layout: undefined,
        layers: undefined
    })),
    on(setKeyboard, (state, { qmkKeyboards }) => ({
        ...state,
        qmkKeyboard: {
            ...qmkKeyboards[state.model]
        }
    })),
    on(setLayout, (state, { qmkKeyboardsLayout }) => ({
        ...state,
        layout: {
            name: qmkKeyboardsLayout.name,
            key_count: qmkKeyboardsLayout.key_count,
            layout: qmkKeyboardsLayout.layout // TODO temp
        },
        layers: [{
            number: 0,
            keymap: [...qmkKeyboardsLayout.layout]
        }, {
            number: 1,
            keymap: [...qmkKeyboardsLayout.layout]
        }, {
            number: 2,
            keymap: [...qmkKeyboardsLayout.layout]
        }, {
            number: 3,
            keymap: [...qmkKeyboardsLayout.layout]
        }]
    })),
    on(changeKey, (state, { layerNumber, fromKey, toKey }) => ({
        ...state,
        layers: state.layers.map(layer => {
            return layer.number == layerNumber
                ? {
                    ...layer,
                    keymap: layer.keymap.map(key => {
                        return key.x == toKey.x && key.y == toKey.y
                            ? { ...toKey, ...fromKey, selected: fromKey.selected }
                            : key;
                    })
                }
                : layer;
        })
    })),
    on(addLayer, (state) => ({
        ...state,
        layers: state.layers.concat({
            ...state.layers[0],
            number: state.layers.length,
            keymap: state.layers[0].keymap.map(key => ({
                ...key,
                code: ''
            }))
        })
    })),
    on(clear, () => undefined),
    on(unselect, (state, { layerNumber, toKey }) => ({
        ...state,
        layers: state.layers.map(layer => {
            return layer.number == layerNumber
                ? {
                    ...layer,
                    keymap: layer.keymap.map(key => {
                        return key.x == toKey.x && key.y == toKey.y
                            ? { ...key, selected: false }
                            : key;
                    })
                }
                : layer;
        })
    })),
    on(addSupport, (state) => ({
        ...state,
        savedSupport: false
    })),
    on(addSupportSuccess, state => ({
        ...state,
        savedSupport: true
    }))
);

export function firmwareReducer(state, action) {
    return _firmwareReducer(state, action);
}
