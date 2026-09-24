import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api.get(`/orders/${id}`).then((res) => setOrder(res.data)).catch(() => setError('Order not found')); }, [id]);
  const updateStatus = async (status) => {
    try { const { data } = await api.put(`/orders/${id}/status`, { status }); setOrder({ ...order, status: data.status }); setError(''); }
    catch (err) { setError(err.response?.data?.message || 'Update failed'); }
  };
  if (!order) return <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">{error || 'Loading order…'}</div>;
  return (
    <section>
      <Link to="/my-orders" className="mb-4 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-800">← Back to orders</Link>
      <div className="mb-6"><p className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-600">Order details</p><h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Order #{order._id.slice(-6)}</h1></div>
      {error && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="grid grid-cols-1 gap-5 border-b border-slate-100 pb-5 sm:grid-cols-3">
          <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Placed</p><p className="mt-1 font-semibold text-slate-800">{new Date(order.createdAt).toLocaleString()}</p></div>
          <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total</p><p className="mt-1 font-bold text-slate-900">₹{order.totalAmount}</p></div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Status<select value={order.status} onChange={(e) => updateStatus(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold capitalize text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></label>
        </div>
        <h2 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wider text-slate-500">Items</h2>
        <div className="space-y-2">{order.items.map((i) => <div key={i._id} className="flex flex-col gap-1 rounded-lg bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><span className="font-semibold text-slate-800">{i.product?.name || 'Product'} <span className="font-normal text-slate-500">× {i.quantity}</span></span><span className="text-sm text-slate-500">₹{i.price} each</span></div>)}</div>
      </div>
    </section>
  );
}
