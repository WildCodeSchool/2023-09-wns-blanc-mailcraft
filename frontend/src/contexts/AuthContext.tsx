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
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuth: boolean) => void;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  error: any;
  refreshUser: boolean;
  setRefreshUser: React.Dispatch<React.SetStateAction<boolean>>;
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
      socialLinks {
        id
        facebook
        twitter
        linkedin
      }
      isFirstTourCompleted
    }
  }
`;

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [refreshUser, setRefreshUser] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token; // Convertit la présence du token en un booléen
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [getMe, { data, loading: queryLoading, error }] = useLazyQuery(GET_ME, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setUser(data.getMe);
      setLoading(false);
    },
    onError: () => {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      router.push("/signIn");
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getMe();
      setRefreshUser(false);
    } else {
      setLoading(false);
      setRefreshUser(false);
    }
  }, [getMe, refreshUser]);

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    loading,
    error,
    refreshUser,
    setRefreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthContextProvider, useAuth };
