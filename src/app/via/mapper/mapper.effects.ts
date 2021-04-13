import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError, first } from 'rxjs/operators';
import { RequestsService } from '../services/requests.service';
import * as errorsActions from '../errors/errors.actions';
import * as mapperActions from './mapper.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

@Injectable()
export class MapperEffects {

    setKeycode$ = createEffect((): any => this.actions$.pipe(
        ofType(mapperActions.changeKey.type),
        mergeMap((action: any) => from(this.store.select('keyboard'))
            .pipe(
                first(),
                mergeMap(keyboard => from(this.requestService.setKeycode( keyboard, action.dragKey, action.dropKey ))),
                map(success => ({ type: mapperActions.keyChanged.type, success })),
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
