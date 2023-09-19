import { Component } from "@angular/core";
import {
  UsbDriver,
  WebPrintDriver,
} from "../../projects/ng-thermal-print/src/lib/drivers";
import { PrintService } from "../../projects/ng-thermal-print/src/lib/ng-thermal-print.service";
import { PrintDriver } from "../../projects/ng-thermal-print/src/lib/drivers/PrintDriver";
import { HttpClient } from "@angular/common/http";
import { ReceiptModel } from "./@models/receipt.model";

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

  constructor(private printService: PrintService, private http: HttpClient) {
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
    this.printService.isConnected.subscribe((isConnected) => {
      if (!isConnected) {
        this.usbPrintDriver.requestUsb().subscribe((result) => {
          console.log("====================================");
          console.log(result);
          console.log("====================================");
          this.printService.setDriver(this.usbPrintDriver, "ESC/POS");
        });
      }
    });
  }

  connectToWebPrint() {
    this.webPrintDriver = new WebPrintDriver(this.ip);
    this.printService.setDriver(this.webPrintDriver, "WebPRNT");
  }

  print(driver?: PrintDriver) {
    this.driverTest = this.usbPrintDriver;
    this.requestUsb();
    this.loadReceipt().subscribe(
      (res: ReceiptModel) => {
        console.log(res);
        this.printService
          .init()
          .setBold(true)
          .writeLine(res.companyName)
          .setBold(false)
          .feed(4)
          .writeLine(res.companyPhone)
          .feed(2)
          .writeLine(res.companyEmail)
          .feed(4)

          .cut("full")
          .flush();
      },
      (error) => {
        alert(JSON.stringify(error));
      }
    );
  }

  private loadReceipt() {
    return this.http.get(
      "https://api.devducksolutions.com:8181/api/payment/getPaymentReceipt?id=10"
    );
  }
}
