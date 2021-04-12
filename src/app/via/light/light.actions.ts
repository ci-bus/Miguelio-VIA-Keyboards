import { createAction, props } from '@ngrx/store';
import { Lighting, LightValues } from '../interfaces';

export const get = createAction(
    '[Light] Get',
    props<{ lighting: Lighting }>()
);

export const set = createAction(
    '[Light] Set',
    props<{ lightValues: LightValues }>()
);

export const changePropValue = createAction(
    '[Light] Change backlight',
    props<{ prop: number, firstByte: number, secondByte?: number }>()
);

export const lightChanged = createAction(
    '[Light] Light changed',
    props<{ success: boolean }>()
)

