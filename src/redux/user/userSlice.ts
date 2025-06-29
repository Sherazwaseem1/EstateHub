import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  Id: number;
  Name: string;
  Email: string;
  Password: string;
  Phone: string;
  IsClient: boolean;
}
export interface UserID {
  Id: number;
}

const initialState: UserState = {
  Id: 0,
  Name: "",
  Email: "",
  Password: "",
  Phone: "",
  IsClient: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.Id = action.payload.Id;
      state.Name = action.payload.Name;
      state.Email = action.payload.Email;
      state.Password = action.payload.Password;
      state.Phone = action.payload.Phone;
      state.IsClient = action.payload.IsClient;
    },

    setUserID: (state, action: PayloadAction<UserID>) => {
      state.Id = action.payload.Id;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setUserID } = userSlice.actions;

export default userSlice.reducer;
