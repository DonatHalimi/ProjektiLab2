import axiosInstance from "../utils/axiosInstance";

// Hotel Endpoints
export const getHotels = async () => {
    try {
        const response = await axiosInstance.get('/hotels/get');
        return response.data;
    } catch (error) {
        console.error("Error fetching hotels:", error);
        throw error;
    }
};

export const getHotel = async (id) => {
    try {
        const response = await axiosInstance.get(`/hotels/get/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching hotel with ID ${id}:`, error);
        throw error;
    }
};

export const createHotel = async (hotel) => {
    try {
        const response = await axiosInstance.post('/hotels/create', hotel);
        return response.data;
    } catch (error) {
        console.error("Error creating hotel:", error);
        throw error;
    }
};

export const deleteHotel = async (id) => {
    try {
        const response = await axiosInstance.delete(`/hotels/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting hotel with ID ${id}:`, error);
        throw error;
    }
};

export const updateHotel = async (id, hotel) => {
    try {
        const response = await axiosInstance.put(`/hotels/update/${id}`, hotel);
        return response.data;
    } catch (error) {
        console.error(`Error updating hotel with ID ${id}:`, error);
        throw error;
    }
};