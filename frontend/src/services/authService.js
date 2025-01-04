import axiosInstance from "../utils/axiosInstance";

export const register = async (userData) => {
    try {
        const response = await axiosInstance.post("/auth/register", userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const login = async (loginData) => {
    try {
        const response = await axiosInstance.post("/auth/login", loginData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await axiosInstance.get('/auth/me');
        return response.data;
    } catch (error) {
        console.error("Error fetching current user:", error);
        throw error;
    }
};