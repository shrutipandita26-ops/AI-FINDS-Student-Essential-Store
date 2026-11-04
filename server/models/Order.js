import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  shopId: {
    type: String,
    default: ''
  },
  shopName: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  }
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    deliveryType: {
      type: String,
      enum: ['pickup', 'hostel'],
      default: 'pickup'
    },
    destination: {
      type: String,
      required: [true, 'Destination or pickup point is required']
    },
    timeSlot: {
      type: String,
      default: 'Next 15-30 Mins (Ready Queue)'
    },
    paymentMethod: {
      type: String,
      default: 'Pay at Shop Counter (Cash/UPI)'
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(val) => val.length > 0, 'Order must contain at least one item']
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Received', 'Processing', 'Ready for Pickup', 'Out for Delivery', 'Completed', 'Cancelled'],
      default: 'Received'
    },
    date: {
      type: String,
      default: () =>
        new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
    }
  },
  {
    timestamps: true
  }
);

orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

export const Order = mongoose.model('Order', orderSchema);
