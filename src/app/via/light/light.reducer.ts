import { createReducer, on } from '@ngrx/store';
import { LightValues } from '../interfaces';
import { set, changePropValue } from './light.actions';

const initialState: LightValues = {};

const _lightReducer = createReducer(
    initialState,
    on(set, (state, { lightValues }) => lightValues)
);

export function lightReducer(state, action) {
    return _lightReducer(state, action);
}