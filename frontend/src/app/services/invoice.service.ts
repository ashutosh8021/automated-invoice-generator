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
    return from(
      this.supabase.client
        .from(this.tableName)
        .select(`
          *,
          invoice_items (
            id,
            description,
            quantity,
            unit_price,
            total
          )
        `)
        .then(({ data, error }) => {
          if (error) throw error;
          
          // Transform the data to match our Invoice interface
          const invoices = data?.map(invoice => ({
            ...invoice,
            items: invoice.invoice_items?.map((item: any) => ({
              id: item.id,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unit_price,
              total: item.total
            })) || []
          })) || [];
          
          return invoices as Invoice[];
        })
    );
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return from(
      this.supabase.client
        .from(this.tableName)
        .select(`
          *,
          invoice_items (
            id,
            description,
            quantity,
            unit_price,
            total
          )
        `)
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          
          // Transform the data to match our Invoice interface
          const invoice = {
            ...data,
            items: data.invoice_items?.map((item: any) => ({
              id: item.id,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unit_price,
              total: item.total
            })) || []
          };
          
          return invoice as Invoice;
        })
    );
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
        .gte('invoice_date', startDate)
        .lte('invoice_date', endDate)
        .then(({ data, error }) => {
          if (error) throw error;
          return data as unknown as Invoice[];
        })
    );
  }

  createInvoice(invoice: Invoice): Observable<Invoice> {
    console.log('Creating invoice with data:', invoice);
    
    return from(
      (async () => {
        try {
          // Prepare invoice data (exclude items as they go to separate table)
          const { items, ...invoiceData } = invoice;
          
          // Convert dates to ISO string format for Supabase
          if (invoiceData.invoice_date instanceof Date) {
            invoiceData.invoice_date = invoiceData.invoice_date.toISOString().split('T')[0] as any;
          }
          if (invoiceData.due_date instanceof Date) {
            invoiceData.due_date = invoiceData.due_date.toISOString().split('T')[0] as any;
          }
          
          console.log('Prepared invoice data:', invoiceData);
          
          // Create the invoice first
          const createdInvoice = await this.supabase.insert(this.tableName, invoiceData);
          console.log('Created invoice:', createdInvoice);
          
          // Create invoice items if they exist
          if (items && items.length > 0) {
            const itemsData = items.map(item => ({
              invoice_id: createdInvoice.id,
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unitPrice,
              total: item.total || (item.quantity * item.unitPrice)
            }));
            
            console.log('Creating invoice items:', itemsData);
            
            // Insert all items
            const { data: itemsResult, error: itemsError } = await this.supabase.client
              .from('invoice_items')
              .insert(itemsData);
              
            if (itemsError) {
              console.error('Error creating invoice items:', itemsError);
              throw itemsError;
            }
            
            console.log('Created invoice items:', itemsResult);
          }
          
          return createdInvoice as Invoice;
        } catch (error) {
          console.error('Error in createInvoice:', error);
          throw error;
        }
      })()
    );
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

  // Customer lookup functionality
  getCustomerSuggestions(name: string, phone?: string): Observable<any[]> {
    let query = this.supabase.client
      .from(this.tableName)
      .select('customer_name, customer_phone, customer_email, customer_address, customer_city, customer_state, customer_postal_code, customer_country')
      .ilike('customer_name', `%${name}%`);
    
    if (phone) {
      query = query.eq('customer_phone', phone);
    }
    
    return from(
      query
        .limit(10)
        .then(({ data, error }) => {
          if (error) throw error;
          // Remove duplicates based on name + phone combination
          const unique = data?.filter((item, index, self) => 
            index === self.findIndex(t => 
              t.customer_name === item.customer_name && 
              t.customer_phone === item.customer_phone
            )
          ) || [];
          return unique;
        })
    );
  }

  getUniqueCustomers(): Observable<any[]> {
    return from(
      this.supabase.client
        .from(this.tableName)
        .select('customer_name, customer_phone, customer_email, customer_address, customer_city, customer_state, customer_postal_code, customer_country')
        .then(({ data, error }) => {
          if (error) throw error;
          // Remove duplicates based on name + phone combination
          const unique = data?.filter((item, index, self) => 
            index === self.findIndex(t => 
              t.customer_name === item.customer_name && 
              t.customer_phone === item.customer_phone
            )
          ) || [];
          return unique;
        })
    );
  }
}
