import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedComponent = ({ children }) => {
  const { isAuthentificated, loading } = useAuth();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthentificated) {
        router.replace("/signIn");
      } else {
        setIsVerified(true);
      }
    }
  }, [isAuthentificated, loading, router]);

  if (!isVerified) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedComponent;
