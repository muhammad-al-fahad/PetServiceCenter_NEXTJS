const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
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
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    test_type: {
        type: String,
        default: 'all',
        required: true
    },
    reason_test: {
        type: String,
        default: '',
        required: true
    },
    infection: {
        type: Boolean,
        default: false
    },
    injury: {
        type: Boolean,
        default: false
    },
    fracture: {
        type: Boolean,
        default: false
    },
    disease_type: {
        type: String,
        default: 'all',
        required: true
    },
    disease_reason: {
        type: String,
        default: '',
        required: true
    }
}, {timestamps: true})

let Dataset = mongoose.models.test_result || mongoose.model('test_result', resultSchema)
export default Dataset