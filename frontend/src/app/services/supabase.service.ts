import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  get client() {
    return this.supabase;
  }

  // Generic CRUD operations
  async select(table: string, columns = '*', filter?: any) {
    let query = this.supabase.from(table).select(columns);
    
    if (filter) {
      Object.keys(filter).forEach(key => {
        query = query.eq(key, filter[key]);
      });
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async insert(table: string, data: any) {
    const { data: result, error } = await this.supabase
      .from(table)
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  async update(table: string, id: number, data: any) {
    const { data: result, error } = await this.supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  async delete(table: string, id: number) {
    const { error } = await this.supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async selectById(table: string, id: number, columns = '*') {
    const { data, error } = await this.supabase
      .from(table)
      .select(columns)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
}
