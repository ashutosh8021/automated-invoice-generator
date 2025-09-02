import { Client } from './client.model';

export interface InvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total?: number;
}

export interface Invoice {
  id?: number;
  invoice_number?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  customer_city?: string;
  customer_state?: string;
  customer_postal_code?: string;
  customer_country?: string;
  invoice_date: Date;
  due_date: Date;
  items: InvoiceItem[];
  subtotal?: number;
  tax_rate?: number;
  tax_amount?: number;
  total?: number;
  payment_status?: PaymentStatus;
  notes?: string;
  terms?: string;
  created_at?: Date;
  updated_at?: Date;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}
