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

export const getFlights = () => axiosInstance.get('/Flights');
export const getFlight = (id) => axiosInstance.get(`/Flights/${id}`);
export const createFlight = (flight) => axiosInstance.post('/Flights', flight);
export const deleteFlight = (id) => axiosInstance.delete(`/Flights/${id}`);
export const updateFlight = (id, flight) => axiosInstance.put(`/Flights/${id}`, flight);

export const getFlightPurchases = () => axiosInstance.get('/FlightPurchases');
export const getFlightPurchase = (id) => axiosInstance.get(`/FlightPurchases/${id}`);
export const createFlightPurchase = (flightPurchase) => axiosInstance.post('/FlightPurchases', flightPurchase);
export const deleteFlightPurchase = (id) => axiosInstance.delete(`/FlightPurchases/${id}`);
export const getMyFlightPurchases = (id) => axiosInstance.get(`/FlightPurchases/my/${id}`);
export const updateFlightPurchase = (id, flightPurchase) => axiosInstance.put(`/FlightPurchases/${id}`, flightPurchase);



export const getUsers = () => axiosInstance.get('/users/get');
export const getUser = (id) => axiosInstance.get(`/users/get/${id}`);
export const createUser = (user) => axiosInstance.post('/users/create', user);
export const deleteUser = (id) => axiosInstance.delete(`/users/delete/${id}`);

export const getMyInfo = () => axiosInstance.get('/auth/me');

// Tour Endpoints (New)
export const getTours = () => axiosInstance.get('/Tour');  // Get all tours
export const getTour = (id) => axiosInstance.get(`/Tour/${id}`);  // Get a single tour by ID
export const createTour = (tour) => axiosInstance.post('/Tour', tour);  // Create a new tour
export const deleteTour = (id) => axiosInstance.delete(`/Tour/${id}`);  // Delete a specific tour
export const updateTour = (id, tour) => axiosInstance.put(`/Tour/${id}`, tour);  // Update a specific tour

// Tour Purchases Endpoints
export const getTourPurchases = () => axiosInstance.get('/TourPurchase');  // Get all tour purchases
export const getTourPurchase = (id) => axiosInstance.get(`/TourPurchase/${id}`);  // Get a specific tour purchase
export const createTourPurchase = (tourPurchase) => axiosInstance.post('/TourPurchase', tourPurchase);  // Create a tour purchase
export const deleteTourPurchase = (id) => axiosInstance.delete(`/TourPurchase/${id}`);  // Delete a specific tour purchase
export const getMyTourPurchases = (id) => axiosInstance.get(`/TourPurchase/my/${id}`);  // Get all tour purchases by the user
export const updateTourPurchase = (id, tourPurchase) => axiosInstance.put(`/TourPurchase/${id}`, tourPurchase);  // Update a tour purchase

export default axiosInstance;