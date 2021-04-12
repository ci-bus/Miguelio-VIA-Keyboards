import { createAction, props } from '@ngrx/store';

export const add = createAction(
    '[Errors] Add',
    props<{ textInfo: string }>()
);

export const readAll = createAction(
    '[Errors] Read all'
);