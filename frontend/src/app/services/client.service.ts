import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Client } from '../models/client.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private tableName = 'clients';

  constructor(private supabase: SupabaseService) { }

  getAllClients(): Observable<Client[]> {
    return from(this.supabase.select(this.tableName).then(data => data as unknown as Client[]));
  }

  getClientById(id: number): Observable<Client> {
    return from(this.supabase.selectById(this.tableName, id).then(data => data as unknown as Client));
  }

  searchClients(searchTerm: string): Observable<Client[]> {
    return from(
      this.supabase.client
        .from(this.tableName)
        .select('*')
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
        .then(({ data, error }) => {
          if (error) throw error;
          return data as unknown as Client[];
        })
    );
  }

  createClient(client: Client): Observable<Client> {
    return from(this.supabase.insert(this.tableName, client).then(data => data as unknown as Client));
  }

  updateClient(id: number, client: Client): Observable<Client> {
    return from(this.supabase.update(this.tableName, id, client).then(data => data as unknown as Client));
  }

  deleteClient(id: number): Observable<void> {
    return from(this.supabase.delete(this.tableName, id));
  }
}
