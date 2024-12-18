import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import Navbar from "../components/Navbar";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { token } = await login(formData);
            localStorage.setItem("token", token);
            navigate("/");
        } catch (err) {
            console.error(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <TextField
                                label="Email"
                                type="email"
                                name="email"
                                variant="outlined"
                                fullWidth
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <TextField
                                label="Password"
                                type="password"
                                name="password"
                                variant="outlined"
                                fullWidth
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            className="mt-4"
                        >
                            Login
                        </Button>
                    </form>
                    <div className="mt-4 text-left">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <span
                                onClick={() => navigate("/register")}
                                className="text-blue-600 cursor-pointer hover:underline"
                            >
                                Register
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
