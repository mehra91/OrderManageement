import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const fieldClass = 'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    try { await register(form); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
  };
  return (
    <div className="flex min-h-[65vh] items-center justify-center py-6">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
        <div className="mb-7"><p className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-600">Get started</p><h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create account</h1><p className="mt-2 text-sm text-slate-500">Set up your account to place and track orders.</p></div>
        {error && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Name<input name="name" autoComplete="name" placeholder="Your name" value={form.name} onChange={onChange} className={`${fieldClass} mt-1.5`} required /></label>
          <label className="block text-sm font-semibold text-slate-700">Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={onChange} className={`${fieldClass} mt-1.5`} required /></label>
          <label className="block text-sm font-semibold text-slate-700">Password<input name="password" type="password" autoComplete="new-password" placeholder="At least 6 characters" value={form.password} onChange={onChange} className={`${fieldClass} mt-1.5`} minLength={6} required /></label>
          <button className="w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20">Create account</button>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">Already registered? <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">Log in</Link></p>
      </form>
    </div>
  );
}
