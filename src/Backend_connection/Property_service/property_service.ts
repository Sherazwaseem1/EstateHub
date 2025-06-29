// src/services/properties_service.ts

import { Property_type, CreateProperty, PropertySearch, PropertyResponse } from "../types"; // Adjust the import paths and types as necessary
import api from "../api"; // Assuming you have an axios instance in api.ts

// Create a new property
export const createProperty = async (
  property: CreateProperty
): Promise<Property_type> => {
  const response = await api.post<Property_type>("/properties/", property);
  return response.data;
};

// Get all properties with pagination
export const readProperties = async (
  skip: number = 0,
  limit: number = 100
): Promise<Property_type[]> => {
  const response = await api.get<Property_type[]>(
    `/properties/?skip=${skip}&limit=${limit}`
  );
  return response.data;
};

// Get a property by ID
export const readPropertyById = async (
  propertyId: number
): Promise<Property_type> => {
  const response = await api.get<Property_type>(`/properties/${propertyId}`);
  return response.data;
};

// Search properties
export const searchProperties = async (
  searchParams: PropertySearch
): Promise<PropertyResponse[]> => {
  console.log(searchParams)
  const response = await api.post<PropertyResponse[]>("/search/", searchParams);
  return response.data;
};
