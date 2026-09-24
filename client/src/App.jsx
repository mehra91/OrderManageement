import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import CreateOrder from './pages/CreateOrder';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';

function Private({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <nav className="flex gap-4 mb-6">
        {user ? (
          <>
            <Link to="/">Products</Link>
            <Link to="/create-order">Create Order</Link>
            <Link to="/my-orders">My Orders</Link>
            <button onClick={logout}>Logout ({user.name})</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Private><ProductList /></Private>} />
        <Route path="/create-order" element={<Private><CreateOrder /></Private>} />
        <Route path="/my-orders" element={<Private><MyOrders /></Private>} />
        <Route path="/orders/:id" element={<Private><OrderDetails /></Private>} />
      </Routes>
    </div>
  );
}
