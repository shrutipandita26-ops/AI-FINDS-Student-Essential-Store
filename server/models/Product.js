import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      index: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    originalPrice: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    },
    reviews: {
      type: Number,
      default: 0
    },
    shopId: {
      type: String,
      required: [true, 'Shop ID is required'],
      index: true
    },
    shopName: {
      type: String,
      required: [true, 'Shop Name is required']
    },
    condition: {
      type: String,
      default: 'Brand New'
    },
    image: {
      type: String,
      required: [true, 'Image URL is required']
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    specs: {
      type: [String],
      default: []
    },
    inStock: {
      type: Boolean,
      default: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    tags: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Virtual id for frontend compatibility
productSchema.virtual('id').get(function () {
  return this.productId || this._id.toHexString();
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export const Product = mongoose.model('Product', productSchema);
