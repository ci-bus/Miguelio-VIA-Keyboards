import { createAction, props } from '@ngrx/store';
import { Keymapper, QmkKeyboards, QmkKeyboardLayoutDef, QmkKeyboardLayout } from '../interfaces';

export const getKeyboard = createAction(
    '[Firmware] Get keyboard',
    props<{ keyboardModel: string }>()
);

export const setKeyboard = createAction(
    '[Firmware] Set keyboard',
    props<{ qmkKeyboards: QmkKeyboards }>()
);

export const setLayout = createAction(
    '[Firmware] Set layout',
    props<{ qmkKeyboardsLayout: QmkKeyboardLayout }>()
);

export const changeKey = createAction(
    '[Firmware] Change key',
    props<{ fromKey: Keymapper, toKey: QmkKeyboardLayoutDef }>()
);


