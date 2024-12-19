import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: Number,
  duration: String,
  createdAt: { type: Date, default: Date.now },
});

export const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema); 