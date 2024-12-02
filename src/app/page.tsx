"use client";
import { AuthProvider } from "./components/context/AuthContext";
import Home from "./components";

export default function App() {
  
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}
