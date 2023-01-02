const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Types.ObjectId,
        ref: 'appointment'
    },
    type_visit: {
        type: String,
        default: '',
        required: true
    },
    purpose: {
        type: String,
        default: '',
        required: true
    },
    visit_price: Array,
    paymentID: String,
    method: String,
    paid: {
        type: Boolean,
        default: false
    },
    dateOfPayment: Date
}, {timestamps: true})

let Dataset = mongoose.models.home_service || mongoose.model('home_service', serviceSchema)
export default Dataset