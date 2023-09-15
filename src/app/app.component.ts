import { Component } from "@angular/core";
import {
  UsbDriver,
  WebPrintDriver,
} from "../../projects/ng-thermal-print/src/lib/drivers";
import { PrintService } from "../../projects/ng-thermal-print/src/lib/ng-thermal-print.service";
import { PrintDriver } from "../../projects/ng-thermal-print/src/lib/drivers/PrintDriver";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  status: boolean = false;
  usbPrintDriver: UsbDriver;
  webPrintDriver: WebPrintDriver;
  ip: string = "";
  driverTest: PrintDriver;

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
    this.usbPrintDriver.requestUsb().subscribe((result) => {
      console.log("====================================");
      console.log(result);
      console.log("====================================");
      this.printService.setDriver(this.usbPrintDriver, "ESC/POS");
    });
  }

  connectToWebPrint() {
    this.webPrintDriver = new WebPrintDriver(this.ip);
    this.printService.setDriver(this.webPrintDriver, "WebPRNT");
  }

  print(driver?: PrintDriver) {
    this.driverTest = this.usbPrintDriver;
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
