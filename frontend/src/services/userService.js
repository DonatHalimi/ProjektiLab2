import axiosInstance from "../utils/axiosInstance";

export const getUsers = async () => {
    try {
        const response = await axiosInstance.get('/users/get');
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const getUser = async (id) => {
    try {
        const response = await axiosInstance.get(`/users/get/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw error;
    }
};

export const createUser = async (user) => {
    try {
        const response = await axiosInstance.post('/users/create', user);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const editUser = async (id, user) => {
    try {
        const response = await axiosInstance.put(`/users/update/${id}`, user);
        return response.data;
    } catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await axiosInstance.delete(`/users/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        throw error;
    }
};