import { createContext, type Dispatch, type SetStateAction, useContext } from "react";

export type TokenContextType = {
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
};


export const TokenContext = createContext<TokenContextType | null>(null)

export function useAuth() {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useAuth must be used within a TokenContextProvider");
  }
  return context;
}