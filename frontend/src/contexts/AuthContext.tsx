import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";

type AuthContextProviderProps = {
  children: ReactNode;
};

interface AuthContextType {
  isAuthentificated: boolean;
  setIsAuthenticated: (isAuth: boolean) => void;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  error: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

const GET_ME = gql`
  query GetMe {
    getMe {
      id
      pseudo
      firstname
      lastname
      email
      subscriptionType
      role
    }
  }
`;

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [isAuthentificated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token; // Convertit la présence du token en un booléen
  });
  const [user, setUser] = useState(null);
  const router = useRouter();

  const [getMe, { data, loading, error }] = useLazyQuery(GET_ME, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setUser(data.getMe);
    },
    onError: () => {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUser(null);
      router.push("/signIn");
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getMe();
    }
  }, [getMe]);

  const value = { isAuthentificated, setIsAuthenticated, user, setUser, loading, error };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthContextProvider, useAuth };
