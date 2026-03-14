import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    index: true,
  },
  hashPassword: {
    type: String,
    required: true,
    select: false, // no exponer por defecto
  },
  role: {
    type: String,
    enum: ['admin', 'customer', 'guest'],
    default: 'customer',
    index: true,
  },
  phone: {
    type: String,
    maxlength: 10,
  },
  avatar: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
    index: true,
  },
}, { timestamps: true });

userSchema.pre('save', function(next) {
  if (this.email) this.email = this.email.toLowerCase();
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
