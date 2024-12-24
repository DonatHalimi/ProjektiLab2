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
export default axiosInstance;