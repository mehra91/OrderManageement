import { useEffect, useState } from 'react';
import api from '../api';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  useEffect(() => { api.get('/products').then((res) => setProducts(res.data)); }, []);
  return (
    <section>
      <div className="mb-6"><p className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-600">Browse catalog</p><h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Products</h1><p className="mt-2 text-slate-500">Explore available products and current stock.</p></div>
      {products.length === 0 ? <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-slate-500">No products available right now.</div> :
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => <article key={p._id} className="flex min-h-44 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
            <h2 className="text-lg font-bold text-slate-900">{p.name}</h2><p className="mt-2 flex-1 text-sm leading-6 text-slate-500">{p.description || 'No description available.'}</p>
            <div className="mt-5 flex items-center justify-between gap-3"><span className="text-lg font-extrabold text-blue-700">₹{p.price}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{p.stock} in stock</span></div>
          </article>)}
        </div>}
    </section>
  );
}
