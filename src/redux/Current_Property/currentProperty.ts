import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Property_Data {
  PropertyID: number;
  AgentID: number;
  City: string;
  Province: string;
  ZipCode: string;
  Price: number;
  Size: number;
  NoOfBedRoom: number;
  Address: string;
  Status: "Available" | "Sold" | "Pending" | "";
  Type: "House" | "Apartment" | "Commercial" | "";
}

const initialState: Property_Data = {
  PropertyID: 0,
  AgentID: 0,
  City: "",
  Province: "",
  ZipCode: "",
  Price: 0,
  Size: 0,
  NoOfBedRoom: 0,
  Address: "",
  Status: "",
  Type: "",
};

export const currentProperty = createSlice({
  name: "property",
  initialState,
  reducers: {
    setProperty: (state, action: PayloadAction<Property_Data>) => {
      state.PropertyID = action.payload.PropertyID;
      state.AgentID = action.payload.AgentID;
      state.City = action.payload.City;
      state.Province = action.payload.Province;
      state.ZipCode = action.payload.ZipCode;
      state.Price = action.payload.Price;
      state.Size = action.payload.Size;
      state.NoOfBedRoom = action.payload.NoOfBedRoom;
      state.Address = action.payload.Address;
      state.Status = action.payload.Status;
      state.Type = action.payload.Type;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setProperty } = currentProperty.actions;

export default currentProperty.reducer;
