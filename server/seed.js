import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';

await mongoose.connect(process.env.MONGO_URI);
await Product.insertMany([
  { name: 'Keyboard', description: 'Mechanical keyboard', price: 2500, stock: 20 },
  { name: 'Mouse', description: 'Wireless mouse', price: 800, stock: 50 },
  { name: 'Monitor', description: '24 inch monitor', price: 9000, stock: 10 },
]);
console.log('Seeded 3 products');
process.exit();
