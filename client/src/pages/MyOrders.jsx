import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">My Orders</h1>
      {orders.length === 0 && <p>No orders yet.</p>}
      {orders.map((o) => (
        <Link key={o._id} to={`/orders/${o._id}`} className="block border p-2 mb-2">
          #{o._id.slice(-6)} — ₹{o.totalAmount} — {o.status} — {new Date(o.createdAt).toLocaleString()}
        </Link>
      ))}
    </div>
  );
}
