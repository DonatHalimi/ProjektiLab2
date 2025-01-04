import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import pages from './assets/dashboardPages';
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ToTop from "./components/ToTop";

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import Reports from './pages/Admin/FlightPurchaseReports';

// Auth Pages
import Login from "./pages/Auth/Login";
import Profile from './pages/Auth/Profile';
import ProfileInformation from "./pages/Profile/ProfileInformation";
import Register from "./pages/Auth/Register";

// Error Pages
import NotAllowed from "./pages/Errors/NotAllowed";
import NotFound from "./pages/Errors/NotFound";

// Flights Pages
import Checkout from './pages/Flights/Checkout';
import CreateFlight from './pages/Flights/CreateFlight';
import CreateFlightPurchase from './pages/Flights/CreateFlightPurchase';
import EditFlight from "./pages/Flights/EditFlight";
import EditFlightPurchase from "./pages/Flights/EditFlightsPurchase";
import FlightList from './pages/Flights/FlightList';
import FlightPurchaseList from './pages/Flights/FlightPurchaseList';
import UserFlightPurchase from "./pages/Flights/UserFlightPurchase";

// Hotels Pages
import CreateHotel from "./pages/Hotel/CreateHotel";
import EditHotel from "./pages/Hotel/EditHotel";
import HotelList from "./pages/Hotel/HotelList";

// Tours Pages
import CheckoutTour from "./pages/Tours/CheckoutTour";
import CreateTour from "./pages/Tours/CreateTour";
import CreateTourPurchase from "./pages/Tours/CreateTourPurchase";
import EditTour from "./pages/Tours/EditTour";
import EditTourPurchase from "./pages/Tours/EditTourPurchase";
import TourList from "./pages/Tours/TourList";
import TourPurchaseList from "./pages/Tours/TourPurchaseList";
import UserTourPurchase from "./pages/Tours/UserTourPurchase";

// Home Page
import Home from "./pages/Home";
import Flights from "./pages/Profile/Flights";
import Tours from "./pages/Profile/Tours";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Authenticated User Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/me" element={<ProtectedRoute><ProfileInformation /></ProtectedRoute>} />
        <Route path="/profile/flight-purchases" element={<ProtectedRoute><Flights /></ProtectedRoute>} />
        <Route path="/profile/tour-purchases" element={<ProtectedRoute><Tours /></ProtectedRoute>} />
        {/* Admin Dashboard */}
        {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
        <Route path="/reports" element={<Reports />} />

        {/* Flights Routes */}
        {/* <Route path="/flights" element={<FlightList />} />
        <Route path="/flight-purchases" element={<FlightPurchaseList />} />
        <Route path="/create-flight" element={<CreateFlight />} />
        <Route path="/create-flight-purchase" element={<CreateFlightPurchase />} />
        <Route path="/edit-flight/:id" element={<EditFlight />} />
        <Route path="/edit-flight-purchase/:id" element={<EditFlightPurchase />} />
        <Route path="/user-flights" element={<UserFlightPurchase />} /> */}
        <Route path="/checkout/:id" element={<Checkout />} />

        {/* Hotels Routes */}
        {/* <Route path="/hotels" element={<HotelList />} />
        <Route path="/create-hotel" element={<CreateHotel />} />
        <Route path="/edit-hotel/:id" element={<EditHotel />} /> */}

        {/* <Route path="/create-tour" element={<CreateTour />} />
        <Route path="/create-tour-purchase" element={<CreateTourPurchase />} />
        <Route path="/edit-tour/:id" element={<EditTour />} />
        <Route path="/edit-tour-purchase/:id" element={<EditTourPurchase />} />
        <Route path="/tour-list" element={<TourList />} />
        <Route path="/tour-purchases" element={<TourPurchaseList />} /> */}
        <Route path="/user-tours" element={<UserTourPurchase />} />
        <Route path="/checkouttour/:id" element={<CheckoutTour />} />

        <Route path="/dashboard" element={<ProtectedRoute adminOnly><DashboardLayout /></ProtectedRoute>}>
          {Object.entries(pages).map(([name, Page]) => (
            <Route key={name} path={name} element={<ProtectedRoute adminOnly><Page /></ProtectedRoute>} />
          ))}
        </Route>

        <Route path="/not-allowed" element={<NotAllowed />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={3500}
        closeOnClick
        hideProgressBar={true}
        newestOnTop
        stacked
      />
      <ToTop />
    </Router>
  );
};

export default App;