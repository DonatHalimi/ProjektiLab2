import axiosInstance from "../utils/axiosInstance";

export const getFAQs = async () => {
    try {
        const response = await axiosInstance.get('/FAQ');
        return response.data;
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        throw error;
    }
};

export const getFAQ = async (id) => {
    try {
        const response = await axiosInstance.get(`/FAQ/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching FAQ with ID ${id}:`, error);
        throw error;
    }
};

export const createFAQ = async (faq) => {
    try {
        const response = await axiosInstance.post('/FAQ', faq);
        return response.data;
    } catch (error) {
        console.error("Error creating FAQ:", error);
        throw error;
    }
};

export const updateFAQ = async (id, faq) => {
    try {
        const response = await axiosInstance.put(`/FAQ/${id}`, faq);
        return response.data;
    } catch (error) {
        console.error(`Error updating FAQ with ID ${id}:`, error);
        throw error;
    }
};

export const deleteFAQ = async (id) => {
    try {
        const response = await axiosInstance.delete(`/FAQ/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting FAQ with ID ${id}:`, error);
        throw error;
    }
};

export const deleteBulkFAQs = async (ids) => {
    try {
        const response = await axiosInstance.post('/FAQ/delete-bulk', { Ids: ids });
        return response.data;
    } catch (error) {
        console.error('Error deleting FAQs:', error);
        throw error;
    }
}; 