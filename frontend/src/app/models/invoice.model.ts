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
  invoiceNumber?: string;
  client: Client;
  invoiceDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal?: number;
  taxRate?: number;
  taxAmount?: number;
  total?: number;
  paymentStatus?: PaymentStatus;
  notes?: string;
  terms?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}
