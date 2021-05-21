import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';


import { LoadingComponent } from './loading/loading.component';
import { MapperComponent } from './mapper/mapper.component';
import { keymapsHelper } from './keymaps/keymaps.helper';
import { LightComponent } from './light/light.component';
import { FirmwareComponent } from './firmware/firmware.component';


@NgModule({
    declarations: [
        LoadingComponent,
        MapperComponent,
        LightComponent,
        FirmwareComponent
    ],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatCardModule,
        MatTabsModule,
        TranslateModule,
        MatButtonModule,
        MatTooltipModule,
        MatSliderModule,
        MatSelectModule,
        FormsModule
    ],
    providers: [
        keymapsHelper
    ]
})
export class ViaModule { }
