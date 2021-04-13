import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError, first, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { AppState } from 'src/app/app.reducer';
import { RequestsService } from '../services/requests.service';
import * as errorsActions from '../errors/errors.actions';
import * as mapperActions from './mapper.actions';
import * as keyboardActions from '../keyboard/keyboard.actions';
import * as devicesActions from '../devices/devices.actions';
import * as keymapsActions from '../keymaps/keymaps.actions';
import * as lightActions from '../light/light.actions';
import * as defsActions from '../keyboard/defs.actions';

@Injectable()
export class MapperEffects {

    setKeycode$ = createEffect((): any => this.actions$.pipe(
        ofType(mapperActions.changeKey.type),
        mergeMap((action: any) => from(this.store.select('keyboard'))
            .pipe(
                first(),
                mergeMap(keyboard => from(this.requestService.setKeycode( keyboard, action.fromKey, action.toKey ))),
                map(success => ({ type: mapperActions.keyChanged.type, success })),
                catchError(textInfo => of({ type: errorsActions.add.type, textInfo }))
            )
        )
    ));

    disconnect$ = createEffect((): any => this.actions$.pipe(
        ofType(mapperActions.disconnect.type),
        tap(() => this.store.dispatch(devicesActions.clear())),
        tap(() => this.store.dispatch(keyboardActions.clear())),
        tap(() => this.store.dispatch(keymapsActions.clear())),
        tap(() => this.store.dispatch(lightActions.clear())),
        tap(() => this.store.dispatch(defsActions.clear())),
        tap(() => this.router.navigate([ '/' ])),
        map(() => ({ type: mapperActions.clear.type })),
        catchError(textInfo => of({ type: errorsActions.add.type, textInfo }))
    ));

    constructor(
        private actions$: Actions,
        private requestService: RequestsService,
        private store: Store<AppState>,
        private router: Router
    ) { }
}
