import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {type: String, required: true},
    description: {type: String, required: true},
    image_url: {type: String, required: true},
    logo_url: {type: String, required: true},
    live_preview_url: {type: String, required: true},
    github_url: {type: String, required: true},
    color: {type: String, required: true},
    category: {type: String, required: true},
  },
  {
    timestamps: true
  }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;