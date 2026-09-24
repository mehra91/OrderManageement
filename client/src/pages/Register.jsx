import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 max-w-sm">
      <h1 className="text-xl font-bold">Register</h1>
      {error && <p className="text-red-600">{error}</p>}
      <input name="name" placeholder="Name" value={form.name} onChange={onChange} className="border p-2" required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} className="border p-2" required />
      <input name="password" type="password" placeholder="Password (min 6)" value={form.password} onChange={onChange} className="border p-2" minLength={6} required />
      <button className="border p-2">Register</button>
    </form>
  );
}
