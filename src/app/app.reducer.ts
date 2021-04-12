import { ActionReducerMap } from "@ngrx/store";
import { Device } from "./via/devices/device.model";
import { devicesReducer } from "./via/devices/devices.reducer";
import { errorsReducer } from "./via/errors/errors.reducer";
import { Error, Keymap, LightValues, Loading } from "./via/interfaces";
import { defsReducer } from "./via/keyboard/defs.reducer";
import { Keyboard } from "./via/keyboard/keyboard.model";
import { Defs } from "./via/keyboard/defs.model";
import { keyboardReducer } from "./via/keyboard/keyboard.reducer";
import { keymapsReducer } from "./via/keymaps/keymaps.reduce";
import { lightReducer } from "./via/light/light.reducer";

export interface AppState {
    devices: Device[],
    keyboard: Keyboard,
    defs: Defs,
    keymaps: Keymap[],
    errors: Error[]
    light: LightValues
}

export const AppReducers: ActionReducerMap<AppState> = { 
    devices: devicesReducer, 
    keyboard: keyboardReducer,
    defs: defsReducer,
    keymaps: keymapsReducer,
    errors: errorsReducer,
    light: lightReducer
}