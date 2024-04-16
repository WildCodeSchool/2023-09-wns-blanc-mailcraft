import { createContext, useState, ReactNode, useContext } from "react";

type AuthContextProviderProps = {
  children: ReactNode;
};
interface AuthContextType {
  isAuthentificated: boolean;
  setIsAuthenticated: (isAuth: boolean) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [isAuthentificated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token; // Convertit la présence du token en un booléen
  });
  const value = { isAuthentificated, setIsAuthenticated };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthContextProvider, useAuth };
