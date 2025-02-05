import { Button, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginButton, ProfileDropdown, ProfileIcon } from "../assets/CustomComponents";
import { getCurrentUser } from "../services/authService";

const Navbar = () => {
    const navigate = useNavigate();
    const profileRef = useRef(null);

    const [userRole, setUserRole] = useState(null);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const isAdmin = userRole === "admin";
    const isLoggedIn = localStorage.getItem("token");

    useEffect(() => {
        const fetchUserRole = async () => {
            if (isLoggedIn) {
                try {
                    const response = await getCurrentUser();
                    setUserRole(response.role);
                } catch (error) {
                    console.error("Error fetching user role:", error);
                }
            }
        };

        fetchUserRole();
    }, [isLoggedIn]);

    const toggleDropdown = (type) => {
        if (type === 'profile') {
            setIsProfileDropdownOpen((prev) => !prev);
        }
    };

    const handleClickOutside = (event) => {
        if (profileRef.current && !profileRef.current.contains(event.target)) {
            setIsProfileDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <nav className="bg-white border-b border-gray-100 py-4 px-6 pl-60 pr-60 w-full z-10">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Tooltip title="Home" arrow>
                        <div onClick={() => navigate('/')} className="cursor-pointer text-black text-2xl">
                            Travel Agency
                        </div>
                    </Tooltip>

                    {isLoggedIn && (
                        <>
                            {/* <Link to="/user-flights" className="text-black hover:underline">
                                <Button>Flights</Button>
                            </Link> */}
                            <Link to="/user-tours" className="text-black hover:underline">
                                <Button>Tours</Button>
                            </Link>
                            <Link to="/user-rooms" className="text-black hover:underline">
                                <Button>Rooms</Button>
                            </Link>
                            <Link to="/contact" className="text-black hover:underline">
                                <Button>Contact</Button>
                            </Link>
                            <Link to="/faq" className="text-black hover:underline">
                                <Button>FAQ</Button>
                            </Link>
                        </>
                    )}
                </div>

                <div className="flex items-center space-x-1">
                    {isLoggedIn ? (
                        <div ref={profileRef} className="relative z-[1000]">
                            <ProfileIcon
                                handleProfileDropdownToggle={() => toggleDropdown('profile')}
                                isDropdownOpen={isProfileDropdownOpen}
                            />
                            {isProfileDropdownOpen && (
                                <ProfileDropdown
                                    isOpen={isProfileDropdownOpen}
                                    isAdmin={isAdmin}
                                    handleLogout={handleLogout}
                                />
                            )}
                        </div>
                    ) : (
                        <LoginButton />
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;