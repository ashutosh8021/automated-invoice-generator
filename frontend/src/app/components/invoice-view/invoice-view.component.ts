import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { PdfService } from '../../services/pdf.service';
import { Invoice, PaymentStatus } from '../../models/invoice.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.css']
})
export class InvoiceViewComponent implements OnInit {
  invoice?: Invoice;
  loading = true;
  companyInfo = environment;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService,
    private pdfService: PdfService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadInvoice(id);
      }
    });
  }

  loadInvoice(id: number): void {
    this.loading = true;
    this.invoiceService.getInvoiceById(id).subscribe({
      next: (invoice) => {
        this.invoice = invoice;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading invoice:', error);
        this.loading = false;
        alert('Error loading invoice');
      }
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

  async downloadPDF(): Promise<void> {
    if (this.invoice) {
      try {
        await this.pdfService.generateInvoicePDF(this.invoice);
      } catch (error) {
        console.error('Error downloading PDF:', error);
        alert('Error generating PDF. Please try again.');
      }
    }
  }

  sendEmail(): void {
    if (this.invoice?.id && this.invoice?.customer_email) {
      const confirmed = confirm(`Send invoice to ${this.invoice.customer_email}?`);
      if (confirmed) {
        this.invoiceService.sendInvoiceEmail(this.invoice.id, this.invoice.customer_email).subscribe({
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

  markAsPaid(): void {
    if (this.invoice?.id) {
      const confirmed = confirm('Mark this invoice as paid?');
      if (confirmed) {
        this.invoiceService.updatePaymentStatus(this.invoice.id, PaymentStatus.PAID).subscribe({
          next: (updatedInvoice) => {
            this.invoice = updatedInvoice;
            alert('Invoice marked as paid!');
          },
          error: (error: any) => {
            console.error('Error updating payment status:', error);
            alert('Error updating payment status. Please try again.');
          }
        });
      }
    }
  }

  markAsOverdue(): void {
    if (this.invoice?.id) {
      const confirmed = confirm('Mark this invoice as overdue?');
      if (confirmed) {
        this.invoiceService.updatePaymentStatus(this.invoice.id, PaymentStatus.OVERDUE).subscribe({
          next: (updatedInvoice) => {
            this.invoice = updatedInvoice;
            alert('Invoice marked as overdue!');
          },
          error: (error: any) => {
            console.error('Error updating payment status:', error);
            alert('Error updating payment status. Please try again.');
          }
        });
      }
    }
  }

  sendReminder(): void {
    if (this.invoice?.id) {
      const confirmed = confirm(`Send payment reminder to ${this.invoice.customer_email || 'customer'}?`);
      if (confirmed) {
        this.invoiceService.sendPaymentReminder(this.invoice.id).subscribe({
          next: () => {
            alert('Payment reminder sent successfully!');
          },
          error: (error: any) => {
            console.error('Error sending reminder:', error);
            alert('Error sending reminder. Please try again.');
          }
        });
      }
    }
  }
}
