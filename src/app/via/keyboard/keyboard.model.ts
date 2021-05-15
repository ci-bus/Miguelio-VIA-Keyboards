import { Device } from "../devices/device.model";

export class Keyboard {
    product: string;
    vendorId: number;
    productId: number;
    path: string;
    public layers: number;
    pathJson: string;

    constructor( device?: Device ) {

        if (device) {
            this.product = device.product;
            this.vendorId = device.vendorId;
            this.productId = device.productId;
            this.path = device.path;
            this.pathJson = device.pathJson;
        }

    }

    public isValid(): boolean {
        return this.productId && this.vendorId && this.path != '';
    }
}

