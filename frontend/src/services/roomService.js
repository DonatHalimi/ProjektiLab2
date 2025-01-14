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

export const getRoomPurchases = async () => {
    try {
        const response = await axiosInstance.get('/RoomPurchase');
        return response.data;
    } catch (error) {
        console.error("Error fetching room purchases:", error);
        throw error;
    }
};

export const getRoomPurchase = async (id) => {
    try {
        const response = await axiosInstance.get(`/RoomPurchase/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching room purchase with ID ${id}:`, error);
        throw error;
    }
};

export const createRoomPurchase = async (roomPurchase) => {
    try {
        const response = await axiosInstance.post('/RoomPurchase', roomPurchase);
        return response.data;
    } catch (error) {
        console.error("Error creating room purchase:", error);
        throw error;
    }
};

export const deleteRoomPurchase = async (id) => {
    try {
        const response = await axiosInstance.delete(`/RoomPurchase/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting room purchase with ID ${id}:`, error);
        throw error;
    }
};

export const updateRoomPurchase = async (id, roomPurchase) => {
    try {
        const response = await axiosInstance.put(`/RoomPurchase/${id}`, roomPurchase);
        return response.data;
    } catch (error) {
        console.error(`Error updating room purchase with ID ${id}:`, error);
        throw error;
    }
};

export const getMyRoomPurchases = async (userId) => {
    try {
        const response = await axiosInstance.get(`/RoomPurchase/my/${userId}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching my room purchases with ID ${userId}:`, error);
        throw error;
    }
};

export const getRoomImage = async (filename) => {
    // Remove any leading "Uploads\" or similar from the filename
    const sanitizedFilename = filename.replace(/^Uploads[\\/]/, ''); // Removes "Uploads\" or "Uploads/"

    const imageUrl = `/rooms/uploads/${sanitizedFilename}`;
    try {
        // Fetch the image as an arraybuffer (binary data)
        const response = await axiosInstance.get(imageUrl, { responseType: 'arraybuffer' });

        // Convert arraybuffer to Base64 string
        const base64Image = `data:image/png;base64,${btoa(
            String.fromCharCode(...new Uint8Array(response.data))
        )}`;
        return base64Image;
    } catch (error) {
        console.error(`Error fetching image ${filename}:`, error);
        throw error;
    }
};

export const generateRoomReport = async (criteria) => {
    try {
        const response = await axiosInstance.post('/RoomReports/Generate', criteria);
        return response.data;
    } catch (error) {
        console.error("Error generating room report:", error);
        throw error;
    }
};