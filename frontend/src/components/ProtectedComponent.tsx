import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

// Wrap les pages à sécuriser avec ce composant

const ProtectedComponent = ({ children }) => {
  const { isAuthentificated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthentificated) {
      router.push("/signIn");
    }
  }, [isAuthentificated, router]);

  if (!isAuthentificated) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedComponent;
