import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function CreateOrder() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [qty, setQty] = useState({});
  const [error, setError] = useState('');
  useEffect(() => { api.get('/products').then((res) => setProducts(res.data)); }, []);
  const items = Object.entries(qty).filter(([, q]) => q > 0).map(([product, quantity]) => ({ product, quantity }));
  const total = items.reduce((sum, i) => sum + i.quantity * (products.find((p) => p._id === i.product)?.price || 0), 0);
  const submit = async () => {
    try { const { data } = await api.post('/orders', { items }); navigate(`/orders/${data._id}`); }
    catch (err) { setError(err.response?.data?.message || 'Order failed'); }
  };
  return (
    <section>
      <div className="mb-6"><p className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-600">Checkout</p><h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create order</h1><p className="mt-2 text-slate-500">Choose quantities for the products you need.</p></div>
      {error && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {products.length === 0 ? <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-slate-500">No products available to order.</div> : <>
        <div className="space-y-3">{products.map((p) => <article key={p._id} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="min-w-0"><h2 className="font-bold text-slate-900">{p.name}</h2><p className="mt-1 text-sm text-slate-500">₹{p.price} · {p.stock} in stock</p></div>
          <label className="flex items-center gap-3 text-sm font-semibold text-slate-600">Quantity<input type="number" min="0" max={p.stock} value={qty[p._id] || 0} onChange={(e) => setQty({ ...qty, [p._id]: Math.min(p.stock, Math.max(0, Number(e.target.value))) })} className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-center text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></label>
        </article>)}</div>
        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"><p className="text-slate-500">Order total <strong className="ml-2 text-xl font-extrabold text-slate-900">₹{total}</strong></p><button onClick={submit} disabled={!items.length} className="rounded-lg bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">Place order</button></div>
      </>}
    </section>
  );
}
