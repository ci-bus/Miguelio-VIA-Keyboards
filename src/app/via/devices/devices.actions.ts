import { createAction, props } from '@ngrx/store';
import { Device } from './device.model';

export const get = createAction(
    '[Devices] Get'
);

export const set = createAction(
    '[Devices] Set',
    props<{ devices: Device[] }>()
);

export const clear = createAction(
    '[Devices] Clear'
);


