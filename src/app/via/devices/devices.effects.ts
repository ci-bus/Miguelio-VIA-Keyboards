import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { RequestsService } from '../services/requests.service';
import * as devicesActions from './devices.actions';
import * as errorsActions from '../errors/errors.actions';

@Injectable()
export class DevicesEffects {
    
    loadDevices$ = createEffect((): any => this.actions$.pipe(
        ofType(devicesActions.get.type),
        mergeMap(() => from(this.requestService.getDevicesList())
            .pipe(
                map(devices => ({ type: devicesActions.set.type, devices })),
                catchError(textInfo => of({ type: errorsActions.add.type, textInfo }))
            )
        )
    ));


    constructor(
        private actions$: Actions,
        private requestService: RequestsService,
    ) { }
}