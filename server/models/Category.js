import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    iconName: {
      type: String,
      default: 'ShoppingBag'
    },
    shortDesc: {
      type: String,
      default: ''
    },
    badge: {
      type: String,
      default: ''
    },
    itemCount: {
      type: String,
      default: ''
    },
    accentColor: {
      type: String,
      default: '#1B4332'
    }
  },
  {
    timestamps: true
  }
);

categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

export const Category = mongoose.model('Category', categorySchema);
