export interface Client {
  id?: number;
  name: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  gstNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
