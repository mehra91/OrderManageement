import { Router } from 'express';
import auth from '../middleware/auth.js';
import Order, { STATUSES } from '../models/Order.js';
import Product from '../models/Product.js';

const router = Router();
router.use(auth);

const restoreStock = (items) =>
  Promise.all(items.map((i) => Product.updateOne({ _id: i.product }, { $inc: { stock: i.quantity } })));

// POST /api/orders   body: { items: [{ product, quantity }] }
router.post('/', async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items) || !items.length)
    return res.status(400).json({ message: 'Items are required' });

  const reserved = [];
  let totalAmount = 0;
  try {
    for (const { product, quantity } of items) {
      const qty = Number(quantity);
      // atomically take stock only if enough is available
      const p =
        Number.isInteger(qty) && qty > 0
          ? await Product.findOneAndUpdate(
              { _id: product, stock: { $gte: qty } },
              { $inc: { stock: -qty } },
              { new: true }
            )
          : null;
      if (!p) throw Object.assign(new Error('Invalid item or insufficient stock'), { status: 400 });
      reserved.push({ product: p._id, quantity: qty, price: p.price });
      totalAmount += p.price * qty;
    }
  } catch (err) {
    await restoreStock(reserved); // undo partial reservations
    throw err;
  }

  const order = await Order.create({ user: req.userId, items: reserved, totalAmount });
  res.status(201).json(order);
});

// GET /api/orders  (logged-in user's orders)
router.get('/', async (req, res) => {
  res.json(await Order.find({ user: req.userId }).sort({ createdAt: -1 }));
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.userId }).populate(
    'items.product',
    'name'
  );
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

// PUT /api/orders/:id/status   body: { status }
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const order = await Order.findOne({ _id: req.params.id, user: req.userId });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.status === 'cancelled')
    return res.status(400).json({ message: 'Cancelled order cannot be changed' });

  if (status === 'cancelled') await restoreStock(order.items);
  order.status = status;
  await order.save();
  res.json(order);
});

export default router;
