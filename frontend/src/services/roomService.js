import axiosInstance from "../utils/axiosInstance";

// Room Endpoints
export const getRooms = async () => {
    try {
        const response = await axiosInstance.get('/rooms/get');
        return response.data;
    } catch (error) {
        console.error("Error fetching rooms:", error);
        throw error;
    }
};

export const getRoom = async (id) => {
    try {
        const response = await axiosInstance.get(`/rooms/get/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching room with ID ${id}:`, error);
        throw error;
    }
};

export const createRoom = async (room) => {
    try {
        const response = await axiosInstance.post('/rooms/create', room);
        return response.data;
    } catch (error) {
        console.error("Error creating room:", error);
        throw error;
    }
};

export const deleteRoom = async (id) => {
    try {
        const response = await axiosInstance.delete(`/rooms/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting room with ID ${id}:`, error);
        throw error;
    }
};

export const updateRoom = async (id, room) => {
    try {
        const response = await axiosInstance.put(`/rooms/update/${id}`, room);
        return response.data;
    } catch (error) {
        console.error(`Error updating room with ID ${id}:`, error);
        throw error;
    }
};

export const deleteImageFromRoom = async (imageName) => {
    try {
        const response = await axiosInstance.delete(`/rooms/delete-image/${imageName}`);
        return response;
    } catch (error) {
        console.error("Error deleting image:", error);
        throw error;
    }
};

// Room purchase endpoints