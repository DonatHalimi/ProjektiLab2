import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <nav className="bg-blue-600 p-4 w-full z-10">
            <div className="flex justify-between items-center">
                <div onClick={() => navigate('/')} className="cursor-pointer text-white text-2xl">TravelApp</div>
                <div className="space-x-4">
                    <Link to="/" className="text-white hover:underline">
                        Home
                    </Link>
                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className="text-white hover:underline">
                                Login
                            </Link>
                            <Link to="/register" className="text-white hover:underline">
                                Register
                            </Link>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="text-white hover:underline"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;