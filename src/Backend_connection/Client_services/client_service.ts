// src/services/clientService.ts
import api from "../api";
import { Client, CreateClient } from "../types"; // You should define these types in a separate file

import { ClientPassword } from "../types"; // Ensure that ClientPassword is defined in your types file

// Get client password by email
export const getClientPasswordByEmail = async (
  clientEmail: string,
  ClientPassword: string
): Promise<Client> => {
  const response = await api.get<Client>(
    `/clients/password/${clientEmail}/${ClientPassword}`
  );
  return response.data;
};

// Get all clients with pagination
export const getClients = async (skip = 0, limit = 100): Promise<Client[]> => {
  const response = await api.get<Client[]>(
    `/clients?skip=${skip}&limit=${limit}`
  );
  return response.data;
};

// Get a client by ID
export const getClientById = async (clientId: number): Promise<Client> => {
  const response = await api.get<Client>(`/clients/${clientId}`);
  return response.data;
};

// Get a client by email
export const getClientByEmail = async (
  clientEmail: string
): Promise<Client> => {
  const response = await api.get<Client>(`/clients/${clientEmail}`);
  return response.data;
};

// Create a new client
export const createClient = async (client: CreateClient): Promise<Client> => {
  const response = await api.post<Client>("/clients/", client);
  return response.data;
};
