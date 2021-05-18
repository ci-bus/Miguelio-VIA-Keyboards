import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppState } from '../../app.reducer';
import { checkStatusResponse, GetQmkKeyboardResponse, compileFirmwareResponse } from './services.interfaces';

@Injectable({
    providedIn: 'root'
})
export class QmkService {
    constructor(
        private store: Store<AppState>,
        private http: HttpClient
    ) { }

    // Get Qmk keyboard
    public getQmkKeyboard(keyboardModel: string): Observable<GetQmkKeyboardResponse> {
        return this.http.get<GetQmkKeyboardResponse>('https://api.qmk.fm/v1/keyboards/'+keyboardModel);
    }

    // compile firmware
    public compileFirmware(data): Observable<compileFirmwareResponse> {
        return this.http.post<compileFirmwareResponse>('https://api.qmk.fm/v1/compile', data);
    }

    // Check compiling
    public checkStatus(compile: compileFirmwareResponse): Observable<checkStatusResponse> {
        return this.http.get<checkStatusResponse>('https://api.qmk.fm/v1/compile/' + compile.job_id);
    }
}
