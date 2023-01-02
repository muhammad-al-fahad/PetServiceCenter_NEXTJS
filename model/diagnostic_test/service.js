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
    test: {
        type: String,
        default: '',
        required: true
    },
    physician_test: {
        type: String,
        default: '',
        required: true
    },
    cardiology_test: {
        type: String,
        default: '',
        required: true
    },
    neptrology_test: {
        type: String,
        default: '',
        required: true
    },
    signs_pet: Array
}, {timestamps: true})

let Dataset = mongoose.models.test_service || mongoose.model('test_service', serviceSchema)
export default Dataset