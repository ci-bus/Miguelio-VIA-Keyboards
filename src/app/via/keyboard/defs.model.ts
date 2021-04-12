import { Layout, Lighting } from "../interfaces";

export class Defs {
    name: string;
    cols: number;
    rows: number;
    layers: number;
    layouts: Layout[];
    lighting?: Lighting;

    constructor (data?: any) {
        Object.assign(this, data);
    }
}


