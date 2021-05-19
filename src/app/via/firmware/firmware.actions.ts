import { createAction, props } from '@ngrx/store';
import { Keymapper, QmkKeyboards, QmkKeyboardKeymapper, QmkKeyboardLayout } from '../interfaces';

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
    props<{ layerNumber: number, fromKey: Keymapper, toKey: QmkKeyboardKeymapper }>()
);

export const clear = createAction(
    '[Firmware] Clear'
);

export const unselect = createAction(
    '[Firmware] Unselect',
    props<{ layerNumber: number, toKey: QmkKeyboardKeymapper }>()
);



