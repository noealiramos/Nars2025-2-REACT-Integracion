import mongoose from 'mongoose';

const shippingAddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 200,
  },
  city: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  state: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  postalCode: {
    type: String,
    required: true,
    trim: true,
    minlength: 4, // <-- antes  min/max (num). Para string usa minlength/maxlength
    maxlength: 6,
  },
  country: {
    type: String,
    required: true,
    default: 'México',
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 15,
  },
  isDefault: {
    type: Boolean,
    default: false,
    index: true,
  },
  addressType: {
    type: String,
    enum: ['home', 'work', 'other'],
    default: 'home',
  },
}, { timestamps: true }); // añade createdAt/updatedAt

// Índices útiles
shippingAddressSchema.index({ user: 1, createdAt: -1 });


const ShippingAddress = mongoose.model('ShippingAddress', shippingAddressSchema);
export default ShippingAddress;
