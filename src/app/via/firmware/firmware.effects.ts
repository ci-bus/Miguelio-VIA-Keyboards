import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

import * as firmwareActions from './firmware.actions';
import * as errorsActions from '../errors/errors.actions';
import { QmkService } from '../services/qmk.service';
import { RequestsService } from '../services/requests.service';

@Injectable()
export class FirmwareEffects {

    getKeyboardsList$ = createEffect((): any => this.actions$.pipe(
        ofType(firmwareActions.getKeyboardsList.type),
        switchMap(() => from(this.qmkService.getKeyboardsList())),
        map(keyboardsList => ({ type: firmwareActions.setKeyboardsList.type, keyboardsList })),
        catchError(textInfo => of({ type: errorsActions.add.type, textInfo }))
    ));

    getQmkKeyboard$ = createEffect((): any => this.actions$.pipe(
        ofType(firmwareActions.getKeyboard.type),
        map(({ keyboardModel }) => keyboardModel),
        switchMap(keyboardModel => from(this.qmkService.getQmkKeyboard(keyboardModel))),
        map(({ keyboards }) => ({ type: firmwareActions.setKeyboard.type, qmkKeyboards: keyboards })),
        catchError(textInfo => of({ type: errorsActions.add.type, textInfo }))
    ));

    addSupport$ = createEffect((): any => this.actions$.pipe(
        ofType(firmwareActions.addSupport.type),
        mergeMap(actionData => from(this.requestService.addSupport( actionData ))),
        map(success => ({ type: firmwareActions.addSupportSuccess.type, success })),
        catchError(textInfo => of({ type: errorsActions.add.type, textInfo }))
    ));

    constructor(
        private actions$: Actions,
        private requestService: RequestsService,
        private qmkService: QmkService
    ) { }
}
