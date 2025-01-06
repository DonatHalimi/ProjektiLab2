import axiosInstance from "../utils/axiosInstance";

export const getTours = async () => {
    try {
        const response = await axiosInstance.get('/Tour');
        return response.data;
    } catch (error) {
        console.error("Error fetching tours:", error);
        throw error;
    }
};

export const getTour = async (id) => {
    try {
        const response = await axiosInstance.get(`/Tour/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching tour with ID ${id}:`, error);
        throw error;
    }
};

export const createTour = async (tour) => {
    try {
        const response = await axiosInstance.post('/Tour', tour);
        return response.data;
    } catch (error) {
        console.error("Error creating tour:", error);
        throw error;
    }
};

export const deleteTour = async (id) => {
    try {
        const response = await axiosInstance.delete(`/Tour/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting tour with ID ${id}:`, error);
        throw error;
    }
};

export const updateTour = async (id, tour) => {
    try {
        const response = await axiosInstance.put(`/Tour/${id}`, tour);
        return response.data;
    } catch (error) {
        console.error(`Error updating tour with ID ${id}:`, error);
        throw error;
    }
};

export const getTourPurchases = async () => {
    try {
        const response = await axiosInstance.get('/TourPurchase');
        return response.data;
    } catch (error) {
        console.error("Error fetching tour purchases:", error);
        throw error;
    }
};

export const getTourPurchase = async (id) => {
    try {
        const response = await axiosInstance.get(`/TourPurchase/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching tour purchase with ID ${id}:`, error);
        throw error;
    }
};

export const createTourPurchase = async (tourPurchase) => {
    try {
        const response = await axiosInstance.post('/TourPurchase', tourPurchase);
        return response.data;
    } catch (error) {
        console.error("Error creating tour purchase:", error);
        throw error;
    }
};

export const deleteTourPurchase = async (id) => {
    try {
        const response = await axiosInstance.delete(`/TourPurchase/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting tour purchase with ID ${id}:`, error);
        throw error;
    }
};

export const getMyTourPurchases = async (id) => {
    try {
        const response = await axiosInstance.get(`/TourPurchase/my/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching my tour purchases with ID ${id}:`, error);
        throw error;
    }
};

export const updateTourPurchase = async (id, tourPurchase) => {
    try {
        const response = await axiosInstance.put(`/TourPurchase/${id}`, tourPurchase);
        return response.data;
    } catch (error) {
        console.error(`Error updating tour purchase with ID ${id}:`, error);
        throw error;
    }
};
export const generateTourReport = (criteria) => axiosInstance.post('/TourReports/Generate', criteria);