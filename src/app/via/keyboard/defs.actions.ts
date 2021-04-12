import { createAction, props } from '@ngrx/store';
import { Defs } from './defs.model';

export const set = createAction(
    '[Defs] Set',
    props<{ defs: Defs }>()
);

export const setLayers = createAction(
    '[Defs] Set layers',
    props<{ layers: number }>()
);

export const clear = createAction(
    '[Defs] Clear'
);