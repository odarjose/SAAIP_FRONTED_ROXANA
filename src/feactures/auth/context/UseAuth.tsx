import { useContext } from "react";
import { AuthContextType } from "../types/auth";
import { AuthContext } from "./AuthContext";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
