import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientListComponent } from './components/client-list/client-list';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list';
import { InvoiceFormComponent } from './components/invoice-form/invoice-form';
import { InvoiceViewComponent } from './components/invoice-view/invoice-view.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'clients', component: ClientListComponent },
  { path: 'clients/new', component: ClientFormComponent },
  { path: 'clients/:id/edit', component: ClientFormComponent },
  { path: 'invoices', component: InvoiceListComponent },
  { path: 'invoices/new', component: InvoiceFormComponent },
  { path: 'invoices/:id/edit', component: InvoiceFormComponent },
  { path: 'invoices/:id/view', component: InvoiceViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
