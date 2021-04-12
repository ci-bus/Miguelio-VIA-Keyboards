import { createAction, props } from '@ngrx/store';
import { Keymap } from '../interfaces';

export const set = createAction(
    '[Keymaps] Set',
    props<{ keymaps: Keymap[] }>()
);

export const clear = createAction(
    '[Keymaps] Clear'
);



