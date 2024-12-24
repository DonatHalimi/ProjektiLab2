import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Navbar = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const isLoggedIn = localStorage.getItem("token");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUserRole = async () => {
            if (isLoggedIn) {
                try {
                    const { data } = await axiosInstance.get("/auth/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUserRole(data.role);
                } catch (error) {
                    console.error("Error fetching user role:", error);
                }
            }
        };

        fetchUserRole();
    }, [isLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <nav className="bg-white border-b border-gray-100 py-4 px-6 pl-60 pr-60 w-full z-10">
            <div className="flex justify-between items-center">
                <div onClick={() => navigate('/')} className="cursor-pointer text-black text-2xl">
                    Travel Agency
                </div>
                <div className="space-x-4">
                    <Link to="/" className="text-black hover:underline">
                        <Button>
                            Home
                        </Button>
                    </Link>

                    {userRole === "admin" && (
                        <Link to="/admin-dashboard" className="text-black hover:underline">
                            <Button>
                               Admin Dashboard
                            </Button>
                        </Link>
                        
                    )}
                    {!isLoggedIn ? (
                        <Link to="/login" className="text-black hover:underline">
                            <Button>
                                Login
                            </Button>
                        </Link>
                    ) : (
                        <>
                        <Link to="/user-flights" className="text-black hover:underline">
                            <Button >
                                Flights
                            </Button>
                        </Link>
                        <Link to="/profile" className="text-black hover:underline">
                            <Button variant="outlined">
                                My Profile
                            </Button>
                        </Link>
                        <Button
                            variant="outlined"
                            onClick={handleLogout}
                            className="text-black hover:underline"
                        >
                            Logout
                        </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;