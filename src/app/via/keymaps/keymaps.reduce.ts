import { createReducer, on } from '@ngrx/store';
import { Keymap } from '../interfaces';
import { set, clear } from './keymaps.actions';

const initialState: Keymap[] = [];

const _keymapsReducer = createReducer(
    initialState,
    on(set, (state, { keymaps }) => keymaps),
    on(clear, state => [])
);

export function keymapsReducer(state, action) {
    return _keymapsReducer(state, action);
}