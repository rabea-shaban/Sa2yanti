import mongoose from 'mongoose';
const orderScema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    service: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    rating: {
      type: Number,
      default: 0, // 0 means unrated
    },
    comment: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model('Order', orderScema);

export default Order;
