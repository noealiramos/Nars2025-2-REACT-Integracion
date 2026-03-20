import mongoose from 'mongoose';

const wishListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,

    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Un wishlist por usuario (definición única del índice)
wishListSchema.index({ user: 1 }, { unique: true });

const WishList = mongoose.model('WishList', wishListSchema);
export default WishList;
