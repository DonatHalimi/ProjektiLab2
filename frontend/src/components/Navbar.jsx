import { Button, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginButton, OutlinedBlueButton, ProfileDropdown, ProfileIcon } from "../assets/CustomComponents";
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
                <Tooltip title="Home" arrow>
                    <div onClick={() => navigate('/')} className="cursor-pointer text-black text-2xl">
                        Travel Agency
                    </div>
                </Tooltip>

                <div className="space-x-4">
                    <div className="flex items-center space-x-1">
                        {isLoggedIn ? (
                            <>
                                <Link to="/user-tours" className="text-black hover:underline">
                                    <Button>Tours</Button>
                                </Link>

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

                                <Link to="/profile" className="text-black hover:underline">
                                    <OutlinedBlueButton variant="outlined">
                                        My Profile
                                    </OutlinedBlueButton>
                                </Link>
                            </>
                        ) : (
                            <LoginButton />
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;