const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Types.ObjectId,
        ref: 'appointment'
    },
    purpose: {
        type: String,
        default: '',
        required: true
    },
    checkup_result: Array,
    dose: {
        type: String,
        default: '',
        required: true
    },
    no_of_doses: {
        type: Number,
        default: 0,
        required: true
    },
    repeat_doses: {
        type: Boolean,
        default: false
    },
    interval: {
        type: Number,
        default: 0,
        required: true
    },
    diagnostic_test: {
        type: mongoose.Types.ObjectId,
        ref: 'diagnostic_test_result'
    },
}, {timestamps: true})

let Dataset = mongoose.models.vaccination_service || mongoose.model('vaccination_service', serviceSchema)
export default Dataset