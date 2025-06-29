import { CreateImage, Image, UploadImage, ImageResponse } from "../types"; // Adjust the import paths and types as necessary
import api from "../api"; // Assuming you have an axios instance in api.ts

// Create a new image
export const createImage = async (imageData: CreateImage): Promise<Image> => {
  const formData = new FormData();
  formData.append("PropertyID", imageData.PropertyID.toString());
  formData.append("ImageURL", imageData.ImageURL);

  const response = await api.post<Image>("/images/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Get images by PropertyID
export const getImagesByPropertyId = async (propertyId: number): Promise<Image[]> => {
  const response = await api.get<Image[]>(`/properties/${propertyId}/images`);
  return response.data;
};


export const uploadImage = async (
  imageData: UploadImage
): Promise<ImageResponse> => {
  const formData = new FormData();
  formData.append("file", imageData.ImageFile);

  try {
    // Send `property_ID` as a query parameter instead of appending it to FormData
    const response = await api.post<ImageResponse>(
      `/upload/?property_ID=${imageData.PropertyID}`, // Pass property_ID in the query string
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Upload Error:");
    throw error;
  }
};
