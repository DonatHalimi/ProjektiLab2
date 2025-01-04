import axiosInstance from "../utils/axiosInstance";

export const getRoles = async () => {
    try {
        const response = await axiosInstance.get('/roles/get');
        return response.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error;
    }
};

export const getRole = async (id) => {
    try {
        const response = await axiosInstance.get(`/roles/get/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching role with ID ${id}:`, error);
        throw error;
    }
};

export const createRole = async (user) => {
    try {
        const response = await axiosInstance.post('/roles/create', user);
        return response.data;
    } catch (error) {
        console.error("Error creating role:", error);
        throw error;
    }
};

export const editRole = async (id, role) => {
    try {
        const response = await axiosInstance.put(`/roles/update/${id}`, role);
        return response.data;
    } catch (error) {
        console.error(`Error updating role with ID ${id}:`, error);
        throw error;
    }
};

export const deleteRole = async (id) => {
    try {
        const response = await axiosInstance.delete(`/roles/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting role with ID ${id}:`, error);
        throw error;
    }
};