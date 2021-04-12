import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';

import { Error } from '../interfaces';
import { readAll } from './errors.actions';

@Component({
    selector: 'app-errors',
    templateUrl: './errors.component.html',
    styleUrls: ['./errors.component.css']
})
export class ErrorsComponent implements OnInit {

    errors: Error[] = [];
    visible: boolean = false;
    timeout: any;
    errorsUnread: number = 0;

    constructor( private store: Store<AppState>) { }

    ngOnInit(): void {
        this.store.select('errors').subscribe(errors => {
            this.errors = errors;
            this.errorsUnread = errors.filter(error => !error.readed).length;
        });
    }

    open() {
        this.visible = true;
        this.timeout = setTimeout(() => {
            this.timeout = null;
            this.store.dispatch(readAll());
        }, 300);
    }

    close() {
        if (this.timeout) clearTimeout(this.timeout);
        this.visible = false;
    }

}
