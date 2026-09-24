import mongoose from 'mongoose';

export const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: STATUSES, default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
