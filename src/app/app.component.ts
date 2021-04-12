import { Component } from '@angular/core';
import { IpcService } from './ipc.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'miguelio-via-keyboards';
    constructor(private ipcService: IpcService) {

        /*

        this.ipcService.invoke('ping')
            .then(res => console.log(res));

        setTimeout(() => {
            
            console.log('reseteando eeprom keymaps');
            
            this.ipcService.invoke('getDevicesList')
            .then(devices=>{
                console.log('devices', devices);
                this.ipcService.invoke('countLayers', devices[0])
                .then(res=>{
                        console.log('reseted!', res)
                });
            });
            
            this.ipcService.on('test', (i) => console.log('test loading', i));
            this.ipcService.on('loading', (i) => console.log('loading', i));
            this.ipcService.invoke('test').then(data => console.log(data));

        }, 3000);

        zip(from(a), from(b))
        .subscribe(d => console.log(d));

        */
    }
}
