import { useEffect, useState } from 'react';
import api from '../api';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Products</h1>
      {products.map((p) => (
        <div key={p._id} className="border p-2 mb-2">
          <b>{p.name}</b> — ₹{p.price} (stock: {p.stock})
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
}
