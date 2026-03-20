import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, trim: true, maxlength: 140 }, // opcional, útil para UI
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    type: { type: String, trim: true, index: true }, // ej: 'order', 'payment', 'system'
    data: { type: mongoose.Schema.Types.Mixed },      // payload adicional opcional
    read: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
