import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.html',
  styleUrl: './client-list.css'
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.filteredClients = clients;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        alert('Error loading clients');
      }
    });
  }

  filterClients(): void {
    if (!this.searchTerm) {
      this.filteredClients = this.clients;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredClients = this.clients.filter(client =>
        client.name.toLowerCase().includes(term) ||
        (client.contactPerson && client.contactPerson.toLowerCase().includes(term)) ||
        client.email.toLowerCase().includes(term) ||
        (client.phone && client.phone.includes(term)) ||
        (client.city && client.city.toLowerCase().includes(term))
      );
    }
  }

  deleteClient(client: Client): void {
    if (confirm(`Are you sure you want to delete "${client.name}"? This action cannot be undone.`)) {
      this.clientService.deleteClient(client.id!).subscribe({
        next: () => {
          alert('Client deleted successfully');
          this.loadClients();
        },
        error: (error) => {
          console.error('Error deleting client:', error);
          alert('Error deleting client. This client may have associated invoices.');
        }
      });
    }
  }
}
