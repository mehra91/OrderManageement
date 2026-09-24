import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get('/orders').then((res) => setOrders(res.data)); }, []);
  return (
    <section>
      <div className="mb-6"><p className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-600">Order history</p><h1 className="text-3xl font-extrabold tracking-tight text-slate-900">My orders</h1><p className="mt-2 text-slate-500">View the status and details of your orders.</p></div>
      {orders.length === 0 ? <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-slate-500">No orders yet.</div> : <div className="space-y-3">{orders.map((o) => <Link key={o._id} to={`/orders/${o._id}`} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div><span className="font-bold text-slate-900">Order #{o._id.slice(-6)}</span><span className="mt-1 block text-sm text-slate-500">{new Date(o.createdAt).toLocaleString()}</span></div>
        <div className="flex items-center justify-between gap-4 sm:justify-end"><span className="font-bold text-slate-900">₹{o.totalAmount}</span><span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${o.status === 'delivered' || o.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : o.status === 'cancelled' ? 'bg-red-50 text-red-700' : o.status === 'shipped' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>{o.status}</span></div>
      </Link>)}</div>}
    </section>
  );
}
