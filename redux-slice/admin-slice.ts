// /store/slices/cartSlice.ts
import { createSlice } from "@reduxjs/toolkit";

export interface AdminPart {
  isAdmin: boolean;
}

const initialState: AdminPart = {
  isAdmin: false,
};

const AdminSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    showAdminPart: (state) => {
      state.isAdmin = !state?.isAdmin;
    },
    disableAdmin: (state) => {
      state.isAdmin = false;
    },
  },
});

export const { showAdminPart, disableAdmin } = AdminSlice.actions;
export default AdminSlice.reducer;
