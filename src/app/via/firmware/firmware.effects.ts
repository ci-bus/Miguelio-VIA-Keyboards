import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AppState } from '../../app.reducer';
import * as firmwareActions from './firmware.actions';
import * as errorsActions from '../errors/errors.actions';
import { QmkService } from '../services/qmk.service';

@Injectable()
export class FirmwareEffects {

    getQmkKeyboard$ = createEffect((): any => this.actions$.pipe(
        ofType(firmwareActions.getKeyboard.type),
        map(({ keyboardModel }) => keyboardModel),
        switchMap(keyboardModel => from(this.qmkService.getQmkKeyboard(keyboardModel))),
        map(({ keyboards }) => ({ type: firmwareActions.setKeyboard.type, qmkKeyboards: keyboards })),
        catchError(textInfo => of({ type: errorsActions.add.type, textInfo }))
    ));

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private qmkService: QmkService
    ) { }
}
