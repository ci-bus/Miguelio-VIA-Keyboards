import { freeSpaceMatrix, Layout, Lighting } from "../interfaces";

export class Defs {
    name: string;
    vdoc: number;
    cols: number;
    rows: number;
    layers: number;
    layouts: Layout[];
    lighting?: Lighting;
    freeSpaceMatrix?: freeSpaceMatrix[];

    constructor(data?: any) {
        Object.assign(this, data);
    }
}


