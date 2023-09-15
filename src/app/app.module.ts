import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {ThermalPrintModule} from '../../projects/ng-thermal-print/src/lib/ng-thermal-print.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ThermalPrintModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
