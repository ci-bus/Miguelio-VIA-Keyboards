import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { from } from 'rxjs';
import { LoadingComponent } from './via/loading/loading.component';
import { MapperComponent } from './via/mapper/mapper.component';
import { LoadingGuard } from './via/services/loading.guard';
import { FirmwareComponent } from './via/firmware/firmware.component';

const routes: Routes = [
    {
        path: '',
        component: LoadingComponent

    }, {
        path: 'mapper',
        component: MapperComponent,
        canActivate: [ LoadingGuard ]
    }, {
        path: 'firmware',
        component: FirmwareComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
