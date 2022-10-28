import { createAction, props } from '@ngrx/store';
import { freeSpaceMatrix, freeSpaceValues, Keymapper, Layoutmapper } from '../interfaces';

export const set = createAction(
    '[Mapper] Set',
    props<{ layoutsmapper: Layoutmapper[] }>()
);

export const changeKey = createAction(
    '[Mapper] Change key',
    props<{ fromKey: Keymapper, toKey: Keymapper }>()
);

export const keyChanged = createAction(
    '[Mapper] Key changed',
    props<{ success: boolean }>()
);

export const resetKeycodes = createAction(
    '[Mapper] Reset keycodes'
);

export const clear = createAction(
    '[Mapper] Clear'
);

export const disconnect = createAction(
    '[Mapper] Disconnect'
);

export const saveFreeSpaceValues = createAction(
    '[Mapper] Save free space values',
    props<{ freeSpaceValues: freeSpaceValues[] }>()
);

export const freeSpaceValuesSaved = createAction(
    '[Mapper] Free space values saved',
    props<{ success: boolean }>()
);

export const pressKey = createAction(
    '[Mapper] Press key to test',
    props<{ key: Keymapper }>()
);

export const releaseKey = createAction(
    '[Mapper] Release key to test',
    props<{ key: Keymapper }>()
);
