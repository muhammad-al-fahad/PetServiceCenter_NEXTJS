const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
     user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
     },
     address: String,
     number: String,
     cart: Array,
     total: Number,
     paymentID: String,
     method: String,
     delivered: {
        type: Boolean,
        default: false
     },
     paid: {
      type: Boolean,
      default: false
   },
   dateOfPayment: Date
}, {timestamps: true})

let Dataset = mongoose.models.order || mongoose.model('order', orderSchema)
export default Dataset