import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'https://localhost:44396/api',
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Flight Endpoints
export const getFlights = () => axiosInstance.get('/Flights');
export const getFlight = (id) => axiosInstance.get(`/Flights/${id}`);
export const createFlight = (flight) => axiosInstance.post('/Flights', flight);
export const deleteFlight = (id) => axiosInstance.delete(`/Flights/${id}`);
export const updateFlight = (id, flight) => axiosInstance.put(`/Flights/${id}`, flight);

// Flight Purchases Endpoints
export const getFlightPurchases = () => axiosInstance.get('/FlightPurchases');
export const getFlightPurchase = (id) => axiosInstance.get(`/FlightPurchases/${id}`);
export const createFlightPurchase = (flightPurchase) => axiosInstance.post('/FlightPurchases', flightPurchase);
export const deleteFlightPurchase = (id) => axiosInstance.delete(`/FlightPurchases/${id}`);
export const getMyFlightPurchases = (id) => axiosInstance.get(`/FlightPurchases/my/${id}`);
export const updateFlightPurchase = (id, flightPurchase) => axiosInstance.put(`/FlightPurchases/${id}`, flightPurchase);
export const generateReport = (criteria) => axiosInstance.post('/Reports/Generate', criteria);

// Tour Endpoints
export const getTours = () => axiosInstance.get('/Tour');
export const getTour = (id) => axiosInstance.get(`/Tour/${id}`);
export const createTour = (tour) => axiosInstance.post('/Tour', tour);
export const deleteTour = (id) => axiosInstance.delete(`/Tour/${id}`);
export const updateTour = (id, tour) => axiosInstance.put(`/Tour/${id}`, tour);

// Tour Purchases Endpoints
export const getTourPurchases = () => axiosInstance.get('/TourPurchase');
export const getTourPurchase = (id) => axiosInstance.get(`/TourPurchase/${id}`);
export const createTourPurchase = (tourPurchase) => axiosInstance.post('/TourPurchase', tourPurchase);
export const deleteTourPurchase = (id) => axiosInstance.delete(`/TourPurchase/${id}`);
export const getMyTourPurchases = (id) => axiosInstance.get(`/TourPurchase/my/${id}`);
export const updateTourPurchase = (id, tourPurchase) => axiosInstance.put(`/TourPurchase/${id}`, tourPurchase);

// Hotel Endpoints
export const getHotels = () => axiosInstance.get('/hotels/get');
export const getHotel = (id) => axiosInstance.get(`/hotels/get/${id}`);
export const createHotel = (hotel) => axiosInstance.post('/hotels/create', hotel);
export const deleteHotel = (id) => axiosInstance.delete(`/hotels/delete/${id}`);
export const updateHotel = (id, hotel) => axiosInstance.put(`/hotels/update/${id}`, hotel);

export default axiosInstance;