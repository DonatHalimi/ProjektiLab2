import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ToTop from "./components/ToTop";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /> </ProtectedRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /> </PublicRoute>} />
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