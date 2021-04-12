import { createReducer, on } from '@ngrx/store';
import { clear, create, setCountLayers } from './keyboard.actions';
import { Keyboard } from './keyboard.model';

const initialState: Keyboard = new Keyboard();

const _keyboardReducer = createReducer(
    initialState,
    on(create, (state, { device }) => new Keyboard(device)),
    on(setCountLayers, (state, { layers }) => {
        return state;
    }),
    on(clear, state => new Keyboard())
);

export function keyboardReducer(state, action) {
    return _keyboardReducer(state, action);
}