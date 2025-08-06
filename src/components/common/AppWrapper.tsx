// src/components/AppWrapper.tsx
"use client";

import { AuthProvider } from "@/context/AuthContext";
import { NavBar } from "@/components/common/NavBar";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NavBar />
      {children}
    </AuthProvider>
  );
}
