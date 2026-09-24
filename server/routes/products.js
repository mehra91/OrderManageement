import { Router } from 'express';
import auth from '../middleware/auth.js';
import Product from '../models/Product.js';

const router = Router();

// GET /api/products
router.get('/', async (req, res) => {
  res.json(await Product.find().sort({ createdAt: -1 }));
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// POST /api/products (login required)
router.post('/', auth, async (req, res) => {
  const { name, description, price, stock } = req.body;
  res.status(201).json(await Product.create({ name, description, price, stock }));
});

export default router;
