import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { checkStatusResponse, GetQmkKeyboardResponse, compileFirmwareResponse } from './services.interfaces';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class QmkService {
    constructor(
        private http: HttpClient
    ) { }

    // Get keyboards list
    public getKeyboardsList(): Observable<String[]> {
        return this.http.get<{keyboards: String[]}>('https://keyboards.qmk.fm/v1/keyboard_list.json').pipe(
            map(response => response.keyboards)
        );
    }

    // Get Qmk keyboard
    public getQmkKeyboard(keyboardModel: string): Observable<GetQmkKeyboardResponse> {
        return this.http.get<GetQmkKeyboardResponse>('https://keyboards.qmk.fm/v1/keyboards/'+keyboardModel+'/info.json');
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
