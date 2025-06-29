import { Property_type, PropertyCreate } from "../types";
import { createProperty, readProperties, readPropertyById } from "./properties_service";

// Function to handle creating a new property
const handleCreateProperty = async (Property_type: PropertyCreate): Promise<Property_type | string> => {
  try {
    const newProperty = await createProperty(property);
    return newProperty;
  } catch (error) {
    return "Error creating property";
  }
};

// Function to handle fetching all properties with pagination
const handleGetProperties = async (skip: number = 0, limit: number = 100): Promise<Property_type[] | string> => {
  try {
    const properties = await readProperties(skip, limit);
    return properties;
  } catch (error) {
    return "Error fetching properties";
  }
};

// Function to handle fetching a single property by ID
const handleGetPropertyById = async (propertyId: number): Promise<Property | string> => {
  try {
    const property = await readPropertyById(propertyId);
    return property;
  } catch (error) {
    return "Property not found";
  }
};

export { handleCreateProperty, handleGetProperties, handleGetPropertyById };
