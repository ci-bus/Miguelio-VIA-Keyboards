import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

import { RequestsService } from '../services/requests.service';
import { AppState } from '../../app.reducer';
import { Device } from '../devices/device.model';
import { Keyboard } from '../keyboard/keyboard.model';
import { Defs } from '../keyboard/defs.model';
import * as keyboardActions from '../keyboard/keyboard.actions';
import * as devicesActions from '../devices/devices.actions';
import * as layersActions from '../keymaps/keymaps.actions';
import * as firmwareActions from '../firmware/firmware.actions';
import { DialogData, FirmwareState } from '../interfaces';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import * as errorsActions from '../errors/errors.actions';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnDestroy {

  // From store
  devices$: Observable<Device[]> = this.store.select(state => state.devices);
  defs$: Observable<Defs> = this.store.select(state => state.defs);
  keyboard: Keyboard;

  // Progress spinner values config
  color: ThemePalette = 'accent';
  mode: ProgressSpinnerMode = 'indeterminate';
  diameter: number = 200;
  strokeWidth: number = 1;
  value: number = 0;

  // Texts values
  loadingLayers: boolean = false;
  msgInfo: string = '';

  // Add support
  showAddSupport: boolean = false;
  showLoading: boolean = true;
  firmware: FirmwareState;
  rgbUnderglow: boolean = false;
  backlight: boolean = false;
  myControl = new FormControl();
  filteredOptions: Observable<String[]>;
  layoutsSelected: any[];

  // Upload JSON
  selectedFile: File

  subscriptions: Subscription[] = [];

  constructor(
    public translate: TranslateService,
    private requestService: RequestsService,
    private store: Store<AppState>,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.subscriptions.push(
      this.devices$.subscribe(devices => {
        this.getDevices();
      })
    );

    this.subscriptions.push(
      this.defs$.subscribe(defs => {
        this.msgInfo = defs.name;
      })
    );

    // Listener to receive layers porcent loaded
    this.requestService.on('layersPorcent', (event, layersPorcent: number) => {
      this.value = layersPorcent;
      this.changeDetectorRef.detectChanges();
    });

    this.subscriptions.push(
      this.store.select('errors').subscribe(errors => {
        if (errors.filter(error => !error.readed).length) {
          this.clearAll();
        }
      })
    );

    // Firmware store subscribe to add support
    this.store.select('firmware').subscribe(firmware => {
      this.firmware = firmware;
      if (firmware) {
        this.showLoading = this.loadingLayers = false;
        if (firmware.savedSupport) {
          this.showAddSupport = false;
        }
      }
    });
    this.store.dispatch(firmwareActions.getKeyboardsList());

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: String): String[] {
    const filterValue = value.toLowerCase();
    return this.firmware.keyboardsList
      ? this.firmware.keyboardsList.filter(option => option.toLowerCase().includes(filterValue))
      : [];
  }

  selectDevice(device: Device) {
    this.store.dispatch(keyboardActions.create({ device }));
    this.mode = 'determinate';
    this.strokeWidth = 2;
    this.loadingLayers = true;
  }

  clearAll() {
    this.store.dispatch(devicesActions.clear());
    this.store.dispatch(keyboardActions.clear());
    this.store.dispatch(layersActions.clear());

    this.loadingLayers = false;
    this.msgInfo = '';
    this.mode = 'indeterminate';
    this.strokeWidth = 1;
    this.getDevices();
  }

  trackByDevices(index: number, device: Device) {
    return device.path;
  }

  getDevices() {
    setTimeout(() => this.store.dispatch(devicesActions.get()), 500);
  }

  changeKeyboard(event: MatAutocompleteSelectedEvent) {
    this.store.dispatch(firmwareActions.getKeyboard({
      keyboardModel: event.option.value
    }));
    this.showLoading = true;
  }

  addSupport() {

    // Show loading
    this.loadingLayers = true;

    // Create definitions
    let rgblight = {
      brightness: { min: 0, max: 255 },
      effect: [
        { label: 'none', value: 0 },
        { label: 'static', value: 1 },
        { label: 'breathing', value: 2 },
        { label: 'rainbow', value: 6 },
        { label: 'swirl', value: 9 },
        { label: 'snake', value: 15 },
        { label: 'knightRider', value: 21 },
        { label: 'christmas', value: 24 },
        { label: 'staticGradient', value: 25 },
        { label: 'redGreenBlue', value: 35 }
      ],
      hue: { steps: 10 },
      sat: { steps: 17 }
    },
      backlight = {
        brightness: {
          min: 0, max: 255
        },
        effect: [
          { label: 'none', value: 0 },
          { label: 'breathing', value: 1 }
        ]
      },
      support = {
        name: this.firmware.qmkKeyboard.keyboard_name,
        lighting: {},
        ...this.firmware.qmkKeyboard.matrix_size,
        layouts: this.layoutsSelected.map(layoutData => ({
          name: layoutData.key,
          keymap: layoutData.value.layout
        })),
        freeSpaceMatrix: []
      },
      fileName = parseInt(this.firmware.qmkKeyboard.usb.vid) + '_' + parseInt(this.firmware.qmkKeyboard.usb.pid) + '.json',
      keyboardDir = this.firmware.qmkKeyboard.keyboard_name;

    // Add RGB underglow
    if (this.rgbUnderglow) {
      support.lighting['rgblight'] = rgblight;
    }

    // Add back light
    if (this.backlight) {
      support.lighting['backlight'] = backlight;
    }

    // Search free space to save styles
    const freeSpaceMatrix = this.searchFreeSpaceToStyles(support);

    if (freeSpaceMatrix.length) {
      support.freeSpaceMatrix = freeSpaceMatrix;
    }

    this.store.dispatch(firmwareActions.addSupport({
      support, fileName, keyboardDir
    }));

    this.showDialog('addedOk');
  }

  searchFreeSpaceToStyles(support: any) {
    // Create empty matrix array
    let freeSpaceMatrix = [];
    for (let r = 0; r < support.rows; r++) {
      freeSpaceMatrix[r] = [];
    }
    // Mark space in use
    for (let layout of support.layouts) {
      for (let key of layout.keymap) {
        freeSpaceMatrix[key.matrix[0]][key.matrix[1]] = 1;
      }
    }
    // Get free space
    let freeSpaces = [];
    for (let r = 0; r < support.rows; r++) {
      for (let c = 0; c < support.cols; c++) {
        if (freeSpaceMatrix[r][c] === undefined) {
          freeSpaces.push([r, c]);
        }
      }
    }
    return freeSpaces;
  }

  selectionLayouts(ev) {
    this.layoutsSelected = ev.value;
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const fileReader = new FileReader();
      fileReader.readAsText(this.selectedFile, "UTF-8");
      fileReader.onload = () => {
        const data = JSON.parse(<string>fileReader.result);
        this.addSupportJSON(data);
      }
      fileReader.onerror = (error) => {
        this.store.dispatch(errorsActions.add({
          textInfo: error.toString()
        }));
      }
    }
  }

  addSupportJSON(data) {
    if (this.validationJSON(data)) {
      let support = {
        name: data.name,
        lighting: data.lighting || {},
        rows: data.matrix_size.rows,
        cols: data.matrix_size.cols,
        layouts: Object.keys(data.layouts).map(layoutName => ({
          name: layoutName,
          keymap: data.layouts[layoutName]
        })),
        freeSpaceMatrix: []
      },
        fileName = parseInt(data.vendorId) + '_' + parseInt(data.productId) + '.json',
        keyboardDir = data.name;

      // Search free space to save styles
      const freeSpaceMatrix = this.searchFreeSpaceToStyles(support);

      if (freeSpaceMatrix.length) {
        support.freeSpaceMatrix = freeSpaceMatrix;
      }

      this.store.dispatch(firmwareActions.addSupport({
        support, fileName, keyboardDir
      }));

      this.showDialog('addedOk');
    } else {
      this.showDialog('addedFail');
    }
  }

  showDialog(message: string): void {
    let data: DialogData = {
      title: this.translate.instant('dialog.support.title'),
      content: this.translate.instant('dialog.support.' + message),
      ok: this.translate.instant('dialog.ok')
    };
    this.dialog.open(DialogComponent, {
      maxWidth: '80vw',
      hasBackdrop: true,
      data
    })
  }

  showError(textInfo: string): boolean {
    this.store.dispatch(errorsActions.add({ textInfo }));
    return false;
  }

  validationJSON(data): boolean {
    if (!data.name) {
      return this.showError('Error json name missing');
    }
    if (!data.vendorId) {
      return this.showError('Error json vendorId missing');
    }
    if (!data.productId) {
      return this.showError('Error json productId missing');
    }
    if (!data.matrix_size) {
      return this.showError('Error json matrix_size missing');
    } else {
      if (!data.matrix_size.rows) {
        return this.showError('Error json matrix_size rows missing');
      }
      if (!data.matrix_size.cols) {
        return this.showError('Error json matrix_size cols missing');
      }
    }
    if (!data.layouts) {
      return this.showError('Error json layouts missing');
    }
    return true;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}



