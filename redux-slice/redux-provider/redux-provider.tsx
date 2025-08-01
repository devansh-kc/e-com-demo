// src/components/ReduxProvider.tsx
"use client"; // This directive marks the component as a client component

import { Provider } from "react-redux";
import { store } from "@/store/store"; // Adjust path as needed

export function ReduxProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Provider store={store}>{children}</Provider>;
}
