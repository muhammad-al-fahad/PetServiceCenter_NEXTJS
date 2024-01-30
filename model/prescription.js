const mongoose = require('mongoose')

const prescriptionSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Types.ObjectId,
        ref: 'appointment'
    },
    doctor: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    operator: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    product: Array,
    repeat_prescription: {
        type: Boolean,
        default: false
    },
    no_of_repeat_prescription: {
        type: Number,
        default: 0,
        required: true
    },
    interval_between_repeat: {
        type: Number,
        default: 0,
        required: true
    },
    furthur_information: {
        type: String,
        default: '',
        required: true
    },
    quantity_in_each_repeat: {
        type: Number,
        default: 0,
        required: true
    },
    prescription_expiry_date: {
        type: Date,
        default: Date.now,
        required: true
    },
    total_quantity_to_disease: {
        type: Number,
        default: 0,
        required: true
    }
}, {timestamps: true})

let Dataset = mongoose.models.prescription || mongoose.model('prescription', prescriptionSchema)
export default Dataset