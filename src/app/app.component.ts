
import { Component } from "@angular/core";
import {UsbDriver, WebPrintDriver} from '../../projects/ng-thermal-print/src/lib/drivers';
import {PrintService} from '../../projects/ng-thermal-print/src/lib/ng-thermal-print.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  status: boolean = false;
  usbPrintDriver: UsbDriver;
  webPrintDriver: WebPrintDriver;
  ip: string = "10.83.118.160";

  constructor(private printService: PrintService) {
    this.usbPrintDriver = new UsbDriver();

    this.printService.isConnected.subscribe((result) => {
      this.status = result;
      if (result) {
        console.log("Connected to printer!!!");
      } else {
        console.log("Not connected to printer.");
      }
    });
  }

  requestUsb() {
    this.usbPrintDriver.requestUsb().subscribe(
      (result) => {
        this.printService.setDriver(this.usbPrintDriver);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  connectToWebPrint() {
    this.webPrintDriver = new WebPrintDriver(this.ip);
    this.printService.setDriver(this.webPrintDriver, "WebPRNT");
  }

  print() {
    this.printService
      .init()
      .setBold(true)
      .writeLine("Hello World!")
      .setBold(false)
      .feed(4)
      .cut("full")
      .flush();
  }
}
