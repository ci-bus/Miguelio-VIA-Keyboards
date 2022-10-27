import { createReducer, on } from '@ngrx/store';
import { set, setLayers, clear } from './defs.actions';
import { Defs } from './defs.model';

const initialState: Defs = new Defs();

const _defsReducer = createReducer(
    initialState,
    on(set, (state, { defs }) => defs),
    on(setLayers, (state, { layers }) => {
        return { ...state, layers };
    }),
    on(clear, state => new Defs())
);

export function defsReducer(state, action) {
    return _defsReducer(state, action);
}
