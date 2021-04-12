import { Device } from "../devices/device.model";

export class Keyboard {
    product: string;
    vendorId: number;
    productId: number;
    path: string;
    public layers: number;

    constructor( device?: Device ) {

        if (device) {
            this.product = device.product;
            this.vendorId = device.vendorId;
            this.productId = device.productId;
            this.path = device.path;
        }

    }

    public isValid(): boolean {
        return this.productId && this.vendorId && this.path != '';
    }
}

