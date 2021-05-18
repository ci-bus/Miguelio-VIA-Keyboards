import { createAction, props } from '@ngrx/store';
import { Keymapper, QmkKeyboards, QmkKeyboardLayoutDef, QmkKeyboardLayout } from '../interfaces';

export const getKeyboardsList = createAction(
    '[Firmware] Get keyboards list'
);

export const setKeyboardsList = createAction(
    '[Firmware] Set keyboards list',
    props<{ keyboardsList: String[] }>()
);

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


