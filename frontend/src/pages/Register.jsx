import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import Navbar from "../components/Navbar";

const Register = () => {
    const [formData, setFormData] = useState({ email: "", password: "", firstName: "", lastName: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate("/login");
        } catch (err) {
            console.error(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <TextField
                                label="First Name"
                                type="text"
                                name="firstName"
                                variant="outlined"
                                fullWidth
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <TextField
                                label="Last Name"
                                type="text"
                                name="lastName"
                                variant="outlined"
                                fullWidth
                                onChange={handleChange}
                                required
                            />
                        </div>
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
                            Register
                        </Button>
                    </form>
                    <div className="mt-4 text-left">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <span
                                onClick={() => navigate("/login")}
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

export default Register;
