import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup;
  isEditing = false;
  isSubmitting = false;
  clientId?: number;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      contactPerson: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['', Validators.required],
      city: [''],
      state: [''],
      postalCode: [''],
      country: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.clientId = +params['id'];
        this.isEditing = true;
        this.loadClient();
      }
    });
  }

  loadClient(): void {
    if (this.clientId) {
      this.clientService.getClientById(this.clientId).subscribe({
        next: (client) => {
          this.clientForm.patchValue(client);
        },
        error: (error) => {
          console.error('Error loading client:', error);
          alert('Error loading client data');
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.isSubmitting = true;
      const clientData: Client = this.clientForm.value;

      const operation = this.isEditing
        ? this.clientService.updateClient(this.clientId!, clientData)
        : this.clientService.createClient(clientData);

      operation.subscribe({
        next: () => {
          alert(this.isEditing ? 'Client updated successfully!' : 'Client created successfully!');
          this.router.navigate(['/clients']);
        },
        error: (error) => {
          console.error('Error saving client:', error);
          alert('Error saving client. Please try again.');
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/clients']);
  }
}
