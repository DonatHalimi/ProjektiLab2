import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, Container, IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { login } from "../../services/authService";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
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
            <Container component="main" maxWidth="xs" className="flex flex-1 flex-col align-left mt-36 mb-36">
                <div className="bg-white flex flex-col align-left rounded-md shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-left mb-6">Login</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            Login
                        </Button>
                    </form>
                    <div className="mt-4 text-left">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <span
                                onClick={() => navigate("/register")}
                                className="text-gray-600 cursor-pointer hover:underline"
                            >
                                Register
                            </span>
                        </p>
                    </div>
                </div>
            </Container>
            <Footer />
        </>
    );
};

export default Login;