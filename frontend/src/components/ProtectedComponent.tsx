import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedComponent = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/signIn");
      } else {
        setIsVerified(true);
      }
    }
  }, [isAuthenticated, loading, router]);

  if (!isVerified) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedComponent;
