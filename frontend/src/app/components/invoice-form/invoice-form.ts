import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { InvoiceService } from '../../services/invoice.service';
import { Client } from '../../models/client.model';
import { Invoice, InvoiceItem, PaymentStatus } from '../../models/invoice.model';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.html',
  styleUrl: './invoice-form.css'
})
export class InvoiceFormComponent implements OnInit {
  invoiceForm: FormGroup;
  clients: Client[] = [];
  isEditing = false;
  isSubmitting = false;
  invoiceId?: number;
  
  subtotal = 0;
  taxAmount = 0;
  total = 0;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private invoiceService: InvoiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.invoiceForm = this.fb.group({
      clientId: ['', Validators.required],
      invoiceNumber: [''],
      invoiceDate: [new Date().toISOString().split('T')[0], Validators.required],
      dueDate: ['', Validators.required],
      items: this.fb.array([]),
      taxRate: [0, [Validators.min(0), Validators.max(100)]],
      notes: [''],
      terms: [''],
      paymentStatus: [PaymentStatus.PENDING]
    });
  }

  ngOnInit(): void {
    this.loadClients();
    this.addItem(); // Add one item by default

    // Check if editing
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.invoiceId = +params['id'];
        this.isEditing = true;
        this.loadInvoice();
      }
    });

    // Check for pre-selected client
    this.route.queryParams.subscribe(params => {
      if (params['clientId']) {
        this.invoiceForm.patchValue({ clientId: +params['clientId'] });
      }
    });

    // Auto-calculate due date (30 days from invoice date)
    this.invoiceForm.get('invoiceDate')?.valueChanges.subscribe(date => {
      if (date) {
        const dueDate = new Date(date);
        dueDate.setDate(dueDate.getDate() + 30);
        this.invoiceForm.patchValue({ 
          dueDate: dueDate.toISOString().split('T')[0] 
        });
      }
    });
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
      }
    });
  }

  loadInvoice(): void {
    if (this.invoiceId) {
      this.invoiceService.getInvoiceById(this.invoiceId).subscribe({
        next: (invoice) => {
          this.populateForm(invoice);
        },
        error: (error) => {
          console.error('Error loading invoice:', error);
          alert('Error loading invoice data');
        }
      });
    }
  }

  populateForm(invoice: Invoice): void {
    // Clear existing items
    while (this.getItemsControls().length !== 0) {
      this.removeItem(0);
    }

    // Add items from invoice
    invoice.items.forEach(item => {
      this.addItem(item);
    });

    // Set form values
    this.invoiceForm.patchValue({
      clientId: invoice.client.id,
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: new Date(invoice.invoiceDate).toISOString().split('T')[0],
      dueDate: new Date(invoice.dueDate).toISOString().split('T')[0],
      taxRate: invoice.taxRate || 0,
      notes: invoice.notes || '',
      terms: invoice.terms || '',
      paymentStatus: invoice.paymentStatus || PaymentStatus.PENDING
    });

    this.calculateTotals();
  }

  get itemsFormArray(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  getItemsControls(): FormGroup[] {
    return this.itemsFormArray.controls as FormGroup[];
  }

  addItem(item?: InvoiceItem): void {
    const itemGroup = this.fb.group({
      description: [item?.description || '', Validators.required],
      quantity: [item?.quantity || 1, [Validators.required, Validators.min(1)]],
      unitPrice: [item?.unitPrice || 0, [Validators.required, Validators.min(0)]],
      total: [item?.total || 0]
    });

    this.itemsFormArray.push(itemGroup);
    
    if (!item) {
      this.calculateItemTotal(this.getItemsControls().length - 1);
    }
  }

  removeItem(index: number): void {
    this.itemsFormArray.removeAt(index);
    this.calculateTotals();
  }

  calculateItemTotal(index: number): void {
    const item = this.getItemsControls()[index];
    const quantity = item.get('quantity')?.value || 0;
    const unitPrice = item.get('unitPrice')?.value || 0;
    const total = quantity * unitPrice;
    
    item.patchValue({ total: total });
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.subtotal = this.getItemsControls().reduce((sum, item) => {
      return sum + (item.get('total')?.value || 0);
    }, 0);

    const taxRate = this.invoiceForm.get('taxRate')?.value || 0;
    this.taxAmount = this.subtotal * (taxRate / 100);
    this.total = this.subtotal + this.taxAmount;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.invoiceForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.invoiceForm.valid && this.getItemsControls().length > 0) {
      this.isSubmitting = true;
      
      const formValue = this.invoiceForm.value;
      const selectedClient = this.clients.find(c => c.id === +formValue.clientId);
      
      if (!selectedClient) {
        alert('Please select a valid client');
        this.isSubmitting = false;
        return;
      }

      const invoiceData: Invoice = {
        client: selectedClient,
        invoiceNumber: formValue.invoiceNumber,
        invoiceDate: new Date(formValue.invoiceDate),
        dueDate: new Date(formValue.dueDate),
        items: formValue.items,
        subtotal: this.subtotal,
        taxRate: formValue.taxRate,
        taxAmount: this.taxAmount,
        total: this.total,
        paymentStatus: formValue.paymentStatus,
        notes: formValue.notes,
        terms: formValue.terms
      };

      const operation = this.isEditing
        ? this.invoiceService.updateInvoice(this.invoiceId!, invoiceData)
        : this.invoiceService.createInvoice(invoiceData);

      operation.subscribe({
        next: () => {
          alert(this.isEditing ? 'Invoice updated successfully!' : 'Invoice created successfully!');
          this.router.navigate(['/invoices']);
        },
        error: (error) => {
          console.error('Error saving invoice:', error);
          alert('Error saving invoice. Please try again.');
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/invoices']);
  }
}
