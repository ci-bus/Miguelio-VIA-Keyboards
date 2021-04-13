import { createAction, props } from '@ngrx/store';
import { Keymapper, Layoutmapper } from '../interfaces';

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
)