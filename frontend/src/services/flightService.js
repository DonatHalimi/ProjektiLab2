import axiosInstance from "../utils/axiosInstance";

export const getFlights = async () => {
    try {
        const response = await axiosInstance.get('/Flights');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getFlight = async (id) => {
    try {
        const response = await axiosInstance.get(`/Flights/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createFlight = async (flight) => {
    try {
        const response = await axiosInstance.post('/Flights', flight);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const editFlight = async (id, flight) => {
    try {
        const response = await axiosInstance.put(`/Flights/${id}`, flight);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteFlight = async (id) => {
    try {
        const response = await axiosInstance.delete(`/Flights/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateFlight = async (id, flight) => {
    try {
        const response = await axiosInstance.put(`/Flights/${id}`, flight);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getFlightPurchases = async () => {
    try {
        const response = await axiosInstance.get('/FlightPurchases');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getFlightPurchase = async (id) => {
    try {
        const response = await axiosInstance.get(`/FlightPurchases/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createFlightPurchase = async (flightPurchase) => {
    try {
        const response = await axiosInstance.post('/FlightPurchases', flightPurchase);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteFlightPurchase = async (id) => {
    try {
        const response = await axiosInstance.delete(`/FlightPurchases/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMyFlightPurchases = async (id) => {
    try {
        const response = await axiosInstance.get(`/FlightPurchases/my/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateFlightPurchase = async (id, flightPurchase) => {
    try {
        const response = await axiosInstance.put(`/FlightPurchases/${id}`, flightPurchase);
        return response.data;
    } catch (error) {
        throw error;
    }
};