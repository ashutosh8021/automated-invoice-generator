import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { InvoiceService } from '../../services/invoice.service';
import { Client } from '../../models/client.model';
import { Invoice } from '../../models/invoice.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalClients: number = 0;
  totalInvoices: number = 0;
  pendingInvoices: number = 0;
  totalRevenue: number = 0;
  recentInvoices: Invoice[] = [];

  constructor(
    private clientService: ClientService,
    private invoiceService: InvoiceService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load clients
    this.clientService.getAllClients().subscribe(clients => {
      this.totalClients = clients.length;
    });

    // Load invoices
    this.invoiceService.getAllInvoices().subscribe(invoices => {
      this.totalInvoices = invoices.length;
      this.pendingInvoices = invoices.filter(invoice => invoice.paymentStatus === 'PENDING').length;
      this.totalRevenue = invoices
        .filter(invoice => invoice.paymentStatus === 'PAID')
        .reduce((sum, invoice) => sum + (invoice.total || 0), 0);
      
      // Get recent 5 invoices
      this.recentInvoices = invoices
        .sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime())
        .slice(0, 5);
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PAID':
        return 'bg-success';
      case 'PENDING':
        return 'bg-warning';
      case 'OVERDUE':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}
