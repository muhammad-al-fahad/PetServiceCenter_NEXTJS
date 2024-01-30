const mongoose = require('mongoose')

const billSchema = new mongoose.Schema({
    operator: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    doctor: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    appointment: {
        type: mongoose.Types.ObjectId,
        ref: 'appointment'
    },
    service: {
        type: String,
        default: '',
        required: true
    },
    result: Array,
    unit_cost: {
        type: Number,
        default: 0,
        required: true
    },
    description: {
        type: String,
        default: '',
        required: true
    },
    city_per_hour: {
        type: Number,
        default: 0,
        required: true
    },
    amount: {
        type: Number,
        default: 0,
        required: true
    },
    paid: {
        type: Boolean,
        default: false,
    },
    paymentID: String,
    method: String,
    dateOfPayment: Date
}, {timestamps: true})

let Dataset = mongoose.models.bill || mongoose.model('bill', billSchema)
export default Dataset