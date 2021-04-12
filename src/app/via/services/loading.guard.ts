import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RequestsService } from './requests.service';

@Injectable({
    providedIn: 'root'
})
export class LoadingGuard implements CanActivate {

    constructor(
        private requestsService: RequestsService,
        private router: Router
    ){}

    canActivate(): Observable<boolean> {
        return this.requestsService.keymapsIsLoaded().pipe(
            tap(estado => {
                if (!estado) this.router.navigate([ '/' ])
            })
        );
    }
}
