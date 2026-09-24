import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

const respond = (u) => ({
  token: jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' }),
  user: { id: u._id, name: u.name, email: u.email },
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Name, email and password are required' });
  if (await User.findOne({ email: email.toLowerCase() }))
    return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
  res.status(201).json(respond(user));
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = email && (await User.findOne({ email: email.toLowerCase() }));
  if (!user || !(await bcrypt.compare(password || '', user.password)))
    return res.status(401).json({ message: 'Invalid email or password' });
  res.json(respond(user));
});

export default router;
