import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import mapperKeys from '../firmware/firmware.keys';
import { Keymapper } from '../interfaces';
import onLetterKey from '../mapper/oneLetterKeys';

@Component({
    selector: 'app-testing',
    templateUrl: './testing.component.html',
    styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit, OnDestroy {

    public keymap: any[] = JSON.parse(JSON.stringify(mapperKeys[0].keymap));
    private functionKeyDown: any;
    private functionKeyUp: any;
    private soundSelected: string = "0";

    constructor(
        private elementRef: ElementRef
    ) { }

    ngOnInit(): void {
        this.formatKeymap();

        this.functionKeyDown = this.onKeyDown.bind(this);
        this.elementRef.nativeElement.ownerDocument
            .addEventListener('keydown', this.functionKeyDown);
        this.functionKeyUp = this.onKeyUp.bind(this);
        this.elementRef.nativeElement.ownerDocument
            .addEventListener('keyup', this.functionKeyUp);
    }

    formatKeymap() {
        this.keymap.map(keyRow => keyRow.map(key => ({
            ...key,
            keyUp: false,
            keyDown: true
        })));
    }

    isSymbolKey(key: Keymapper): boolean {
        return key.code && onLetterKey.indexOf(key.code) >= 0;
    }

    isModKey(key: Keymapper): boolean {
        return key.code && key.code.indexOf('(') > 0;
    }

    onKeyDown(event) {
        event.preventDefault();
        event.stopPropagation();
        if (event.code == 'OSLeft') {
            event.code = 'MetaLeft';
        }
        if (event.code == 'OSRight') {
            event.code = 'MetaRight';
        }
        this.keymap.map(keyRow => keyRow.map(key => {
            if (key.eventCode == event.code) {
                key.keyUp = false;
                key.keyDown = true;
            }
        }));
        if (this.soundSelected != "0") {
            const ele = <HTMLAudioElement>document.getElementById(`click${this.soundSelected}_keydown`);
            ele.play();
        }
    }

    onKeyUp(event) {
        event.preventDefault();
        event.stopPropagation();
        this.keymap.map(keyRow => keyRow.map(key => {
            if (key.eventCode == event.code) {
                key.keyUp = true;
            }
        }));
        if (this.soundSelected != "0") {
            const ele = <HTMLAudioElement>document.getElementById(`click${this.soundSelected}_keyup`);
            ele.play();
        }
    }

    changeSound(event: MatButtonToggleChange) {
        this.soundSelected = event.value;
    }

    resetKeys() {
        this.keymap.map(keyRow => keyRow.map(key => {
            delete key.keyDown;
            delete key.keyUp;
        }));
    }

    ngOnDestroy() {
        this.elementRef.nativeElement.ownerDocument
            .removeEventListener('keydown', this.functionKeyDown);
        this.elementRef.nativeElement.ownerDocument
            .removeEventListener('keyup', this.functionKeyUp);
        this.resetKeys();
    }
}
