import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { InvoiceFormComponent } from './components/invoice-form/invoice-form.component';
import { InvoiceViewComponent } from './components/invoice-view/invoice-view.component';
import { CompanySettingsComponent } from './components/company-settings/company-settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'invoices', component: InvoiceListComponent },
  { path: 'invoices/new', component: InvoiceFormComponent },
  { path: 'invoices/:id/edit', component: InvoiceFormComponent },
  { path: 'invoices/:id/view', component: InvoiceViewComponent },
  { path: 'settings/company', component: CompanySettingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
