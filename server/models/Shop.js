import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Shop name is required'],
      trim: true
    },
    category: {
      type: String,
      default: ''
    },
    campusZone: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      required: [true, 'Shop location is required']
    },
    distance: {
      type: String,
      default: ''
    },
    timing: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    whatsapp: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 4.8
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    image: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    specialties: {
      type: [String],
      default: []
    },
    perks: {
      type: [String],
      default: []
    },
    isOpenNow: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

shopSchema.set('toJSON', { virtuals: true });
shopSchema.set('toObject', { virtuals: true });

export const Shop = mongoose.model('Shop', shopSchema);
