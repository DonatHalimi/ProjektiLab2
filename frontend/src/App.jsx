import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import pages from './assets/dashboardPages';
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ToTop from "./components/ToTop";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NotAllowed from "./pages/Errors/NotAllowed";
import NotFound from "./pages/Errors/NotFound";
import Checkout from './pages/Flights/Checkout';
import Home from "./pages/Home";
import Flights from "./pages/Profile/Flights";
import ProfileInformation from "./pages/Profile/ProfileInformation";
import Rooms from "./pages/Profile/Rooms";
import Tours from "./pages/Profile/Tours";
import UserRoomPurchase from "./pages/Rooms/UserRoomPurchase";
import CheckoutTour from "./pages/Tours/CheckoutTour";
import UserTourPurchase from "./pages/Tours/UserTourPurchase";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/" element={<Home />} />
        <Route path="/profile/me" element={<ProtectedRoute><ProfileInformation /></ProtectedRoute>} />
        <Route path="/profile/flight-purchases" element={<ProtectedRoute><Flights /></ProtectedRoute>} />
        <Route path="/profile/tour-purchases" element={<ProtectedRoute><Tours /></ProtectedRoute>} />
        <Route path="/profile/room-purchases" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/user-tours" element={<UserTourPurchase />} />
        <Route path="/user-rooms" element={<UserRoomPurchase />} />
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