import { useState } from "react";
import { register } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Register = () => {
    const [formData, setFormData] = useState({ email: "", password: "", firstName: "", lastName: "" });
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);
    const handleMouseDownPassword = (event) => event.preventDefault();

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
            <Container component="main" maxWidth="xs" className="flex flex-1 flex-col align-left mt-36 mb-36">
                <div className="bg-white flex flex-col align-left rounded-md shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-left mb-6">Register</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <TextField
                            label="First Name"
                            type="text"
                            name="firstName"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Last Name"
                            type="text"
                            name="lastName"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Email"
                            type="email"
                            name="email"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
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
                                className="text-gray-600 cursor-pointer hover:underline"
                            >
                                Login
                            </span>
                        </p>
                    </div>
                </div>
            </Container>
            <Footer />
        </>
    );
};

export default Register;