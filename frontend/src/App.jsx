import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ToTop from "./components/ToTop";
import Dashboard from "./pages/Dashboard";
import NotAllowed from "./pages/Errors/NotAllowed";
import NotFound from "./pages/Errors/NotFound";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import FlightList from './pages/Flights/FlightList';
import FlightPurchaseList from './pages/Flights/FlightPurchaseList';
import CreateFlight from './pages/Flights/CreateFlight';
import CreateFlightPurchase from './pages/Flights/CreateFlightPurchase';
import Profile from './pages/Auth/Profile';
import EditFlight from "./pages/Flights/EditFlight";
import EditFlightPurchase from "./pages/Flights/EditFlightsPurchase";
import UserFlightPurchase from "./pages/Flights/UserFlightPurchase";
import AdminDashboard from './pages/Admin/AdminDashboard';
import Checkout from './pages/Flights/Checkout';

const App = () => {
  return (
    <Router>

      <Routes>
        
        <Route path="/profile" element={<Profile/>} />
        <Route path="/admin-dashboard" element={<AdminDashboard/>} />
        <Route path="/edit-flight/:id" element={<EditFlight/>} />
        <Route path="/edit-flight-purchase/:id" element={<EditFlightPurchase />} /> 
        <Route path="/flights" element={<FlightList/>} />
        <Route path="/flight-purchases" element={<FlightPurchaseList />} /> 
        <Route path="/create-flight" element={<CreateFlight />} />
        <Route path="/create-flight-purchase" element={<CreateFlightPurchase />} />
        <Route path="/user-flights" element={<UserFlightPurchase />} />
        <Route path="/checkout/:id" element={<Checkout />} /> 
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
        <Route path="/not-allowed" element={<NotAllowed />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
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