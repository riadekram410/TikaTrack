import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function GuestRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await fetch(
                   `${import.meta.env.VITE_API_URL}/users/profile`,
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
                console.error(
                    "Authentication check failed:",
                    error
                );

                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuthentication();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Already logged in → Dashboard
    if (authenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    // Not logged in → show login/register/etc.
    return children;
}

export default GuestRoute;