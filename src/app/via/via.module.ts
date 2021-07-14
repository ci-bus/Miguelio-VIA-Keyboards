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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { ReactiveFormsModule } from '@angular/forms';


import { LoadingComponent } from './loading/loading.component';
import { MapperComponent } from './mapper/mapper.component';
import { keymapsHelper } from './keymaps/keymaps.helper';
import { LightComponent } from './light/light.component';
import { FirmwareComponent } from './firmware/firmware.component';
import { TestingComponent } from './testing/testing.component';


@NgModule({
    declarations: [
        LoadingComponent,
        MapperComponent,
        LightComponent,
        FirmwareComponent,
        TestingComponent
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
        MatButtonToggleModule,
        FormsModule,
        MatSlideToggleModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule
    ],
    providers: [
        keymapsHelper
    ]
})
export class ViaModule { }
