
export interface Key {
    firstByte: number
    secondByte: number
}

export interface Keymap {
    number: number
    keys: Array<Key>
}

export interface Loading {
    layersPorcent: number
}

export interface Error {
    textInfo: string
    readed: boolean
}

export interface Layout {
    name: string
    keymap: Array<Array<number | Object>>
    matrix: Array<Array<number> | null>
    rows?: number
    cols?: number
}

export interface LayoutV2 {
    name: string
    keymap: Array<Keymapper>
    rows?: number
    cols?: number
}

export interface MinMax {
    min: number
    max: number
}

export interface Backlight {
    brightness: MinMax,
    effect: Array<number>
}

export interface LightColor {
    hue: MinMax
    sat: MinMax
}

export interface LightEffect {
    label: string,
    value: number
}

export interface Rgblight {
    brightness: MinMax
    effect: LightEffect[]
    effectSpeed: Array<number>
    color: LightColor
}

export interface Lighting {
    backlight?: Backlight
    rgblight?: Rgblight
}

export interface BacklightValues {
    brightness: number
    effect: number
}

export interface RgblightValues {
    brightness: number
    effect: number
    effectSpeed: number
    color: {
        hue: number
        sat: number
    }
}

export interface LightValues {
    backlight?: BacklightValues,
    rgblight?: RgblightValues
}

export interface Keymapper {
    u: number
    s?: string
    f?: boolean
    firstByte?: number
    secondByte?: number | string
    code?: string
    layout?: string // Layout name
    layer?: number // Layer number
    row?: number // Matrix row
    col?: number // Matrix col
    saving?: boolean
    eventCode?: string
    selected?: boolean
    // V2
    x?: number
    y?: number
    w?: number
    h?: number
    matrix: Array<number>
}

export interface Layermapper {
    number: number
    keymap: Array<Keymapper[]>
}

export interface Layoutmapper {
    name: string
    layers: Layermapper[]
}

// firmware component

export interface QmkKeyboardKeymapper extends Keymapper {
    label: string,
    matrix: Array<number>,
    x: number,
    y: number,
    w: number,
    h?: number,
    selected?: boolean
}

export interface QmkKeyboardLayout {
    name: string
    key_count: number
    layout?: QmkKeyboardKeymapper[]
}

export interface QmkKeyboardLayer {
    number: number
    keymap: QmkKeyboardKeymapper[]
}

export interface QmkKeyboardLayouts {
    [name: string]: QmkKeyboardLayout
}

export interface QmkKeyboardUsb {
    device_ver: string
    pid: string
    vid: string
}

export interface QmkKeyboardFeatures {
    [type: string]: boolean
}

export interface QmkKeyboard {
    keyboard_folder: string,
    layouts: QmkKeyboardLayouts,
    usb: QmkKeyboardUsb,
    manufacturer: string,
    features: QmkKeyboardFeatures,
    matrix_size: {
        cols: number,
        rows: number
    }
}

export interface QmkKeyboards {
    [model: string]: QmkKeyboard
}

export interface FirmwareState {
    keyboardsList: String[],
    model: string,
    qmkKeyboard: QmkKeyboard,
    layout: QmkKeyboardLayout,
    layers: QmkKeyboardLayer[]
}



