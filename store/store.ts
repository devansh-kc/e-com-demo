// src/lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/redux-slice/cart-slice";
// Import your slices here

export const store = configureStore({
  reducer: {
    // Add your slice reducers here
    CartSlice: cartReducer,
  },
  // Optional: Add middleware or other configurations
});

// Define types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
