import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientListComponent } from './components/client-list/client-list';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list';
import { InvoiceFormComponent } from './components/invoice-form/invoice-form';
import { InvoiceViewComponent } from './components/invoice-view/invoice-view.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    ClientListComponent,
    ClientFormComponent,
    InvoiceListComponent,
    InvoiceFormComponent,
    InvoiceViewComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
