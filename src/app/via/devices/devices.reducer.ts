import { createReducer, on } from '@ngrx/store';
import { clear, set } from './devices.actions';
import { Device } from './device.model';

const initialState: Device[] = [];

const _devicesReducer = createReducer(
    initialState,
    on(set, (state, { devices }) => devices.map(device => new Device(device))),
    on(clear, state => [])
);

export function devicesReducer(state, action) {
    return _devicesReducer(state, action);
}