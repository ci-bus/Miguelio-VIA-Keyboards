import { createReducer, on } from '@ngrx/store';
import { clear, set } from './devices.actions';
import { Device } from './device.model';

const initialState: Device[] = [];

const _devicesReducer = createReducer(
    initialState,
    on(set, (state, { devices }) => devices),
    on(clear, state => [])
);

export function devicesReducer(state, action) {
    return _devicesReducer(state, action);
}
