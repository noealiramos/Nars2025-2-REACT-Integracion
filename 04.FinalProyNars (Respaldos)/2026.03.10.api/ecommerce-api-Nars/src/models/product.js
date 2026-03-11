import mongoose from 'mongoose';
import { MATERIALS, DESIGNS, STONES } from '../config/catalog.js';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },

  // Comerciales que ya usas hoy
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  imagesUrl: [{
    type: String,
    default: 'https://placehold.co/800x600.png',
    trim: true,
  }],

  // Relación
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

  // 🔹 Nuevos atributos de joyería
  material: { type: String, enum: MATERIALS, required: true },
  design:   { type: String, enum: DESIGNS, required: true },
  stone:    { type: String, enum: STONES, default: null }, // obligatorio si design = "Con piedra mineral"
}, { timestamps: true });

// Regla de negocio: si design = "Con piedra mineral" -> stone obligatorio
productSchema.pre('validate', function (next) {
  if (this.design === "Con piedra mineral" && !this.stone) {
    return next(new Error('El campo "stone" es obligatorio cuando design = "Con piedra mineral".'));
  }
  next();
});

// Índices para filtros
productSchema.index({ category: 1 });
productSchema.index({ material: 1, design: 1, stone: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
