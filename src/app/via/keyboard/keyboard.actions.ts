import { createAction, props } from '@ngrx/store';
import { Device } from '../devices/device.model';
import { Defs } from './defs.model';

export const create = createAction(
    '[Keyboard] Create',
    props<{ device: Device }>()
);

export const setCountLayers = createAction(
    '[Keyboard] Set count layers',
    props<{ layers: number }>()
);

export const clear = createAction(
    '[Keyboard] Clear'
);


