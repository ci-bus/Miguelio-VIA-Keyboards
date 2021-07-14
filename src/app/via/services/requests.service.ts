import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';

import { AppState } from '../../app.reducer';
import { Keyboard } from '../keyboard/keyboard.model';
import { IpcService } from 'src/app/ipc.service';
import { Device } from '../devices/device.model';
import { Keymap, Keymapper, Lighting } from '../interfaces';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Defs } from '../keyboard/defs.model';


@Injectable({
    providedIn: 'root'
})
export class RequestsService {

    constructor(
        private store: Store<AppState>,
        private http: HttpClient,
        private ipcService: IpcService
    ) { }

    // Listeners ipc on
    public on(channel, listener) {
        return this.ipcService.on(channel, listener);
    }

    // Get JSON files from assets
    public getJsonAsset(fileName): Promise<object> {
        return this.http.get(fileName).toPromise();
    }

    // Get devices list
    public getDevicesList(): Promise<Device[]>  {
        return this.ipcService.invoke('getDevicesList');
    }

    // Get count layers
    public getCountLayers(keyboard: Keyboard): Promise<number> {
        return this.ipcService.invoke('countLayers', keyboard);
    }

    // Get defs into json file
    public getDefs(device: Device): Promise<object> {
        return this.getJsonAsset(device.pathJson.split('dist/').pop());
    }

    // Load layers keymaps
    public loadKeymaps(keyboard: Keyboard, defs: Defs): Promise<Keymap[]> {
        return this.ipcService.invoke('loadKeymaps', { keyboard, defs });
    }

    // Load config lighting
    public loadLight(keyboard: Keyboard, lighting: Lighting) {
        return this.ipcService.invoke('loadLight', {
            keyboard, lighting
        });
    }

    // Change Light value
    public changeLight(keyboard: Keyboard, prop: number, firstByte: number, secondByte: number) {
        return this.ipcService.invoke('changeLight', {
            keyboard, prop, firstByte, secondByte
        });
    }

    // Check if keymaps are loaded
    public keymapsIsLoaded(): Observable<boolean> {
        return this.store.select('keymaps').pipe(
            map(keymaps => keymaps.length !== 0)
        )
    }

    // Set keycode to key
    public setKeycode(keyboard: Keyboard, fromKey: Keymapper, toKey: Keymapper): Promise<boolean> {
        return this.ipcService.invoke('setKeycode', {
            path: keyboard.path,
            layer: toKey.layer,
            row: toKey.row,
            col: toKey.col,
            firstByte: fromKey.firstByte,
            secondByte: fromKey.secondByte
        });
    }

    // Reset all keycodes from flashed to stored in eeprom
    public resetKeycodes(keyboard: Keyboard) {
        return this.ipcService.invoke('resetKeycodes', { ...keyboard });
    }

    // Download file
    public downloadFile(url: string): Promise<string> {
        return this.ipcService.invoke('downloadFile', url);
    }

    // Add support
    public addSupport(supportData): Promise<string> {
        return this.ipcService.invoke('addSupport', supportData);
    }

}
