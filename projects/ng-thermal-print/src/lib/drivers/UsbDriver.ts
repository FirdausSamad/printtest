import { BehaviorSubject, Observable } from 'rxjs';
import {PrintDriver} from './PrintDriver';

declare var navigator: any;
declare var USBDevice: any;

export class UsbDriver extends PrintDriver {
    private device: any;
    private endPoint: any;
    private vendorId: number;
    private productId: number;
    public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(vendorId?: number, productId?: number) {
        super();
        this.vendorId = vendorId;
        this.productId = productId;
    }

    public connect() {
        navigator.usb.getDevices().then(devices => {
            this.device = devices.find((device: any) => {
                return device.vendorId === this.vendorId && device.productId === this.productId;
            });
            console.log(this.device);
            return this.device.open();
        })
            .then(() => {
                let result = this.device.selectConfiguration(1);
                return result;
            })
            .then(() => {
                let result = this.device.claimInterface(0);
                return result;
            }).then(result => {
                const endPoints: any[] = this.device.configuration.interfaces[0].alternate.endpoints;
                this.endPoint = endPoints.find((endPoint: any) => endPoint.direction === 'out');
                this.isConnected.next(true);
                this.listenForUsbConnections();
            }).catch(result => {
                this.isConnected.next(false);
            });
    }


    /**
     * Request a USB device through the browser
     * return Observable<USBDevice>
     */
    public requestUsb(): Observable<any> {
        return new Observable(observer => {
            navigator.usb.requestDevice({ filters: [] })
                .then((result: any) => {
                    this.vendorId = result.vendorId;
                    this.productId = result.productId;
                    return observer.next(result);
                }).catch(error => {
                    return observer.error(error);
                });
        });
    }

    public async write(data: Uint8Array): Promise<void> {
        this.device.transferOut(this.endPoint.endpointNumber, data);
    }

    private listenForUsbConnections(): void {
        navigator.usb.addEventListener('disconnect', () => {
            this.isConnected.next(false)
        });
        navigator.usb.addEventListener('connect', () => {
            this.isConnected.next(true);
        });
    }
}
