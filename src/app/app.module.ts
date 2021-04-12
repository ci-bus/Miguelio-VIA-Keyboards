import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatBadgeModule } from '@angular/material/badge';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppReducers } from './app.reducer';

import { IpcService } from './ipc.service';
import { ViaModule } from './via/via.module';
import { environment } from 'src/environments/environment';
import { DevicesEffects } from './via/devices/devices.effects';
import { KeyboardEffects } from './via/keyboard/keyboard.effects';
import { DefsEffects } from './via/keyboard/defs.effects';
import { MenuLanguageComponent } from './via/menuLanguage/menuLanguage.component';
import { ErrorsComponent } from './via/errors/errors.component';
import { LightEffects } from './via/light/light.effects';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        MenuLanguageComponent,
        ErrorsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ViaModule,
        HttpClientModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatBadgeModule,
        StoreModule.forRoot(AppReducers),
        EffectsModule.forRoot([
            DevicesEffects, 
            KeyboardEffects,
            DefsEffects,
            LightEffects
        ]),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: environment.production,
        }),
        TranslateModule.forRoot({
            defaultLanguage: 'es',
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    providers: [IpcService],
    bootstrap: [AppComponent],
    exports: [TranslateModule]
})
export class AppModule { }
