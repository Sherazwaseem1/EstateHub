import api from "../api"; // Import your axios instance
import { Office, CreateOffice } from "../types"; // Import the Office and CreateOffice types


// Create a new office
export const createOffice = async (officeData: CreateOffice): Promise<Office> => {
  const response = await api.post<Office>("/offices/", officeData);
  return response.data;
};

// Get all offices with pagination
export const readOffices = async (
  skip: number = 0,
  limit: number = 100
): Promise<Office[]> => {
  const response = await api.get<Office[]>(`/offices/?skip=${skip}&limit=${limit}`);
  return response.data;
};

// Get an office by ID
export const readOfficeById = async (officeId: number): Promise<Office> => {
  const response = await api.get<Office>(`/offices/${officeId}`);
  return response.data;
};


