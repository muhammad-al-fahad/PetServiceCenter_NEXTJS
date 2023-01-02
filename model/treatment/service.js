const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Types.ObjectId,
        ref: 'appointment'
    },
    complain: {
        type: String,
        default: '',
        required: true
    },
    food: {
        type: Boolean,
        default: false
    },
    water: {
        type: Boolean,
        default: false
    },
    vomitting: {
        type: Boolean,
        default: false
    },
    coughing: {
        type: Boolean,
        default: false
    },
    sneezing: {
        type: Boolean,
        default: false
    },
    nasal: {
        type: Boolean,
        default: false
    },
    occular: {
        type: Boolean,
        default: false
    },
    dehydration: {
        type: Number,
        default: 0,
        required: true
    },
    temperature: Array,
    crt: {
        type: String,
        default: '',
        required: true
    },
    mucus_membrane: {
        type: String,
        default: '',
        required: true
    },
    facal: {
        type: String,
        default: '',
        required: true
    },
    urine: {
        type: String,
        default: '',
        required: true
    }
}, {timestamps: true})

let Dataset = mongoose.models.treatment_service || mongoose.model('treatment_service', serviceSchema)
export default Dataset