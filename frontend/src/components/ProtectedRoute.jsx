import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { LoadingOverlay } from "../assets/CustomComponents";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const { data } = await axiosInstance.get("/auth/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUserRole(data.role);
                } catch (error) {
                    console.error("Error fetching user details", error);
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, [token]);

    if (!token) {
        return <Navigate to="/login" />;
    };

    if (loading) {
        return <LoadingOverlay />
    };

    if (adminOnly && userRole !== "admin") {
        return <Navigate to="/not-allowed" />;
    }

    return children;
};

export default ProtectedRoute;