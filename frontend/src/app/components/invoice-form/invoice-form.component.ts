import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { PdfService } from '../../services/pdf.service';
import { Invoice, InvoiceItem, PaymentStatus } from '../../models/invoice.model';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.html',
  styleUrl: './invoice-form.css'
})

export class InvoiceFormComponent implements OnInit {
  invoiceForm: FormGroup;
  isEditing = false;
  isSubmitting = false;
  invoiceId?: number;
  subtotal = 0;
  taxAmount = 0;
  total = 0;
  
  // Customer suggestion properties
  customerSuggestions: any[] = [];
  showSuggestions = false;
  selectedSuggestionIndex = -1;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private pdfService: PdfService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.invoiceForm = this.fb.group({
      customer_name: ['', Validators.required],
      customer_email: ['', [Validators.email]],
      customer_phone: [''],
      customer_address: [''],
      customer_city: [''],
      customer_state: [''],
      customer_postal_code: [''],
      customer_country: [''],
      invoice_number: [''],
      invoice_date: [new Date().toISOString().split('T')[0], Validators.required],
      due_date: ['', Validators.required],
      items: this.fb.array([]),
      tax_rate: [0, [Validators.min(0), Validators.max(100)]],
      notes: [''],
      terms: [''],
      payment_status: [PaymentStatus.PENDING]
    });
  }

  ngOnInit(): void {
  // this.loadClients();
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
    this.invoiceForm.get('invoice_date')?.valueChanges.subscribe(date => {
      if (date) {
        const dueDate = new Date(date);
        dueDate.setDate(dueDate.getDate() + 30);
        this.invoiceForm.patchValue({ 
          due_date: dueDate.toISOString().split('T')[0] 
        });
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
      customer_name: invoice.customer_name,
      customer_email: invoice.customer_email,
      customer_phone: invoice.customer_phone,
      customer_address: invoice.customer_address,
      customer_city: invoice.customer_city,
      customer_state: invoice.customer_state,
      customer_postal_code: invoice.customer_postal_code,
      customer_country: invoice.customer_country,
      invoice_number: invoice.invoice_number,
      invoice_date: new Date(invoice.invoice_date).toISOString().split('T')[0],
      due_date: new Date(invoice.due_date).toISOString().split('T')[0],
      tax_rate: invoice.tax_rate || 0,
      notes: invoice.notes || '',
      terms: invoice.terms || '',
      payment_status: invoice.payment_status || PaymentStatus.PENDING
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

    const taxRate = this.invoiceForm.get('tax_rate')?.value || 0;
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
      const invoiceData: Invoice = {
        customer_name: formValue.customer_name,
        customer_email: formValue.customer_email,
        customer_phone: formValue.customer_phone,
        customer_address: formValue.customer_address,
        customer_city: formValue.customer_city,
        customer_state: formValue.customer_state,
        customer_postal_code: formValue.customer_postal_code,
        customer_country: formValue.customer_country,
        invoice_number: formValue.invoice_number,
        invoice_date: new Date(formValue.invoice_date),
        due_date: new Date(formValue.due_date),
        items: formValue.items,
        subtotal: this.subtotal,
        tax_rate: formValue.tax_rate,
        tax_amount: this.taxAmount,
        total: this.total,
        payment_status: formValue.payment_status,
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

  // Customer suggestion methods
  onCustomerNameInput(event: any): void {
    const name = event.target.value;
    if (name && name.length >= 2) {
      this.invoiceService.getCustomerSuggestions(name).subscribe({
        next: (suggestions) => {
          this.customerSuggestions = suggestions;
          this.showSuggestions = suggestions.length > 0;
          this.selectedSuggestionIndex = -1;
        },
        error: (error) => {
          console.error('Error fetching customer suggestions:', error);
          this.customerSuggestions = [];
          this.showSuggestions = false;
        }
      });
    } else {
      this.hideSuggestions();
    }
  }

  onCustomerNameKeyDown(event: KeyboardEvent): void {
    if (!this.showSuggestions || this.customerSuggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.min(
          this.selectedSuggestionIndex + 1,
          this.customerSuggestions.length - 1
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.max(this.selectedSuggestionIndex - 1, -1);
        break;
      case 'Enter':
        if (this.selectedSuggestionIndex >= 0) {
          event.preventDefault();
          this.selectCustomer(this.customerSuggestions[this.selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        this.hideSuggestions();
        break;
    }
  }

  selectCustomer(customer: any): void {
    this.invoiceForm.patchValue({
      customer_name: customer.customer_name,
      customer_email: customer.customer_email || '',
      customer_phone: customer.customer_phone || '',
      customer_address: customer.customer_address || '',
      customer_city: customer.customer_city || '',
      customer_state: customer.customer_state || '',
      customer_postal_code: customer.customer_postal_code || '',
      customer_country: customer.customer_country || ''
    });
    this.hideSuggestions();
  }

  hideSuggestions(): void {
    this.showSuggestions = false;
    this.customerSuggestions = [];
    this.selectedSuggestionIndex = -1;
  }

  onCustomerPhoneInput(event: any): void {
    const phone = event.target.value;
    const name = this.invoiceForm.get('customer_name')?.value;
    
    if (name && phone && phone.length >= 5) {
      this.invoiceService.getCustomerSuggestions(name, phone).subscribe({
        next: (suggestions) => {
          if (suggestions.length > 0) {
            // Auto-fill customer details if exact match found
            const exactMatch = suggestions.find(s => 
              s.customer_name === name && s.customer_phone === phone
            );
            if (exactMatch) {
              this.selectCustomer(exactMatch);
            }
          }
        },
        error: (error) => {
          console.error('Error fetching customer by phone:', error);
        }
      });
    }
  }

  async previewPDF(): Promise<void> {
    if (this.invoiceForm.valid && this.getItemsControls().length > 0) {
      try {
        // Create a preview invoice object from form data
        const formValue = this.invoiceForm.value;
        
        const previewInvoice = {
          invoice_number: formValue.invoice_number || 'PREVIEW',
          customer_name: formValue.customer_name,
          customer_email: formValue.customer_email,
          customer_phone: formValue.customer_phone,
          customer_address: formValue.customer_address ? 
            `${formValue.customer_address}${formValue.customer_city ? ', ' + formValue.customer_city : ''}${formValue.customer_state ? ', ' + formValue.customer_state : ''}${formValue.customer_postal_code ? ' ' + formValue.customer_postal_code : ''}${formValue.customer_country ? ', ' + formValue.customer_country : ''}` : '',
          created_at: formValue.invoice_date,
          due_date: formValue.due_date,
          payment_status: formValue.payment_status,
          subtotal: this.subtotal,
          tax_rate: formValue.tax_rate || 0,
          tax_amount: this.taxAmount,
          total: this.total,
          notes: formValue.notes,
          terms: formValue.terms,
          invoice_items: formValue.items?.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unitPrice
          })) || []
        };

        await this.pdfService.generateInvoicePDF(previewInvoice);
      } catch (error) {
        console.error('Error generating PDF preview:', error);
        alert('Error generating PDF preview. Please try again.');
      }
    } else {
      alert('Please fill in all required fields and add at least one item before generating a PDF preview.');
    }
  }
}
