import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError, first, tap } from 'rxjs/operators';
import { RequestsService } from '../services/requests.service';
import * as errorsActions from '../errors/errors.actions';
import * as defsActions from './defs.actions';
import * as keymapsActions from '../keymaps/keymaps.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Router } from '@angular/router';

@Injectable()
export class DefsEffects {

    loadDefs$ = createEffect((): any => this.actions$.pipe(
        ofType(defsActions.set.type),
        mergeMap(() => from(this.store.select('keyboard'))
            .pipe(
                first(),
                mergeMap(keyboard => from(this.requestService.getCountLayers(keyboard))),
                map(layers => ({ type: defsActions.setLayers.type, layers })),
                catchError(textInfo => of({ type: errorsActions.add.type, textInfo }))
            )
        )
    ));

    loadLayers$ = createEffect((): any => this.actions$.pipe(
        ofType(defsActions.setLayers.type),
        mergeMap(() => from(this.store.select('keyboard'))
            .pipe(
                first(),
                mergeMap(keyboard => from(this.store.select('defs'))
                    .pipe(
                        first(),
                        mergeMap(defs => from(this.requestService.loadKeymaps(keyboard, defs))),
                        map(keymaps => ({ type: keymapsActions.set.type, keymaps })),
                        catchError(textInfo => of({ type: errorsActions.add.type, textInfo })),
                        tap(() => setTimeout(() => this.router.navigate(['mapper']), 250))
                    )
                ),
            )
        )
    ));

    constructor(
        private actions$: Actions,
        private requestService: RequestsService,
        private store: Store<AppState>,
        private router: Router
    ) { }
}