import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
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
    private invoiceService: InvoiceService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load invoices
    this.invoiceService.getAllInvoices().subscribe(invoices => {
      this.totalInvoices = invoices.length;
      this.pendingInvoices = invoices.filter(invoice => invoice.payment_status === 'PENDING').length;
      this.totalRevenue = invoices
        .filter(invoice => invoice.payment_status === 'PAID')
        .reduce((sum, invoice) => sum + (invoice.total || 0), 0);
      
      // Get unique customers count
      const uniqueCustomers = new Set();
      invoices.forEach(invoice => {
        if (invoice.customer_name && invoice.customer_phone) {
          uniqueCustomers.add(`${invoice.customer_name}-${invoice.customer_phone}`);
        }
      });
      this.totalClients = uniqueCustomers.size;
      
      // Get recent 5 invoices
      this.recentInvoices = invoices
        .sort((a, b) => new Date(b.invoice_date).getTime() - new Date(a.invoice_date).getTime())
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
