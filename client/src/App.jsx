import { NavLink, Navigate, Route, Routes, Link } from 'react-router-dom';
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

const navClass = ({ isActive }) => `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`;

export default function App() {
  const { user, logout } = useAuth();
  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-7">
      <header className="mb-7 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:mb-9 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="flex w-fit items-center gap-2.5 text-lg font-extrabold tracking-tight text-slate-900">
          <span className="grid size-9 place-items-center rounded-xl bg-blue-600 text-sm text-white shadow-sm">O</span>
          Orderly
        </Link>
        <nav className="flex flex-wrap items-center gap-1" aria-label="Main navigation">
          {user ? <>
            <NavLink to="/" end className={navClass}>Products</NavLink>
            <NavLink to="/create-order" className={navClass}>Create order</NavLink>
            <NavLink to="/my-orders" className={navClass}>My orders</NavLink>
            <button onClick={logout} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-700">Log out</button>
          </> : <>
            <NavLink to="/login" className={navClass}>Log in</NavLink>
            <NavLink to="/register" className={navClass}>Create account</NavLink>
          </>}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Private><ProductList /></Private>} />
          <Route path="/create-order" element={<Private><CreateOrder /></Private>} />
          <Route path="/my-orders" element={<Private><MyOrders /></Private>} />
          <Route path="/orders/:id" element={<Private><OrderDetails /></Private>} />
        </Routes>
      </main>
    </div>
  );
}
