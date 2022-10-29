import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from '../../app.reducer';
import { Colorway, DialogData, freeSpaceValues, Keymap, Keymapper, Layermapper, Layout, Layoutmapper, mapperKeysTab } from '../interfaces';
import { Defs } from '../keyboard/defs.model';
import { keymapsHelper } from '../keymaps/keymaps.helper';
import onLetterKey from './oneLetterKeys';
import mapperKeys from './mapper.keys';
import * as mapperActions from './mapper.actions';
import { add } from '../errors/errors.actions';

import colorways from 'src/assets/colorways/colorways';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mapper',
  templateUrl: './mapper.component.html',
  styleUrls: ['./mapper.component.scss']
})
export class MapperComponent implements OnInit, OnDestroy {

  defs: Defs;
  keymaps: Keymap[] = [];
  layoutsmapper: Layoutmapper[] = [];
  activeMainTab: number = 0;
  activeTab: number = 0;
  defaultKeycapsIndex = 70;
  freeSpaceLimits = [0, 3];
  freeSpaceValues: freeSpaceValues[] = [];
  customStylesInited: boolean = false;

  public mapperKeys: mapperKeysTab[] = [...mapperKeys];
  public sizeKeys: number = 48;
  public caseColor: string = '#c2c5c7';
  public plateColor: string = '#929597';
  public colorways: Colorway[] = colorways;
  public keycapsColor: Colorway = this.colorways.find(color => color.index == this.defaultKeycapsIndex);
  public containerWidth: string = 'auto';
  public containerHeight: string = 'auto';

  draggingKey: Keymapper;
  changingTransToNo: Keymapper;

  private storeSub: Subscription;
  private functionKeyDown: any;
  private functionKeyUp: any;
  public selectedKey: Keymapper;
  public selectedMapperKey: Keymapper;

  constructor(
    public translate: TranslateService,
    private store: Store<AppState>,
    private keymapsHelper: keymapsHelper,
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.store.pipe(first()).subscribe(allData => {
      this.defs = allData.defs;
      this.keymaps = allData.keymaps;
      this.createFreeSpaceMatrixValues();
      // If matrix have free space
      if (this.freeSpaceValues.length) {
        this.checkCustomStylesInited();
        if (this.customStylesInited) {
          this.setKeycapsColor();
          if (this.freeSpaceValues.length > 2) {
            this.setCaseColor();
          }
          if (this.freeSpaceValues.length > 3) {
            this.setPlateColor();
          }
        }
      }
      this.createLayoutsmapper();
    });


    this.storeSub = this.store.select('layoutsmapper').subscribe((layoutsmapper: Layoutmapper[]) => {
      if (!layoutsmapper[0]?.loading) {
        // First setting
        if (!this.layoutsmapper.length) {
          // Calcule layout size
          if (this.defs.vdoc > 1) {
            const sizes = this.getContainerSize(layoutsmapper[0]);
            this.containerWidth = `${sizes[0]}px`;
            this.containerHeight = `${sizes[1]}px`;
          }
          // Init testing funcionality
          this.initTestingListeners();
        }
        // Setting layout mapper
        this.layoutsmapper = layoutsmapper;
        if (this.changingTransToNo) {
          this.AllTransToNo();
        }
      }
    });
  }

  // Init testing
  initTestingListeners(): void {
    this.functionKeyDown = this.onKeyDown.bind(this);
    this.elementRef.nativeElement.ownerDocument
      .addEventListener('keydown', this.functionKeyDown);

    this.functionKeyUp = this.onKeyUp.bind(this);
    this.elementRef.nativeElement.ownerDocument
      .addEventListener('keyup', this.functionKeyUp);
  }

  parseEventCodeToKeyCode(eventCode: string): string {
    const key: Keymapper = this.mapperKeys[0].keymap.flat().find((key: Keymapper) => key.eventCode == eventCode);
    return key?.code;
  }

  onKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.code == 'OSLeft') {
      event = {
        ...event,
        code: 'MetaLeft'
      };
    }
    if (event.code == 'OSRight') {
      event = {
        ...event,
        code: 'MetaRight'
      };
    }
    const keyCode = this.parseEventCodeToKeyCode(event.code);
    const key = {
      code: keyCode,
      layout: this.layoutsmapper[this.activeMainTab]?.name,
      layer: this.activeTab
    };
    this.store.dispatch(mapperActions.pressKey({ key }));
  }

  onKeyUp(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.code == 'OSLeft') {
      event = {
        ...event,
        code: 'MetaLeft'
      };
    }
    if (event.code == 'OSRight') {
      event = {
        ...event,
        code: 'MetaRight'
      };
    }
    const keyCode = this.parseEventCodeToKeyCode(event.code);
    const key = {
      code: keyCode,
      layout: this.layoutsmapper[this.activeMainTab]?.name,
      layer: this.activeTab
    };

    this.store.dispatch(mapperActions.releaseKey({ key }));
  }

  // Set configured keycaps style
  setKeycapsColor(): void {
    let keycapsIndex = this.freeSpaceValues[0].values.secondByte;
    this.keycapsColor = this.colorways.find(color => color.index == keycapsIndex);
  }

  // Set case color
  setCaseColor(): void {
    const hexColor = '#'
      + this.freeSpaceValues[1].values.firstByte.toString(16)
      + this.freeSpaceValues[1].values.secondByte.toString(16)
      + this.freeSpaceValues[2].values.firstByte.toString(16);
    this.caseColor = hexColor;
  }

  // Set plate color
  setPlateColor(): void {
    const hexColor = '#'
      + this.freeSpaceValues[2].values.secondByte.toString(16)
      + this.freeSpaceValues[3].values.firstByte.toString(16)
      + this.freeSpaceValues[3].values.secondByte.toString(16);
    this.plateColor = hexColor;
  }

  // Check if custom styles is inited
  checkCustomStylesInited(): void {
    this.customStylesInited = Boolean(
      this.freeSpaceValues[0].values.firstByte == 255
    );
  }

  // Create free space values from keymaps
  createFreeSpaceMatrixValues(): void {
    let count = 0;
    for (let keymap of this.keymaps) {
      for (let freeSpaceMatrix of this.defs.freeSpaceMatrix) {
        let indexValue = freeSpaceMatrix[0] * this.defs.cols + freeSpaceMatrix[1];
        if (count >= this.freeSpaceLimits[0] && count <= this.freeSpaceLimits[1]) {
          this.freeSpaceValues.push({
            layer: keymap.number,
            row: freeSpaceMatrix[0],
            col: freeSpaceMatrix[1],
            values: { ...keymap.keys[indexValue] }
          });
          count++;
        } else {
          break;
        }
      }
    }
  }

  // Create layouts with keymaps values
  createLayoutsmapper(): void {
    let layoutsmapper = [];
    if (this.defs.layouts.length && this.keymaps.length) {
      // V2
      if (this.defs.vdoc == 2) {
        // Each json layouts
        this.defs.layouts.forEach(layout => {
          let tempLayout = {
            ...layout,
            rows: this.defs.rows,
            cols: this.defs.cols
          },
            tempLayers = [];
          // Each eeprom keymaps
          this.keymaps.forEach(keymap => {
            tempLayers.push({
              number: keymap.number,
              keymap: [this.keymapsHelper.compileKeymapperV2(tempLayout, keymap, keymap.number)]
            });
          });
          layoutsmapper.push({
            name: layout.name,
            layers: tempLayers
          });
        });

        this.store.dispatch(mapperActions.set({ layoutsmapper }));

        // V1
      } else {
        // Each json layouts
        this.defs.layouts.forEach(layout => {
          let tempLayout = {
            ...layout,
            rows: this.defs.rows,
            cols: this.defs.cols
          },
            tempLayers = [];
          // Each eeprom keymaps
          this.keymaps.forEach(keymap => {
            tempLayers.push({
              number: keymap.number,
              keymap: this.keymapsHelper.compileKeymapper(tempLayout, keymap, keymap.number)
            });
          });
          layoutsmapper.push({
            name: layout.name,
            layers: tempLayers
          });
        });

        this.store.dispatch(mapperActions.set({ layoutsmapper }));
      }
    }
  }

  getContainerSize(layout: Layoutmapper): [number, number] {
    let maxWidth = 0,
      maxHeight = 0;
    layout.layers[0].keymap.flat().map(key => {
      let width = key.x * this.sizeKeys + key.w * this.sizeKeys,
        height = key.y * this.sizeKeys + key.h * this.sizeKeys;
      maxWidth = width > maxWidth ? width : maxWidth;
      maxHeight = height > maxHeight ? height : maxHeight;
    });
    return [maxWidth, maxHeight];
  }

  isModKey(key: Keymapper): boolean {
    return key.code && key.code.indexOf('(') > 0;
  }

  isSymbolKey(key: Keymapper): boolean {
    return key.code && onLetterKey.indexOf(key.code) >= 0;
  }

  dragStart(key: Keymapper) {
    try {
      if (key.f) return false;
      this.draggingKey = key;
      this.changeDetectorRef?.detach();
    } catch (err) {
      this.store.dispatch(add({
        textInfo: err
      }));
    }

  }

  dragEnter(event) {
    try {
      event.target.classList.add('dragOver');
    } catch (err) {
      this.store.dispatch(add({
        textInfo: err
      }));
    }
  }

  dragLeave(event) {
    try {
      event.target.classList.remove('dragOver');
    } catch (err) {
      this.store.dispatch(add({
        textInfo: err
      }));
    }
  }

  drop(event, key: Keymapper) {
    try {
      if (event.target && !this.layoutsmapper[0]?.loading) {
        this.store.dispatch(mapperActions.changeKey({
          fromKey: this.draggingKey,
          toKey: key
        }));
      }
      event.target.classList.remove('dragOver');
    } catch (err) {
      this.store.dispatch(add({
        textInfo: err
      }));
    }
  }

  dropInput(event, key: Keymapper) {
    event.stopImmediatePropagation();
    try {
      if (event?.target && !this.layoutsmapper[0]?.loading) {
        event.target.style.color = '#c2185b';
        let fromKey = { ...key };
        fromKey.secondByte = this.draggingKey.secondByte;
        this.store.dispatch(mapperActions.changeKey({
          fromKey: fromKey,
          toKey: key
        }));
      }
    } catch (err) {
      this.store.dispatch(add({
        textInfo: err
      }));
    }
  }

  dragEnd() {
    try {
      this.changeDetectorRef.reattach();
    } catch (err) {
      this.store.dispatch(add({
        textInfo: err
      }));
    }
  }

  changeModKey(event, key: Keymapper) {
    try {
      if (!this.layoutsmapper[0]?.loading) {
        event.target.style.color = '#c2185b';
        let fromKey = { ...key };
        fromKey.secondByte = parseInt(event.target.value);
        this.store.dispatch(mapperActions.changeKey({
          fromKey: fromKey,
          toKey: key
        }));
      }
    } catch (err) {
      this.store.dispatch(add({
        textInfo: err
      }));
    }
  }

  trackByLayout(index: number, layout: Layout): string {
    return layout.name;
  }

  trackByLayer(index: number, layer: Layermapper): number {
    return layer.number;
  }

  trackByKeymap(index: number, keymap: Keymapper[]) {
    return index;
  }

  trackByKey(index: number, key: Keymapper) {
    return `key_${key.col}_${key.row}`;
  }

  onRightClick(event) {
    /*
    event?.preventDefault();
    event?.stopPropagation();
    return false;
    */
  }

  AllTransToNo() {
    const keys = this.layoutsmapper[this.activeMainTab]?.layers[this.activeTab]?.keymap?.flat();
    this.changingTransToNo = keys.find(key => !key.firstByte && key.secondByte === 1);
    if (this.changingTransToNo) {
      this.store.dispatch(mapperActions.changeKey({
        fromKey: {
          code: 'KC_NO',
          firstByte: 0,
          secondByte: 0
        },
        toKey: this.changingTransToNo
      }));
    }
  }

  changeKeycapsColor(event: MatSelectChange) {
    this.keycapsColor = event.value;
    // Change data into free space values
    this.freeSpaceValues[0] = {
      ...this.freeSpaceValues[0],
      values: {
        ...this.freeSpaceValues[0].values,
        secondByte: this.keycapsColor.index
      }
    };
    // Save values
    this.store.dispatch(mapperActions.saveFreeSpaceValues({
      freeSpaceValues: [{
        ...this.freeSpaceValues[0]
      }]
    }));

  }

  getKeycapColor(key: Keymapper, colorType: string) {
    if (this.keycapsColor) {
      if (key.code && this.keycapsColor.override[key.code]) {
        return this.keycapsColor.swatches[this.keycapsColor.override[key.code]][colorType];
      }
      if (key.w <= 1) {
        return this.keycapsColor.swatches.base[colorType];
      } else {
        return this.keycapsColor.swatches.mods[colorType];
      }
    }
  }

  initCustomStyle(): void {
    // Keycaps style prepare data
    let data: DialogData = {
      title: this.translate.instant('dialog.customizeStyle.title'),
      content: this.translate.instant('dialog.customizeStyle.content'),
      ok: this.translate.instant('dialog.customizeStyle.ok'),
      cancel: this.translate.instant('dialog.customizeStyle.cancel'),
      list: [{
        icon: 'check',
        text: 'Keycaps'
      }]
    };
    this.freeSpaceValues[0].values = {
      firstByte: 255, // Mark inited
      secondByte: this.defaultKeycapsIndex
    };
    // Case color
    if (this.freeSpaceValues.length > 2) {
      this.freeSpaceValues[1].values.firstByte = 194;
      this.freeSpaceValues[1].values.secondByte = 197;
      this.freeSpaceValues[2].values.firstByte = 199;
      data.list.push({ icon: 'check', text: 'Case' });
    } else {
      data.list.push({ icon: 'close', text: 'Case' });
    }
    // Plate color
    if (this.freeSpaceValues.length > 3) {
      this.freeSpaceValues[2].values.secondByte = 146;
      this.freeSpaceValues[3].values.firstByte = 149;
      this.freeSpaceValues[3].values.secondByte = 151;
      data.list.push({ icon: 'check', text: 'Plate' });
    } else {
      data.list.push({ icon: 'close', text: 'Plate' });
    }
    // Modal config

    this.dialog.open(DialogComponent, {
      maxWidth: '80vw',
      hasBackdrop: true,
      data
    })
      .afterClosed().subscribe(result => {
        if (result) {
          // Set inited
          this.customStylesInited = true;
          // Save data
          this.store.dispatch(mapperActions.saveFreeSpaceValues({
            freeSpaceValues: [...this.freeSpaceValues]
          }));
        }
      });
  }

  changeCaseColor(event: string): void {
    // Change values
    this.freeSpaceValues[1] = {
      ...this.freeSpaceValues[1],
      values: {
        firstByte: parseInt(event.slice(1, 3), 16),
        secondByte: parseInt(event.slice(3, 5), 16)
      }
    }
    this.freeSpaceValues[2] = {
      ...this.freeSpaceValues[2],
      values: {
        ...this.freeSpaceValues[2].values,
        firstByte: parseInt(event.slice(5, 7), 16),
      }
    }
    // Save data
    this.store.dispatch(mapperActions.saveFreeSpaceValues({
      freeSpaceValues: [{
        ...this.freeSpaceValues[1]
      }, {
        ...this.freeSpaceValues[2]
      }]
    }));
  }

  changePlateColor(event: string): void {
    // Change values
    this.freeSpaceValues[2] = {
      ...this.freeSpaceValues[2],
      values: {
        ...this.freeSpaceValues[2].values,
        secondByte: parseInt(event.slice(1, 3), 16),
      }
    }
    this.freeSpaceValues[3] = {
      ...this.freeSpaceValues[3],
      values: {
        firstByte: parseInt(event.slice(3, 5), 16),
        secondByte: parseInt(event.slice(5, 7), 16)
      }
    }
    // Save data
    this.store.dispatch(mapperActions.saveFreeSpaceValues({
      freeSpaceValues: [{
        ...this.freeSpaceValues[2]
      }, {
        ...this.freeSpaceValues[3]
      }]
    }));
  }

  toggleSelectedKey(event, key): void {
    // If isn't a input
    if (event.target.nodeName != 'INPUT') {
      // If mapper bottom key is selected
      if (this.selectedMapperKey) {
        // Change key
        this.store.dispatch(mapperActions.changeKey({
          fromKey: this.selectedMapperKey, toKey: key
        }));
        this.selectedKey = undefined;
        this.deselectAllMapperKeys();

      } else {
        // Toggle selected top key
        this.store.dispatch(mapperActions.toogleSelected({
          key
        }));
        this.selectedKey = !key.selected ? key : undefined;
      }
    }
  }

  toggleSelectedMapperKey(event, key): void {
    // If top key is selected
    if (this.selectedKey) {
      // Change key
      this.store.dispatch(mapperActions.changeKey({
        fromKey: key, toKey: this.selectedKey
      }));
      this.selectedKey = undefined;

    } else {
      // Toggle mapper bottom key
      this.mapperKeys = [
        ...this.mapperKeys.map(mapperKeysTab => ({
          title: mapperKeysTab.title,
          keymap: [
            ...mapperKeysTab.keymap.map(rowKeys => rowKeys.map((tempKey: Keymapper) =>
              tempKey = tempKey.firstByte !== key.firstByte || tempKey.secondByte !== key.secondByte
                ? {
                  ...tempKey,
                  selected: false
                } : {
                  ...tempKey,
                  selected: !tempKey.selected
                }
            ))
          ]
        }))
      ];
      this.selectedMapperKey = !key.selected ? key : undefined;
    }
  }

  deselectAllMapperKeys(): void {
    this.mapperKeys = [
      ...this.mapperKeys.map(mapperKeysTab => ({
        title: mapperKeysTab.title,
        keymap: [
          ...mapperKeysTab.keymap.map(rowKeys => rowKeys.map((tempKey: Keymapper) => ({
            ...tempKey,
            selected: false
          })))
        ]
      }))
    ];
    this.selectedMapperKey = undefined;
  }

  ngOnDestroy(): void {
    this.storeSub?.unsubscribe();
    this.elementRef.nativeElement.ownerDocument
      .removeEventListener('keydown', this.functionKeyDown);
    this.elementRef.nativeElement.ownerDocument
      .removeEventListener('keydown', this.functionKeyUp);
  }
}
