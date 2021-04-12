import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError, first, tap } from 'rxjs/operators';
import { RequestsService } from '../services/requests.service';
import * as errorsActions from '../errors/errors.actions';
import * as lightAction from './light.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

@Injectable()
export class LightEffects {

    loadLight$ = createEffect((): any => this.actions$.pipe(
        ofType(lightAction.get.type),
        mergeMap((action: any) => from(this.store.select('keyboard'))
            .pipe(
                first(),
                mergeMap(keyboard => from(this.requestService.loadLight(keyboard, action.lighting))),
                map(lightValues => ({ type: lightAction.set.type, lightValues })),
                catchError(textInfo => of({ type: errorsActions.add.type, textInfo }))
            )
        )
    ));

    changePropValue$ = createEffect((): any => this.actions$.pipe(
        ofType(lightAction.changePropValue.type),
        mergeMap((action: any) => from(this.store.select('keyboard'))
            .pipe(
                first(),
                mergeMap(keyboard => from(this.requestService.changeLight(keyboard, action.prop, action.firstByte, action.secondByte))),
                map(success => ({ type: lightAction.lightChanged.type, success })),
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