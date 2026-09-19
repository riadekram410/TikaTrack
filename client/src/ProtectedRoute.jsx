import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuthentication = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/users/profile",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (response.ok) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthentication();

    const handlePageShow = () => {
      checkAuthentication();
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;