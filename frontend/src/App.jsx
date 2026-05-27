import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./Screens/Home/Home";
import ProductDetail from "./Screens/ProductDetail/ProductDetail";
import Register from "./Screens/Register/Register";
import Login from "./Screens/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Product from "./Screens/Product/Product";
import Booking from "./Screens/booking/Booking";
import Confirm from "./Screens/Confirm/Confirm";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import About from "./Screens/about/About";
import UserInfo from "./Screens/userInfo/UserInfo";
import Admin from "./Screens/Admin/Admin";
import "./App.css";

const AdminRoute = ({ children }) => {
  const token   = useSelector((s) => s.auth.accessToken);
  const userStr = useSelector((s) => s.auth.user);
  const user    = userStr ? JSON.parse(userStr) : null;
  if (!token)               return <Navigate to="/dang-nhap" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

// Layout bọc Navbar + Footer cho tất cả trang thường
const MainLayout = () => (
  <>
    <Navbar />
    <ScrollToTop />
    <Outlet />
    <Footer />
  </>
);

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Admin không có Navbar/Footer */}
      <Route
        path="/admin"
        element={<AdminRoute><Admin /></AdminRoute>}
      />

      {/* Các trang thường có Navbar + Footer */}
      <Route element={<MainLayout />}>
        <Route path="/"               element={<Home />} />
        <Route path="/tour-du-lich"   element={<Product />} />
        <Route path="/tours/:slug"    element={<ProductDetail />} />
        <Route path="/dang-ky"        element={<Register />} />
        <Route path="/dang-nhap"      element={<Login />} />
        <Route path="/gioi-thieu"     element={<About />} />
        <Route path="/booking"        element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/confirm"        element={<ProtectedRoute><Confirm /></ProtectedRoute>} />
        <Route path="/info"           element={<ProtectedRoute><UserInfo /></ProtectedRoute>} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
