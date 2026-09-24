import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function CreateOrder() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [qty, setQty] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data));
  }, []);

  const items = Object.entries(qty)
    .filter(([, q]) => q > 0)
    .map(([product, quantity]) => ({ product, quantity }));

  const total = items.reduce(
    (sum, i) => sum + i.quantity * (products.find((p) => p._id === i.product)?.price || 0),
    0
  );

  const submit = async () => {
    try {
      const { data } = await api.post('/orders', { items });
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Create Order</h1>
      {error && <p className="text-red-600">{error}</p>}
      {products.map((p) => (
        <div key={p._id} className="flex justify-between border p-2 mb-2">
          <span>{p.name} — ₹{p.price} (stock: {p.stock})</span>
          <input
            type="number"
            min="0"
            max={p.stock}
            value={qty[p._id] || 0}
            onChange={(e) => setQty({ ...qty, [p._id]: Number(e.target.value) })}
            className="border w-20 p-1"
          />
        </div>
      ))}
      <p className="my-2">Total: ₹{total}</p>
      <button onClick={submit} disabled={!items.length} className="border p-2">Place Order</button>
    </div>
  );
}
