const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  offer: {
    type: mongoose.Types.ObjectId,
    ref: 'offer'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    trim: true
  },
  discount: Number,
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true
  },
  membership: String,
  images: {
    type: Array,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  inStock: {
    type: Number,
    default: 0,
  },
  sold: {
    type: Number,
    default: 0,
  }
}, {timestamps: true})

let Dataset = mongoose.models.product || mongoose.model('product', productSchema)
export default Dataset