// src/types.ts

export interface Client {
  ClientID: number;
  ClientName: string;
  ClientEmail: string;
  ClientPhone: string;
  ClientPassword: string;
  transactions?: Transaction[]; // Optional, as it might not be included in all API responses
}

export interface Office {
  OfficeID: number;
  OfficeName: string;
  Address: string;
  City: string;
  Province: string;
  ZipCode: string;
  PhoneNumber: string;
  agents?: Agent[]; // Optional
}

export interface Agent {
  AgentID: number;
  OfficeID: number;
  PhoneNumber: string;
  Email: string;
  Password: string;
  Name: string;
  offices?: Office; // Optional
  properties?: Property_type[]; // Optional
}

export interface Property_type {
  PropertyID: number;
  AgentID: number;
  City: string;
  Province: string;
  ZipCode: string;
  Price: number;
  Size: number;
  NoOfBedRoom: number;
  Address: string;
  Status: "Available" | "Sold" | "Pending";
  Type: "House" | "Apartment" | "Commercial";
  agents?: Agent; // Optional
  images?: Image[]; // Optional
  transactions?: Transaction[]; // Optional
}

export interface Transaction {
  TransactionID: number;
  ClientID: number;
  PropertyID: number;
  Date: string;
  Amount: number;
  clients?: Client; // Optional
  properties?: Property_type; // Optional
}

export interface CreateClient {
  ClientName: string;
  ClientEmail: string;
  ClientPhone: string;
  ClientPassword: string;
}

export interface CreateOffice {
  OfficeName: string;
  Address: string;
  City: string;
  Province: string;
  ZipCode: string;
  PhoneNumber: string;
}

export interface CreateAgent {
  OfficeID: number;
  PhoneNumber: string;
  Email: string;
  Password: string;
  Name: string;
}

export interface CreateProperty {
  AgentID: number;
  City: string;
  Province: string;
  ZipCode: string;
  Price: number;
  Size: number;
  NoOfBedRoom: number;
  Address: string;
  Status?: "Available" | "Sold" | "Pending"; // Make these optional if required in schema
  Type: string; // Make these optional if required in schema
}

// Define the interface for an image
export interface Image {
  ImageID: number;
  PropertyID: number;
  ImageURL: string;
  properties?: Property_type; // Optional, assuming this is a relationship to Property_type
}

// Define the interface for creating a new image
export interface CreateImage {
  PropertyID: number;
  ImageURL: string;
}

export interface CreateTransaction {
  ClientID: number;
  PropertyID: number;
  Date: string;
  Amount: number;
}

export interface ClientPassword {
  ClientPassword: string;
}

export interface CreateTransaction {
  ClientID: number;
  PropertyID: number;
  Date: string;
  Amount: number;
}

// Define TypeScript interfaces for the request and response
export interface UploadImage {
  PropertyID: number;
  ImageFile: File; // Assuming you are uploading a file
}

export interface ImageResponse {
  filename: string;
  message: string;
}
export interface PropertySearch {
  City?: string;
  Province?: string;
  PriceLte?: number;
  Type?: "House" | "Apartment" | "Commercial" | "";
}

export interface PropertyResponse {
  PropertyID: number;
  AgentID: number;
  City: string;
  Province: string;
  ZipCode: string;
  Price: number;
  Size: number;
  NoOfBedRoom: number;
  Address: string;
  Status: "Available" | "Sold" | "Pending";
  Type: "House" | "Apartment" | "Commercial";
  agents?: Agent; // Optional
  images?: Image[]; // Optional
  transactions?: Transaction[]; // Optional
}
