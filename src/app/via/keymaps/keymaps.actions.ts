import { createAction, props } from '@ngrx/store';
import { Keymap, Keymapper } from '../interfaces';

export const set = createAction(
    '[Keymaps] Set',
    props<{ keymaps: Keymap[] }>()
);

export const clear = createAction(
    '[Keymaps] Clear'
);

export const setKeycode = createAction(
    '[Keymaps] Set keycode',
    props<{ key: Keymapper }>()
);

export const keycodeSetted = createAction(
    '[Keymaps] Keycode setted',
    props<{ success: boolean }>()
);

