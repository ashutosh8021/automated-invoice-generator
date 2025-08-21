import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice, PaymentStatus } from '../../models/invoice.model';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.css'
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  searchTerm: string = '';
  statusFilter: string = '';

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.invoiceService.getAllInvoices().subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        this.filteredInvoices = invoices;
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        alert('Error loading invoices');
      }
    });
  }

  filterInvoices(): void {
    let filtered = this.invoices;

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(invoice =>
        (invoice.invoiceNumber && invoice.invoiceNumber.toLowerCase().includes(term)) ||
        (invoice.client?.name && invoice.client.name.toLowerCase().includes(term)) ||
        (invoice.id && invoice.id.toString().includes(term))
      );
    }

    // Filter by status
    if (this.statusFilter) {
      filtered = filtered.filter(invoice => invoice.paymentStatus === this.statusFilter);
    }

    this.filteredInvoices = filtered;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PAID':
        return 'bg-success';
      case 'PENDING':
        return 'bg-warning';
      case 'OVERDUE':
        return 'bg-danger';
      case 'CANCELLED':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }

  getDueDateClass(dueDate: Date, status?: string): string {
    if (status === 'PAID') return '';
    
    const due = new Date(dueDate);
    const today = new Date();
    const timeDiff = due.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) return 'text-danger fw-bold'; // Overdue
    if (daysDiff <= 7) return 'text-warning fw-bold'; // Due soon
    return '';
  }

  downloadPDF(invoice: Invoice): void {
    if (invoice.id) {
      this.invoiceService.downloadInvoicePdf(invoice.id).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `invoice-${invoice.invoiceNumber || invoice.id}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error: any) => {
          console.error('Error downloading PDF:', error);
          alert('Error generating PDF. Please try again.');
        }
      });
    }
  }

  sendEmail(invoice: Invoice): void {
    if (invoice.id) {
      const confirmed = confirm(`Send invoice to ${invoice.client?.email}?`);
      if (confirmed) {
        this.invoiceService.sendInvoiceEmail(invoice.id, invoice.client?.email).subscribe({
          next: () => {
            alert('Invoice sent successfully!');
          },
          error: (error: any) => {
            console.error('Error sending email:', error);
            alert('Error sending email. Please try again.');
          }
        });
      }
    }
  }

  deleteInvoice(invoice: Invoice): void {
    const confirmed = confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber || invoice.id}? This action cannot be undone.`);
    if (confirmed && invoice.id) {
      this.invoiceService.deleteInvoice(invoice.id).subscribe({
        next: () => {
          alert('Invoice deleted successfully');
          this.loadInvoices();
        },
        error: (error) => {
          console.error('Error deleting invoice:', error);
          alert('Error deleting invoice. Please try again.');
        }
      });
    }
  }
}
