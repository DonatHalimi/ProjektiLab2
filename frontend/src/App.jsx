import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
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

const App = () => {
  return (
    <Router>
      <Routes>
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