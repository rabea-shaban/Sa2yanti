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
      enum: ['pending', 'accepted', 'done'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model('Order', orderScema);

export default Order;
