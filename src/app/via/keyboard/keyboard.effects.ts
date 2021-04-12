import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError, first } from 'rxjs/operators';
import { RequestsService } from '../services/requests.service';
import * as keyboardActions from './keyboard.actions';
import * as errorsActions from '../errors/errors.actions';
import * as defsActions from './defs.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

@Injectable()
export class KeyboardEffects {

    loadKeyboard$ = createEffect((): any => this.actions$.pipe(
        ofType(keyboardActions.create.type),
        mergeMap(() => from(this.store.select('keyboard'))
            .pipe(
                first(),
                mergeMap(keyboard => from(this.requestService.getDefs(keyboard))),
                map(defs => ({ type: defsActions.set.type, defs })),
                catchError(textInfo => of({ type: errorsActions.add.type, textInfo }))
            )
        )
    ));

    constructor(
        private actions$: Actions,
        private requestService: RequestsService,
        private store: Store<AppState>
    ) { }
}