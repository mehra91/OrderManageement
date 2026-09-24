import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data)).catch(() => setError('Order not found'));
  }, [id]);

  const updateStatus = async (status) => {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status });
      setOrder({ ...order, status: data.status });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  if (!order) return <p>{error || 'Loading...'}</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Order #{order._id.slice(-6)}</h1>
      {error && <p className="text-red-600">{error}</p>}
      <p>Placed: {new Date(order.createdAt).toLocaleString()}</p>
      <p>Total: ₹{order.totalAmount}</p>
      <p className="mb-2">
        Status:{' '}
        <select value={order.status} onChange={(e) => updateStatus(e.target.value)} className="border p-1">
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </p>
      {order.items.map((i) => (
        <div key={i._id} className="border p-2 mb-2">
          {i.product?.name || 'Product'} × {i.quantity} @ ₹{i.price}
        </div>
      ))}
    </div>
  );
}
