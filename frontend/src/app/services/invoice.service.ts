import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Invoice, PaymentStatus } from '../models/invoice.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private tableName = 'invoices';

  constructor(private supabase: SupabaseService) { }

  getAllInvoices(): Observable<Invoice[]> {
    return from(this.supabase.select(this.tableName).then(data => data as unknown as Invoice[]));
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return from(this.supabase.selectById(this.tableName, id).then(data => data as unknown as Invoice));
  }

  getInvoiceByNumber(invoiceNumber: string): Observable<Invoice> {
    return from(
      this.supabase.client
        .from(this.tableName)
        .select('*')
        .eq('invoice_number', invoiceNumber)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data as unknown as Invoice;
        })
    );
  }

  getInvoicesByClient(clientId: number): Observable<Invoice[]> {
    return from(
      this.supabase.client
        .from(this.tableName)
        .select('*')
        .eq('client_id', clientId)
        .then(({ data, error }) => {
          if (error) throw error;
          return data as unknown as Invoice[];
        })
    );
  }

  getInvoicesByStatus(status: PaymentStatus): Observable<Invoice[]> {
    return from(
      this.supabase.client
        .from(this.tableName)
        .select('*')
        .eq('payment_status', status)
        .then(({ data, error }) => {
          if (error) throw error;
          return data as unknown as Invoice[];
        })
    );
  }

  getOverdueInvoices(): Observable<Invoice[]> {
    const today = new Date().toISOString().split('T')[0];
    return from(
      this.supabase.client
        .from(this.tableName)
        .select('*')
        .eq('payment_status', 'PENDING')
        .lt('due_date', today)
        .then(({ data, error }) => {
          if (error) throw error;
          return data as unknown as Invoice[];
        })
    );
  }

  getInvoicesByDateRange(startDate: string, endDate: string): Observable<Invoice[]> {
    return from(
      this.supabase.client
        .from(this.tableName)
        .select('*')
        .gte('issue_date', startDate)
        .lte('issue_date', endDate)
        .then(({ data, error }) => {
          if (error) throw error;
          return data as unknown as Invoice[];
        })
    );
  }

  createInvoice(invoice: Invoice): Observable<Invoice> {
    return from(this.supabase.insert(this.tableName, invoice).then(data => data as unknown as Invoice));
  }

  updateInvoice(id: number, invoice: Invoice): Observable<Invoice> {
    return from(this.supabase.update(this.tableName, id, invoice).then(data => data as unknown as Invoice));
  }

  updatePaymentStatus(id: number, status: PaymentStatus): Observable<Invoice> {
    return from(this.supabase.update(this.tableName, id, { payment_status: status }).then(data => data as unknown as Invoice));
  }

  deleteInvoice(id: number): Observable<void> {
    return from(this.supabase.delete(this.tableName, id));
  }

  // Note: PDF generation and email features will need to be implemented
  // using Edge Functions or external services in Supabase
  downloadInvoicePdf(id: number): Observable<Blob> {
    // TODO: Implement using Supabase Edge Functions
    throw new Error('PDF generation not yet implemented with Supabase');
  }

  sendInvoiceEmail(id: number, toEmail?: string, subject?: string, body?: string): Observable<any> {
    // TODO: Implement using Supabase Edge Functions
    throw new Error('Email sending not yet implemented with Supabase');
  }

  sendPaymentReminder(id: number): Observable<any> {
    // TODO: Implement using Supabase Edge Functions
    throw new Error('Payment reminder not yet implemented with Supabase');
  }
}
